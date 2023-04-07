import requests
from bs4 import BeautifulSoup
import re
from pymongo import MongoClient
import hashlib
from openpyxl import Workbook

# Url base
urlBase = "https://www.jumbo.cl"
# Header para que detecte que se llama desde un navegador
headers = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36'
}
# Urls que tiran error siempre
urlsBlocked = [
  '/cerveza-sin-alcohol-mestra-330-cc/p'
]

# Conexion a la base de datos
client = MongoClient('mongodb://localhost:27017/')
db = client['Rincon_del_Curao']
products_collection = db['products']
scraper_collection = db['scraper_products']

# Array de producto que no estan en la caleccion de productos
productsNotFound = []

# Contador de productos vistos
contView = 0

def createTitle( productMongo, productData ):
  title = ""
  if(productData['quantity'] > 1):
    title += f"Pack {productData['quantity']} un. "
  
  title += f"{productMongo['name']} {productMongo['package']} "

  if(productMongo['content'] >= 1000):
    title += f"{productMongo['content']/1000} L"
  else:
    title += f"{productMongo['content']} cc"

  return title

def getProductImage( href ):
  while(True):
    try:
      response = requests.get(f'{urlBase}{href}', headers=headers)
      soup = BeautifulSoup(response.content, 'html.parser')
      imgElement = soup.select_one('.product-image-content img')
      imgUrl = imgElement["src"]

      imageResponse = requests.get(imgUrl).content
      with open("Scraper/image.webp", "wb") as archivo:
        archivo.write(imageResponse)

      with open("Scraper/image.webp", "rb") as archivo:
        backendResponse = requests.post("http://localhost:4000/api/scraper_products/upload-image", files={ "image": archivo })

      return backendResponse.json()['imagePath']
    except Exception as e:
      print(f'Error: {e} url: {urlBase}{href}')

def getNewPrices( href ):
  while(True):
    try:
      response = requests.get(f'{urlBase}{href}', headers=headers)
      soup = BeautifulSoup(response.content, 'html.parser')
      infoProduct = soup.select_one('.product-content .product-info .product-info-wrapper')

      # Obtener normalPrice y bestPrice
      normalPrice = infoProduct.select_one(".product-single-pdp .product-single-price-container .product-sigle-price-wrapper")
      if(normalPrice == None):
        normalPrice = infoProduct.select_one(".prices-product .old-price-only .price-product-text .price-product-old-price .price-product-value")
        bestPrice = infoProduct.select_one(".prices-product .regular .price-product-text .price-product-best-wrap .price-product-content .price-product-best .price-wrapper .price-best")
        if(normalPrice == None):
          bestPrice = bestPrice.text.strip()
          normalPrice = bestPrice
        else:
          bestPrice = bestPrice.text.strip()
          normalPrice = normalPrice.text.strip()
      else:
        normalPrice = normalPrice.text.strip()
        bestPrice = normalPrice

      return int(normalPrice.replace('$', '').replace('.', '')), int(bestPrice.replace('$', '').replace('.', ''))
    except Exception as e:
      print(f'Error: {e} url: {urlBase}{href}')

def getPageHash( href ):
  response = requests.get(f'{urlBase}{href}', headers=headers)
  content = response.content
  hash_object = hashlib.sha256(content)
  hash_hex = hash_object.hexdigest()

  return hash_hex

def getProductDB( productData ):
  num_docs = products_collection.count_documents({ "brand": productData['brand'], "alcoholic_grade": productData['alcoholContent'], "content": productData['unitContent'], "package": productData['package'] })
  if(num_docs == 0):
    return None
  elif(num_docs == 1):
    productDB = products_collection.find_one({ "brand": productData['brand'], "alcoholic_grade": productData['alcoholContent'], "content": productData['unitContent'], "package": productData['package'] })
    nameSplit = productDB['name'].replace(f'{productDB["brand"]} ', '').lower().split()
    auxTitle = productData['title'].lower()
    if all(elem in auxTitle.split() for elem in nameSplit):
      return productDB
    else:
      return None

  productCorrect = None
  nameCorrect = []
  auxTitle = productData['title'].lower()
  for productDB in products_collection.find({ "brand": productData['brand'], "alcoholic_grade": productData['alcoholContent'], "content": productData['unitContent'], "package": productData['package'] }):
    nameSplit = productDB['name'].replace(f'{productDB["brand"]} ', '').lower().split()
    if all(elem in auxTitle.split() for elem in nameSplit):
      if(len(nameSplit) > len(nameCorrect)):
        nameCorrect = nameSplit
        productCorrect = productDB

  return productCorrect

def obteinProductData( href, typeProduct ):
  while(True):
    try:
      response = requests.get(f'{urlBase}{href}', headers=headers)
      soup = BeautifulSoup(response.content, 'html.parser')
      infoProduct = soup.select_one('.product-content .product-info .product-info-wrapper')
      # Obtener los dotos desde la info del producto
      brand = infoProduct.select_one(".product-aditional-info .aditional-info .product-brand").text.strip()

      # Obtener normalPrice y bestPrice
      normalPrice = infoProduct.select_one(".product-single-pdp .product-single-price-container .product-sigle-price-wrapper")
      if(normalPrice == None):
        normalPrice = infoProduct.select_one(".prices-product .old-price-only .price-product-text .price-product-old-price .price-product-value")
        bestPrice = infoProduct.select_one(".prices-product .regular .price-product-text .price-product-best-wrap .price-product-content .price-product-best .price-wrapper .price-best")
        if(normalPrice == None):
          bestPrice = bestPrice.text.strip()
          normalPrice = bestPrice
        else:
          bestPrice = bestPrice.text.strip()
          normalPrice = normalPrice.text.strip()
      else:
        normalPrice = normalPrice.text.strip()
        bestPrice = normalPrice

      title = infoProduct.select_one(".product-container-title .product-name").text.strip()

      # Obtener los datos de caracteristicas principales
      productFeatures = soup.select(".product-content .product-wrap-table .product-page-container-technical-information .technical-information-flags .technical-information-flags-container")
      subType = quantity = alcoholContent = unitContent = package = None

      for feature in productFeatures:
        featureTitle = feature.select_one(".technical-information-flags-title-container .technical-information-flags-title").text.strip()
        featureValue = feature.select_one(".technical-information-flags-value-container .technical-information-flags-value").text.strip()

        if 'Tipo de Producto' == featureTitle:
          subType = featureValue
        if 'Cantidad' == featureTitle:
          quantity = int(re.search(r'\d+', featureValue).group())
        if ('Graduación Alcohólica' == featureTitle) or ('Grado' == featureTitle):
          alcoholContent = float(re.search(r'\d+(\.\d+)?', featureValue.replace(',', '.')).group())
        if 'Contenido' == featureTitle:
          match = re.search(r'(\d+(?:\.\d+)?)\s(cc|l|ml)', featureValue.lower())
          unidad = match.group(2)
          unitContent = int(float(match.group(1)) * 1000) if (unidad == 'l') else int(match.group(1))
        if 'Envase' == featureTitle:
          if 'botella' in featureValue.lower():
            package = 'Botella'
          elif 'pack' in featureValue.lower():
            package = None
          else:
            package = featureValue

      # Obtener los datos que quedaron None desde el titulo
      if quantity == None:
        quantity = int(re.search(r'\d+', title).group()) if 'pack' in title.lower() else 1
      if alcoholContent == None:
        if "°" in title:
          match = re.search(r'\d+(\.\d+)?°', title.replace(',', '.')).group()
          alcoholContent = float(match.replace('°', ''))
        elif ('sin alcohol' in subType.lower()) or ('sin alcohol' in title.lower()) or ('cero' in title.lower()) :
          alcoholContent = 0.0
      if unitContent == None:
        match = re.search(r'(\d+(?:\.\d+)?)\s(cc|L)', title)
        if match:
          unidad = match.group(2)
          unitContent = int(float(match.group(1)) * 1000) if unidad == 'L' else int(match.group(1))
      if package == None:
        auxTitle = title.lower()
        if 'botella' in auxTitle:
          package = 'Botella'
        elif 'lata' in auxTitle:
          package = 'Lata'
        elif 'barril' in auxTitle:
          package = 'Barril'
        elif 'caja' in auxTitle:
          package = 'Tetrapack'

      productDict = {}
      productDict['title'] = title
      productDict['brand'] = brand
      productDict['normalPrice'] = int(normalPrice.replace('$', '').replace('.', ''))
      productDict['bestPrice'] = int(bestPrice.replace('$', '').replace('.', ''))
      productDict['type'] = typeProduct
      productDict['subType'] = subType
      productDict['quantity'] = quantity
      productDict['alcoholContent'] = alcoholContent
      productDict['unitContent'] = unitContent
      productDict['package'] = package

      return productDict
    except Exception as e:
      print(f'Error: {e} url: {urlBase}{href}')

def browseProducts( products, typeProduct ):
  for product in products:
    href = product.select_one(".shelf-product-title")["href"]

    # Pasar las urls bloqueadas
    if(href in urlsBlocked):
      continue

    # Verificar que esta entrando a los productos
    global contView
    contView += 1
    print(f'Producto: {contView}, url: {urlBase}{href}')

    # En caso de que exista y este esta fuera de stock se elimina el url de ese producto y si solo esta esa url se elimina el producto de la base de datos
    outOfStock = product.select_one(".out-of-stock")

    # Obtenemos el scraper-producto desde la base de datos mediante el href
    urlSearch = f'{urlBase}{href}'
    scraperProductMongo = scraper_collection.find_one({ "websites.url": urlSearch })

    if(outOfStock != None):
      if(scraperProductMongo != None):
        #eliminar de el website
        scraper_collection.update_one(
          {"websites.url": urlSearch},
          {"$pull": {"websites": {"url": urlSearch}}},
          upsert=False
        )
        #en casde de que se quede sin urls eliminar el producto
        scraper_collection.delete_one(
          {"websites": {"$exists": True, "$size": 0}}
        )
        print('********************************')
        print(f'Elimino un website: {urlSearch}')
        print('********************************')
      continue

    if(scraperProductMongo == None):
      # obtener los datos del producto
      productData = obteinProductData( href, typeProduct )
      # obtener el producto desde la collection de productos
      productMongo = getProductDB(productData)
      if(productMongo != None):
        # verificar si en la tabla scraper esta el producto y su cantidad
        productScraper = scraper_collection.find_one({ "product_id": productMongo['_id'], "quantity": productData['quantity'] })
        if(productScraper != None):
          # si existe agregar la website con su url, nombre, precio, best price y el average
          newWebsite = {
            "website": "Jumbo",
            "url": urlSearch,
            "price": productData['normalPrice'],
            "best_price": productData['bestPrice'],
            "average": 0,
            "last_hash": getPageHash(href)
          }

          productScraper['websites'].append(newWebsite)
          scraper_collection.update_one({"_id": productScraper['_id']}, {"$set": productScraper})

          print('********************************')
          print(f'Agrego un nuevo Website')
          print(f'\t Producto: {productMongo["name"]}')
          print(f'\t Cantidad: {productScraper["quantity"]}')
          print(f'\t URL: {urlSearch}')
          print('********************************')
        else:
          # si no existe crear el scraper product con todos los datos
          newScraperProduct = {
            "product_id": productMongo['_id'],
            "title": createTitle(productMongo, productData),
            "quantity": productData['quantity'],
            "websites": [
              {
                "website": "Jumbo",
                "url": urlSearch,
                "price": productData['normalPrice'],
                "best_price": productData['bestPrice'],
                "average": 0,
                "last_hash": getPageHash(href)
              }
            ],
            "image": getProductImage(href)
          }

          scraper_collection.insert_one(newScraperProduct)

          print('********************************')
          print(f'Agrego un nuevo ScraperProduct')
          print(f'\t Producto: {productMongo["name"]}')
          print(f'\t Cantidad: {productData["quantity"]}')
          print('********************************')
      else:
        # agregarlo a la excel de productos faltantes
        productsNotFound.append(productData)
    else:
      # obtener el hash de la pagina
      new_hash = getPageHash(href)
      for website in scraperProductMongo['websites']:
        if(website['url'] == urlSearch):
          # comparar con el hash de anterior
          if(new_hash != website['last_hash']):
            # obtener los nuevos precios
            newPrice, newBestPrice = getNewPrices(href)
            website['price'] = newPrice
            website['best_price'] = newBestPrice
            website['last_hash'] = new_hash

            scraper_collection.update_one({"_id": scraperProductMongo['_id']}, {"$set": scraperProductMongo})

            print('********************************')
            print(f'Actualizo un website, URL: {urlSearch}')
            print('********************************')
          break

def scrollPages(url):
  maxPage = 10
  currentPage = 1
  # currentPage = 7
  flag = True

  while currentPage <= maxPage:
    # URL de la Pagina con una page
    urlPage = f"{url['url']}?page={currentPage}"
    print('------------------------------------------------------')
    print(f'URL Page: {urlPage}')

    products = []

    while len(products) <= 0:
      response = requests.get(urlPage, headers=headers)

      soup = BeautifulSoup(response.content, "html.parser")

      # Obtener las paginas maximas de productos
      if(flag):
        flag = False
        pageNumbers = soup.select(".paginator-slider .slides .page-number")
        if(len(pageNumbers) != 0):
          maxPage = int(pageNumbers[-1].text.strip())
        else:
          maxPage = 1

      # Se obtienen los productos por medio de un selector CSS
      products = soup.select(".shelf-products-wrap .shelf-content .shelf-product-island")
      print(f'Cantidad de Productos: {len(products)}')

    browseProducts(products, url['typeProduct'])

    # Ir a la siguiente pagina
    currentPage += 1

def jumboSraper():
  urls = [
    {'url': "https://www.jumbo.cl/vinos-cervezas-y-licores/cervezas", 'typeProduct': "Cervezas" },
    # {'url': "https://www.jumbo.cl/vinos-cervezas-y-licores/destilados", 'typeProduct': "Destilado" },
    # {'url': "https://www.jumbo.cl/vinos-cervezas-y-licores/vinos/vinos-tintos", 'typeProduct': "Vino" },
    # {'url': "https://www.jumbo.cl/vinos-cervezas-y-licores/vinos/vinos-blancos", 'typeProduct': "Vino" },
    # {'url': "https://www.jumbo.cl/vinos-cervezas-y-licores/vinos/vinos-rose", 'typeProduct': "Vino" },
    # {'url': "https://www.jumbo.cl/vinos-cervezas-y-licores/vinos/vinos-late-harvest", 'typeProduct': "Vino" },
  ]

  for url in urls:
    scrollPages(url)

def exportData():
  workbook = Workbook()
  sheet = workbook.active

  sheet["A1"] = "Name"
  sheet["B1"] = "Brand"
  sheet["C1"] = "Category"
  sheet["D1"] = "SubCategory"
  sheet["E1"] = "AlcoholicGrade"
  sheet["F1"] = "Content"
  sheet["G1"] = "Package"

  for i, obj  in enumerate(productsNotFound):
    sheet["A" + str(i+2)] = obj["title"]
    sheet["B" + str(i+2)] = obj["brand"]
    sheet["C" + str(i+2)] = obj["type"]
    sheet["D" + str(i+2)] = obj["subType"]
    sheet["E" + str(i+2)] = obj["alcoholContent"]
    sheet["F" + str(i+2)] = obj["unitContent"]
    sheet["G" + str(i+2)] = obj["package"]

  workbook.save(filename="Scraper/productosNotFound.xlsx")

jumboSraper()
exportData()

# getProductImage('/cer-kunstman-vald-pale-al-bot-330cc-5-2-1924619-pak/p')





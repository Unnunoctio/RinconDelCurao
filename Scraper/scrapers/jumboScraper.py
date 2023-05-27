import requests
from bs4 import BeautifulSoup
import database.db as db
import utils.utils as uts
import re

import concurrent.futures

urlBase = "https://www.jumbo.cl"
urlsBlocked = [
  '/cerveza-sin-alcohol-mestra-330-cc/p'
]
urlsCheck = [
  '/pisco-mistral-nobel-fire-30-750cc/p'
]

productsNotFound = []

def getProductImage( productBody, typeProduct ):
  imgElement = productBody.select_one('.product-image-content img')
  imgUrl = imgElement["src"]

  return uts.saveImage(imgUrl, typeProduct)

def getNewPrices( productBody ):
  infoProduct = productBody.select_one('.product-content .product-info .product-info-wrapper')

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

def obteinProductData( productBody, typeProduct ):
  infoProduct = productBody.select_one('.product-content .product-info .product-info-wrapper')
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
  productFeatures = productBody.select(".product-content .product-wrap-table .product-page-container-technical-information .technical-information-flags .technical-information-flags-container")
  subType = quantity = alcoholContent = unitContent = package = None

  for feature in productFeatures:
    featureTitle = feature.select_one(".technical-information-flags-title-container .technical-information-flags-title").text.strip()
    featureValue = feature.select_one(".technical-information-flags-value-container .technical-information-flags-value").text.strip()

    if 'Tipo de Producto' == featureTitle:
      subType = featureValue
    if 'Cantidad' == featureTitle:
      quantity = int(re.search(r'\d+', featureValue).group())
      if quantity > 12 and typeProduct == 'Destilados':
        quantity = 1
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
      elif 'caja' in featureValue.lower() and typeProduct == 'Destilados':
        package = 'Botella'
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

def workInProduct( scraperDB, productResponse, productBody, urlProduct, typeProduct ):
  if(scraperDB == None):
    # obtener los datos del producto
    productData = obteinProductData( productBody, typeProduct )
    # obtener el producto desde la collection de productos
    productDB = db.getProductDB(productData)
    if(productDB != None):
      # verificar si en la tabla scraper esta el producto y su cantidad
      #! productScraper = db.getScraperProductDB({ "product_id": productDB['_id'], "quantity": productData['quantity'] })
      productScraper = db.getScraperProductDB({ "product._id": productDB['_id'], "quantity": productData['quantity'] })
      if(productScraper != None):
        # si existe agregar la website con su url, nombre, precio, best price y el average
        newWebsite = {
          "website": "Jumbo",
          "url": urlProduct,
          "price": productData['normalPrice'],
          "best_price": productData['bestPrice'],
          "average": 0,
          "last_hash": uts.getPageHash(productResponse)
        }

        db.addWebsiteScraperProductDB(newWebsite, productScraper)
      else:
        # si no existe crear el scraper product con todos los datos
        newScraperProduct = {
          #! "product_id": productDB['_id']
          "product": productDB,
          "title": uts.createTitle(productDB, productData),
          "quantity": productData['quantity'],
          "websites": [
            {
              "website": "Jumbo",
              "url": urlProduct,
              "price": productData['normalPrice'],
              "best_price": productData['bestPrice'],
              "average": 0,
              "last_hash": uts.getPageHash(productResponse)
            }
          ],
          "image": getProductImage(productBody, typeProduct)
        }

        db.addScraperProductDB(newScraperProduct)
    else:
      # agregarlo a la excel de productos faltantes
      productsNotFound.append(productData)
  else:
    # obtener el hash de la pagina
    new_hash = uts.getPageHash(productResponse)
    for website in scraperDB['websites']:
      if(website['url'] == urlProduct):
        # comparar con el hash de anterior
        if(new_hash != website['last_hash']):
          # obtener los nuevos precios
          website['price'], website['best_price'] = getNewPrices(productBody)
          website['last_hash'] = new_hash

          db.updateScraperProductDB(scraperDB)
        break

def browseProductTest( urlProduct, typeProduct ):
  # Obtenemos el scraper-producto desde la base de datos mediante el href
  scraperDB = db.getScraperProductDB({ "websites.url": urlProduct })

  while(True):
    productResponse = requests.get(f'{urlProduct}', headers=uts.pageHeaders)
    soup = BeautifulSoup(productResponse.content, "html.parser")
    productBody = soup.select_one(".product-page")

    if(productBody != None):
      workInProduct( scraperDB, productResponse, productBody, urlProduct, typeProduct )
      break
    else:
      print(f'Error: Pagina no cargo, url: {urlProduct}')

def browseProducts( products, typeProduct, page ):
  for product in products:
    href = product.select_one(".shelf-product-title")["href"]
    urlProduct = f'{urlBase}{href}'

    # Pasar las urls bloqueadas
    if(href in urlsBlocked):
      continue

    # Verificar que esta entrando a los productos
    print(f'Page: {page+1}, Producto: {urlBase}{href}')

    # Verificar que pasa por un producto para verificar
    if(href in urlsCheck):
      print('------------------------------')
      print(f'Entro a una pagina para checkear:')
      print(f'URL: {urlBase}{href}')
      print('------------------------------')

    # En caso de que exista y este esta fuera de stock se elimina el url de ese producto y si solo esta esa url se elimina el producto de la base de datos
    outOfStock = product.select_one(".out-of-stock")

    # Obtenemos el scraper-producto desde la base de datos mediante el href
    scraperDB = db.getScraperProductDB({ "websites.url": urlProduct })

    if(outOfStock != None):
      if(scraperDB != None):
        #eliminar de el website
        db.deleteWebsiteScraperProductDB(urlProduct)
      continue

    while(True):
      productResponse = requests.get(f'{urlProduct}', headers=uts.pageHeaders)
      soup = BeautifulSoup(productResponse.content, "html.parser")
      productBody = soup.select_one(".product-page")

      if(productBody != None):
        workInProduct( scraperDB, productResponse, productBody, urlProduct, typeProduct )
        break
      else:
        print(f'Error: Pagina no cargo, url: {urlProduct}')

def browseProductsPage( urlPage, typeProduct, page ):
  print('------------------------------------------------------')
  products = []

  while len(products) <= 0:
    response = requests.get(urlPage, headers=uts.pageHeaders)
    soup = BeautifulSoup(response.content, "html.parser")

    # Se obtienen los productos por medio de un selector CSS
    products = soup.select(".shelf-content .shelf-product-island")
    print(f'URL Page: {urlPage}')
    print(f'Cantidad de Productos: {len(products)}')

  browseProducts(products, typeProduct, page)

def getMaxPage( url ):
  response = requests.get(url, headers=uts.pageHeaders)
  soup = BeautifulSoup(response.content, "html.parser")

  pageNumbers = soup.select(".paginator-slider .slides .page-number")
  if(len(pageNumbers) != 0):
    return int(pageNumbers[-1].text.strip())
  else:
    return 1

def scrollPages(url):
  maxPage = getMaxPage(url['url'])
  urlsPage = [f'{url["url"]}?page={i}' for i in range(1, maxPage+1)]
  
  url_groups = [(urlsPage[i], url['typeProduct'], i) for i in range(0, len(urlsPage))]

  with concurrent.futures.ThreadPoolExecutor(max_workers=4) as executor:
    executor.map(browseProductsPage, *zip(*url_groups))

def jumboScraper():
  urls = [
    # {'url': "https://www.jumbo.cl/vinos-cervezas-y-licores/cervezas", 'typeProduct': "Cervezas" },
    {'url': "https://www.jumbo.cl/vinos-cervezas-y-licores/destilados", 'typeProduct': "Destilados" },
    # {'url': "https://www.jumbo.cl/vinos-cervezas-y-licores/vinos", 'typeProduct': "Vinos" }
  ]

  for url in urls:
    scrollPages(url)
    global productsNotFound
    uts.exportData(f"{url['typeProduct']}_Jumbo", productsNotFound)
    productsNotFound = []

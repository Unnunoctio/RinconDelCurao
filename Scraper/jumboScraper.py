import requests
from bs4 import BeautifulSoup
import re
import time
import random

# Futuro
# Luego de que todos los scraper se ejecuten, se actualizaran lo subTipos de de las Cervezas(Por el momento) obteniendo todos lo productos de una Marca y buscar el primer producto
# que tenga una url de jumbo, obteniendo su subTipo y actualizandoselos a todos los productos de esa marca, en caso de que en la lista no hay ninguna url de jumbo, se actualizaran
# mediante el subtipo del primer producto de esa marca
contProductosValidos = 0

# Url base
urlBase = "https://www.jumbo.cl"

# Header para que detecte que se llama desde un navegador
headers = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36'
}

#
urlsBlocked = [
  '/cerveza-sin-alcohol-mestra-330-cc/p'
]

def obtainBeerProductData( title, mainFeatures, secondaryFeatures, productDict ):
  # Obtener todos los datos desde este array de data
  subType = quantity = alcoholContent = unitContent = style = variant = package = None #style(lager, ale, ...), variante o sabor(torobajo, maracuya, ...)
  
  # Obtener el tipo de producto - main ---------------------------------------------
  subType = mainFeatures['Tipo de Producto'].title()
  if(subType == None):
    return False, productDict
  productDict['subType'] = subType

  # Obtener la cantidad - main, title ----------------------------------------------
  if('Cantidad' in mainFeatures):
    quantity = int(re.search(r'\d+', mainFeatures['Cantidad']).group())
  else:
    if('Pack' in title):
      quantity = int(re.search(r'\d+', title).group())
    else:
      quantity = 1

  if(quantity == None):
    return False, productDict
  productDict['quantity'] = quantity

  # Obtener la graduacion - main, title, secondary ---------------------------------
  if('Graduación Alcohólica' in mainFeatures):
    alcoholContent = float(re.search(r'\d+(\.\d+)?', mainFeatures['Graduación Alcohólica'].replace(',', '.')).group())
  elif('Grado' in mainFeatures):
    alcoholContent = float(re.search(r'\d+(\.\d+)?', mainFeatures['Grado'].replace(',', '.')).group())
  else:
    if "°" in title:
      match = re.search(r'\d+(\.\d+)?°', title.replace(',', '.')).group()
      alcoholContent = float(match.replace('°', ''))
    else:
      gradeIndex = secondaryFeatures.index(next((x for x in secondaryFeatures if '°' in x), None))
      if(gradeIndex != None):
        alcoholContent = float(re.search(r'\d+(\.\d+)?', secondaryFeatures[gradeIndex].replace(',', '.')).group())
  
  if(alcoholContent == None):
    return False, productDict
  productDict['alcoholContent'] = alcoholContent

  # Obtener el contenido de cada botella - main, title -----------------------------
  if('Contenido' in mainFeatures):
    match = re.search(r'(\d+(?:\.\d+)?)\s(cc|l|ml)', mainFeatures['Contenido'].lower())
    unitContent = float(match.group(1))
    unidad = match.group(2)
  else:
    match = re.search(r'(\d+(?:\.\d+)?)\s(cc|L)', title)
    if match:
      unitContent = match.group()
      unitContent = float(match.group(1))
      unidad = match.group(2)

  if(unitContent != None):
    if(unidad == 'L' or unidad == 'l'):
      unitContent *= 1000
    unitContent = int(unitContent)
  else:
    return False, productDict
  productDict['unitContent'] = unitContent

  # Obtener el estilo(lager, pale ale, ipa) - main, secondary ---------------------

  productDict['style'] = style

  # Obtener la variedad o sabor de la cerveza (torobayo, miel, maracuya, etc.) - main, secondary
  if('Variedad' in mainFeatures):
    variant = mainFeatures['Variedad']
  elif('Sabor' in mainFeatures):
    variant = mainFeatures['Sabor']
  else:
    variant = 'Busca en el nombre'

  productDict['variant'] = variant

  # Obtener el envase de la cerveza (botella, lata, barril) - main, title ---------
  if('Envase' in mainFeatures):
    if('Botella' in mainFeatures['Envase']):
      package = 'Botella'
    else:
      package = mainFeatures['Envase']
  else:
    auxTitle = title.lower()
    if 'botella' in auxTitle:
      package = 'Botella'
    elif 'lata' in auxTitle:
      package = 'Lata'
    elif 'barril' in auxTitle:
      package = 'Barril'

  if(package == None):
    return False, productDict
  productDict['package'] = package

  return True, productDict

# antigua
def goToProductBeer( href, typeProduct ):
  # time.sleep(1)

  flag = True
  while(flag):
    try:
      # print(f'{urlBase}{href}')
      # no cargar url bloqueadas
      if(href in urlsBlocked):
        return
      
      response = requests.get(f'{urlBase}{href}', headers=headers)

      soup = BeautifulSoup(response.content, "html.parser")

      infoProduct = soup.select_one(".product-content .product-info .product-info-wrapper")
      # Obtener los datos desde la info del Producto
      title = infoProduct.select_one(".product-container-title .product-name").text.strip()
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

      normalPrice = int(normalPrice.replace('$', '').replace('.', ''))
      bestPrice = int(bestPrice.replace('$', '').replace('.', ''))

      featuresProduct = soup.select(".product-content .product-wrap-table .product-page-container-technical-information .technical-information-flags .technical-information-flags-container")
      # Obtener datos desde las caracteristicas
      subType = quantity = alcoholContent = unitContent = style = package = None
      for feature in featuresProduct:
        featureTitle = feature.select_one(".technical-information-flags-title-container .technical-information-flags-title").text.strip()
        featureValue = feature.select_one(".technical-information-flags-value-container .technical-information-flags-value").text.strip()
        if(featureTitle == 'Tipo de Producto'):
          subType = featureValue
        elif(featureTitle == 'Cantidad'):
          quantity = re.search(r'\d+', featureValue).group()
        elif(featureTitle == 'Graduación Alcohólica' or featureTitle == 'Grado'):
          featureValue = featureValue.replace(',', '.')
          grad = re.search(r'\d+\.\d+', featureValue)
          if(grad == None):
            alcoholContent = re.search(r'\d+', featureValue).group()
          else:
            alcoholContent = re.search(r'\d+\.\d+', featureValue).group()
        elif(featureTitle == 'Contenido'):
          if("L" in featureValue):
            featureValue = featureValue.replace(',', '.')
            content = re.search(r'\d+\.\d+', featureValue)
            if(content == None):
              unitContent = int(re.search(r'\d+', featureValue).group()) * 1000
            else:
              unitContent = int(float(re.search(r'\d+\.\d+', featureValue).group()) * 1000)
          else:
            unitContent = int(re.search(r'\d+', featureValue).group())
        elif(featureTitle == 'Estilo' or featureTitle == 'Variedad' or featureTitle == 'Sabor'):
          auxStyle = featureValue.lower()
          if('cerveza' in auxStyle or len(auxStyle.split(' ')) > 4):
            style = None
          else:
            style = featureValue
        elif(featureTitle == 'Envase'):
          package = featureValue

      if(subType == None or style == None):
        return
      
      # Obtener datos desde el titulo
      title = title.lower()
      if quantity == None:
        if "pack" in title:
          quantity = re.search(r'\d+', title).group()
        else:
          quantity = 1
      
      if package == None:
        if "botella" in title:
          package = "Botella"
        elif "lata" in title:
          package = "Lata"
        elif "barril" in title:
          package = "Barril"

      if unitContent == None:
        cc_content = re.search(r'\d+\scc', title)
        if(cc_content != None):
          cc_content = re.search(r'\d+\scc', title).group()
          unitContent = int(re.search(r'\d+', cc_content).group())
        else:
          auxTitle = title.replace(',', '.')
          l_content = re.search(r'\d+\.\d+\sl', auxTitle)
          if(l_content == None):
            l_content = re.search(r'\d+\sl', auxTitle)
            if(l_content != None):
              l_content = re.search(r'\d+\sl', auxTitle).group()
              unitContent = int(re.search(r'\d+', l_content).group()) * 1000
          else:
            unitContent = int(float(l_content = re.search(r'\d+\.\d+\sl', auxTitle).group()) * 1000)

      if alcoholContent == None:
        if "°" in title:
          auxTitle = title.replace(',', '.')
          grad = re.search(r'\d+\.\d+°', auxTitle)
          if(grad == None):
            alcoholContent = re.search(r'\d+', auxTitle).group()
          else:
            alcoholContent = re.search(r'\d+\.\d+', auxTitle).group()

      # Verificamos que ninguan variable necesaria sea Nula en caso de que contenga una nula ya no es un producto valido para guardarse
      if(quantity == None or alcoholContent == None or unitContent == None or package == None):
        return

      productObject = {}

      # Generamos un Titulo estructuro para todas las cervezas
      productTitle = ''
      if(int(quantity) > 1):
        productTitle = f'Pack {quantity} un. Cerveza {brand} '
      else:
        productTitle = f'Cerveza {brand} '

      if(package == 'Barril'):
        productTitle += 'Barril '
      else:
        productTitle += f'{style} '
      
      if(unitContent >= 1000):
        productTitle += f'{unitContent/1000} L'
      else:
        productTitle += f'{unitContent} cc'

      productObject['title'] = productTitle # Si estructuro el titulo podria ocuparse para el filtro enves de las otras variables
      productObject['brand'] = brand #para el filtro
      productObject['normalPrice'] = normalPrice
      productObject['bestPrice'] = bestPrice
      productObject['type'] = typeProduct
      productObject['subType'] = subType
      productObject['quantity'] = int(quantity) #para el filtro
      productObject['alcoholContent'] = float(alcoholContent) #para el filtro
      productObject['unitContent'] = unitContent #para el filtro
      productObject['style'] = style #para el filtro
      productObject['package'] = package #para el filtro

      print(productObject)
      print('----------------------')
      global contProductosValidos
      contProductosValidos += 1
      flag = False # Termina el ciclo
    except Exception as e:
      # En caso de error vuelve a ejecutar el bloque de codigo
      print('**********************')
      print(f'Exception: {e}')
      print('**********************')

# nuevo
def goToBeerProduct( href, typeProduct ):
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

  # Obtener los datos de caracteristicas adicionales
  infoFeatures = infoProduct.select(".product-main-description .product-main-description-short li")
  secondaryFeatures = []
  for feature in infoFeatures:
    secondaryFeatures.append(feature.text.strip())
  
  # Obtener los datos de caracteristicas principales
  productFeatures = soup.select(".product-content .product-wrap-table .product-page-container-technical-information .technical-information-flags .technical-information-flags-container")
  mainFeatures = {}
  for feature in productFeatures:
    featureTitle = feature.select_one(".technical-information-flags-title-container .technical-information-flags-title").text.strip()
    mainFeatures[featureTitle] = feature.select_one(".technical-information-flags-value-container .technical-information-flags-value").text.strip()

  productDict = {}
  productDict['brand'] = brand
  productDict['normalPrice'] = int(normalPrice.replace('$', '').replace('.', ''))
  productDict['bestPrice'] = int(bestPrice.replace('$', '').replace('.', ''))
  productDict['type'] = typeProduct

  productValid, productDict = obtainBeerProductData(title, mainFeatures, secondaryFeatures, productDict)

  print(f'Valido: {productValid}, producto: {productDict}')
  print('-------------------')

def browseProducts( products, typeProduct ):
  for product in products:
    href = product.select_one(".shelf-product-title")["href"]

    # Obtenemos el producto desde la base de datos mediante el href

    # En caso de que exista y este esta fuera de stock se elimina el url de ese producto y si solo esta esa url se elimina el producto de la base de datos
    outOfStock = product.select_one(".out-of-stock")
    if(outOfStock != None):
      continue

    # En caso de que exista y tiene stock se va hacia metodo del hash para ver si cambio o no, si cambio se actualizan los precios y el hash
    
    # En caso de no existir se llaman los metodos respectivos para agregar los datos a la base de datos
    if(typeProduct == 'Cerveza'):
      goToProductBeer(href, typeProduct)
    elif (typeProduct == 'Destilado'):
      pass
    elif (typeProduct == 'Vino'):
      pass

def scrollPages(url):
  maxPage = 10
  currentPage = 1
  # currentPage = 7
  flag = True

  while currentPage <= maxPage:
    # URL de la Pagina con una page
    urlPage = f"{url['url']}?page={currentPage}"
    print(f'URL Page: {urlPage}')
    print('##########################')

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
    
    browseProducts(products, url['typeProduct'])

    # Ir a la siguiente pagina
    currentPage += 1
  
  print('#-#-#-#-#-#-#--#-#-#-#--#')
  global contProductosValidos
  print(f'Cantidad de Productos Validos: {contProductosValidos}')

def jumboSraper():
  urls = [
    {'url': "https://www.jumbo.cl/vinos-cervezas-y-licores/cervezas", 'typeProduct': "Cerveza" },
    # {'url': "https://www.jumbo.cl/vinos-cervezas-y-licores/destilados", 'typeProduct': "Destilado" },
    # {'url': "https://www.jumbo.cl/vinos-cervezas-y-licores/vinos/vinos-tintos", 'typeProduct': "Vino" },
    # {'url': "https://www.jumbo.cl/vinos-cervezas-y-licores/vinos/vinos-blancos", 'typeProduct': "Vino" },
    # {'url': "https://www.jumbo.cl/vinos-cervezas-y-licores/vinos/vinos-rose", 'typeProduct': "Vino" },
    # {'url': "https://www.jumbo.cl/vinos-cervezas-y-licores/vinos/vinos-late-harvest", 'typeProduct': "Vino" },
  ]

  for url in urls:
    scrollPages(url)

# jumboSraper()

# # Verificar funcionamiento de obtener la cantidad en cc de cada uno - FUNCIONAN
# goToBeerProduct('/pack-cerveza-lemon-stones-maracuya-6-unid-350-cc-c-u/p', 'Cerveza') # mainFeatures, en ml
# goToBeerProduct('/cerveza-bitburger-barril-5-l-48/p', 'Cerveza') # mainFeatures en L
# goToBeerProduct('/pack-de-cervezas-kunstman-s-alcohol-330-cc/p', 'Cerveza') # title en cc
# goToBeerProduct('/cerveza-kulmbacher-5-l-alemana-premium/p', 'Cerveza') # title en L

# # Verificar funcionamiento de obtener la catidad de producto - FUNCIONAN
# goToBeerProduct('/pack-cerveza-lemon-stones-maracuya-6-unid-350-cc-c-u/p', 'Cerveza') # mainFeatures, 6 Unidades
# goToBeerProduct('/pack-de-cervezas-kunstman-s-alcohol-330-cc/p', 'Cerveza') # mainFeatures, 1 Unidad
# goToBeerProduct('/pack-cerveza-sol-18-unid-330-cc-c-u/p', 'Cerveza') # title, 18 un.
# goToBeerProduct('/cerveza-kulmbacher-5-l-alemana-premium/p', 'Cerveza') # title, sin unidades: 1

# # Verificar funcionamiento de obtener el contenido alcoholico - FUNCIONAN
# goToBeerProduct('/cerveza-kunstman-sin-filtrar-5-0-botella-330-cc/p', 'Cerveza') # mainFeatures, Graduación Alcohólica
# goToBeerProduct('/pack-cerveza-lemon-stones-maracuya-6-unid-350-cc-c-u/p', 'Cerveza') # mainFeatures, Grado
# goToBeerProduct('/cerv-coors-stubby-5-0g-bot-355cc-2/p', 'Cerveza') # mainFeatures, Graduación Alcohólica, 5°
# goToBeerProduct('/cerveza-benediktiner-500-ml-weiss-5-4/p', 'Cerveza') # title, 5.4°
# goToBeerProduct('/cer-hnk-sil-bot4-g-pak/p', 'Cerveza') # title, 4°
# goToBeerProduct('/pack-de-cervezas-kunstmann-pack-12-unid-330-cc-cu-torobayo/p', 'Cerveza') # secondary, 5 grados
# goToBeerProduct('/pack-cerveza-sol-18-unid-330-cc-c-u/p', 'Cerveza') # secondary, 4.1°

# Verificar funcionamiento de obtener 




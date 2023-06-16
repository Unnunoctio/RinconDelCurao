import scrapy
import logging
import re
from scraper.items import ProductItem
import api.api as api
import utils.utils as uts

class JumboSpider(scrapy.Spider):
  name = "jumbo_spider"
  start_urls = [
    "https://www.jumbo.cl/vinos-cervezas-y-licores/cervezas",
    "https://www.jumbo.cl/vinos-cervezas-y-licores/destilados",
    "https://www.jumbo.cl/vinos-cervezas-y-licores/vinos",
  ]

  products_not_found = []

  def parse(self, response):
    logging.getLogger().setLevel(logging.INFO)

    max_pages = self.get_max_pages(response)
    
    for page in range(1, max_pages+1):
      url = self.get_url_page(response, page)
      yield scrapy.Request(url, callback=self.parse_products)

  def get_max_pages(self, response):
    pages = response.css('button.page-number')
    return len(pages) if len(pages) != 0 else 1
  
  def get_url_page(self, response, page):
    current_url = response.request.url
    return f'{current_url}?page={page}'

  def parse_products(self, response):
    print(response.request.url)

    products = response.css('div.shelf-product-island')
    for product in products:
      href = product.css('a.shelf-product-title::attr(href)').get()
      url_product = f'https://www.jumbo.cl{href}'

      #TODO Obtenemos el producto
      productApi = api.is_product_exist(url_product)
      #! Producto fuera de Stock
      if product.css('span.out-of-stock'):
        if productApi:
          api.remove_website(url_product)
        continue
        
      #TODO Trabajar el producto
      yield scrapy.Request(url_product, callback=self.parse_product)

  def parse_product(self, response):
    url_product = response.request.url
    page_hash = uts.get_page_hash(response.body)
    productApi = api.is_product_exist(url_product)

    print(url_product)
    if productApi:
      price, best_price = self.get_prices(response)
      website = {
        "name": "Jumbo",
        "url": url_product,
        "price": price,
        "best_price": best_price,
        "last_hash": page_hash
      }
      api.update_website(website)
    else:
      product_data = self.get_product_data(response)
      product_data['image_url'] = self.get_product_image(response)

      if product_data.is_values_none():
        self.products_not_found.append(product_data)
        return

      website = {
        "name": "Jumbo",
        "url": url_product,
        "price": product_data['price'],
        "best_price": product_data['best_price'],
        "last_hash": page_hash
      }
      
      new_product = api.add_product(product_data, website)
      if new_product == None:
        self.products_not_found.append(product_data)
      
  def get_prices(self, response):
    price = response.css('span.product-sigle-price-wrapper::text').get()
    if price == None:
      #TODO: price y best-price
      price = response.css('span.price-product-value::text').get()
      best_price = response.css('span.price-best::text').get()
      if price == None:
        price = best_price
    else:
      best_price = price
    
    return int(re.sub(r'[$.]', '', price)), int(re.sub(r'[$.]', '', best_price))
  
  def get_product_data(self, response):
    product_data = ProductItem()
    product_data['title'] = response.css('h1.product-name::text').get()
    product_data['brand'] = response.css('a.product-brand::text').get()
    product_data['price'], product_data['best_price'] = self.get_prices(response)

    features = response.css('div.technical-information-flags-container')
    for feature in features:
      title = feature.css('span.technical-information-flags-title::text').get()
      value = feature.css('span.technical-information-flags-value::text').get()

      if title == 'Tipo de Producto':
        product_data['sub_category'] = value
      elif title == 'Cantidad':
        quantity_match = re.search(r'\d+', value)
        product_data['quantity'] = int(quantity_match.group()) if quantity_match else None
      elif title == 'Graduación Alcohólica' or title == 'Grado':
        alcoholic_match = re.search(r'\d+(\.\d+)?', value.replace(',', '.'))
        product_data['alcoholic_grade'] = float(alcoholic_match.group()) if alcoholic_match else None
      elif title == 'Contenido':
        content_match = re.search(r'(\d+(?:\.\d+)?)\s(cc|l|ml)', value.lower())
        if content_match:
          unit_match = content_match.group(2)
          product_data['content'] = int(float(content_match.group(1)) * 1000) if unit_match == 'l' else int(content_match.group(1))
        else:
          product_data['content'] = None
      elif title == 'Envase':
        if 'botella' in value.lower():
          product_data['package'] = 'Botella'
        elif 'pack' in value.lower():
          product_data['package'] = None
        else:
          product_data['package'] = value
    
    #TODO: Obtener los datos faltantes desde el titulo
    title = product_data['title'].lower()
    if product_data['quantity'] == None:
      quantity_match = re.search(r'(\d+)\s*un.', title)
      if quantity_match:
        product_data['quantity'] = int(quantity_match.group(1))
      else:
        if 'bipack' in title:
          product_data['quantity'] = 2
        elif 'pack' in title:
          product_data['quantity'] = None
        else:
          product_data['quantity'] = 1
    if product_data['alcoholic_grade'] == None:
      if '°' in title:
        alcoholic_match = re.search(r'\d+(\.\d+)?°', title.replace(',', '.'))
        product_data['alcoholic_grade'] = float(alcoholic_match.group().replace('°', '')) if alcoholic_match else None
      elif 'sin alcohol' in product_data['sub_category'].lower() or 'sin alcohol' in title:
        product_data['alcoholic_grade'] = 0.0
    if product_data['content'] == None:
      content_match = re.search(r'(\d+(?:\.\d+)?)\s(cc|l)', title)
      if content_match:
        unit_match = content_match.group(2)
        product_data['content'] = int(float(content_match.group(1)) * 1000) if unit_match == 'l' else int(content_match.group(1))
    if product_data['package'] == None:
      if 'botella' in title:
        product_data['package'] = 'Botella'
      elif 'lata' in title:
        product_data['package'] = 'Lata'
      elif 'barril' in title:
        product_data['package'] = 'Barril'
      elif 'caja' in title:
        product_data['package'] = 'Tetrapack'
      
    #TODO: cambiar caja a botella en los destilados
    if product_data['sub_category'] != None and product_data['package'] != None:
      distillates = ['pisco', 'ron', 'tequila', 'vodka', 'whisky', 'gin']
      if product_data['sub_category'].lower() in distillates and product_data['package'].lower() == 'caja':
        product_data['package'] = 'Botella'

    return product_data

  def get_product_image(self, response):
    img_url = response.css('div.product-image-content img::attr(src)').get()
    return img_url
  
  def closed(self, reason):
    uts.export_data('Products_Jumbo', self.products_not_found)
    print('Jumbo Scraper Closed.')
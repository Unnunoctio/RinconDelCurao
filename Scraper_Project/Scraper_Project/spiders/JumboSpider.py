import scrapy
import logging
import re
from Scraper_Project.items import ProductItem
import database.db as db
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

      #TODO Obtenemos el producto desde la base de datos
      scraper_db = db.get_scraper_by_url(url_product)
      
      #! Producto fuera de Stock
      if product.css('span.out-of-stock'):
        if scraper_db != None:
          db.delete_website(url_product)
        continue
        
      #TODO Trabajar el producto
      yield scrapy.Request(url_product, callback=self.parse_product)

  def parse_product(self, response):
    url_product = response.request.url
    page_hash = uts.get_page_hash(response.body)
    scraper_db = db.get_scraper_by_url(url_product)

    print(url_product)

    if(scraper_db == None):
      #TODO: Obtener los datos del producto y el producto en la DB
      product_data = self.get_product_data(response)
      product_db = db.get_product(product_data)
      #TODO: Verificar si existe
      if product_db != None:
        product_data = self.update_product_data(product_data, product_db)
        scraper_db = db.get_scraper(product_db['_id'], product_data['quantity'])
        if scraper_db != None:
          db.add_website('Jumbo', url_product, scraper_db, product_data, page_hash)
        else:
          image_path = self.get_product_image(response, product_db['category'])
          title = uts.create_title(product_db, product_data)
          db.add_scraper('Jumbo', url_product, title, product_db, product_data, page_hash, image_path)
      else:
        #! Producto no existe en base de datos
        self.products_not_found.append(product_data)
    else:
      website = next((w for w in scraper_db['websites'] if w['url'] == url_product), None)
      if website:
        if page_hash != website['last_hash']:
          #TODO: Obtener los nuevos precios
          website['price'], website['best_price'] = self.get_prices(response)
          website['last_hash'] = page_hash
          db.update_scraper(scraper_db)
      
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
          product_data['content_unit'] = int(float(content_match.group(1)) * 1000) if unit_match == 'l' else int(content_match.group(1))
        else:
          product_data['content_unit'] = None
      elif title == 'Envase':
        if 'botella' in value.lower():
          product_data['packaging'] = 'Botella'
        elif 'pack' in value.lower():
          product_data['packaging'] = None
        else:
          product_data['packaging'] = value
    
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
    if product_data['content_unit'] == None:
      content_match = re.search(r'(\d+(?:\.\d+)?)\s(cc|l)', title)
      if content_match:
        unit_match = content_match.group(2)
        product_data['content_unit'] = int(float(content_match.group(1)) * 1000) if unit_match == 'l' else int(content_match.group(1))
    if product_data['packaging'] == None:
      if 'botella' in title:
        product_data['packaging'] = 'Botella'
      elif 'lata' in title:
        product_data['packaging'] = 'Lata'
      elif 'barril' in title:
        product_data['packaging'] = 'Barril'
      elif 'caja' in title:
        product_data['packaging'] = 'Tetrapack'
      
    return product_data
  
  def update_product_data(self, product_data, product_db):
    # if product_data['quantity'] != None:
    #   if product_data['quantity'] > 12 and product_db['category'] == 'Destilados':
    #     product_data['quantity'] = 1
    
    if product_data['packaging'] != None:
      if 'caja' in product_data['packaging'].lower() and product_db['category'] == 'Destilados':
        product_data['packaging'] = 'Botella'

    return product_data

  def get_product_image(self, response, category_product):
    img_url = response.css('div.product-image-content img::attr(src)').get()
    
    return uts.save_product_image(img_url, category_product)
  
  def closed(self, reason):
    uts.export_data('Products_Jumbo', self.products_not_found)
    print('Jumbo Scraper Closed.')
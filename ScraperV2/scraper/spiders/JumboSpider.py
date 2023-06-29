import requests
import sys
import os
import re
import time
import concurrent.futures

current_dir = os.path.dirname(os.path.abspath(__file__))
module_api_dir = os.path.join(current_dir, '..', '..', 'api')
module_items_dir = os.path.join(current_dir, '..')
sys.path.append(module_api_dir)
sys.path.append(module_items_dir)

import api
from items import ProductItem

class JumboSpider:
  headers = {
    "apiKey": "WlVnnB7c1BblmgUPOfg"
  }
  starts_urls = [
    "https://sm-web-api.ecomm.cencosud.com/catalog/api/v4/products/vinos-cervezas-y-licores/cervezas?sc=11", # Add Page
    "https://sm-web-api.ecomm.cencosud.com/catalog/api/v4/products/vinos-cervezas-y-licores/destilados?sc=11", # Add Page
    "https://sm-web-api.ecomm.cencosud.com/catalog/api/v4/products/vinos-cervezas-y-licores/vinos?sc=11" # Add Page
  ]
  base_url = "https://jumbo.cl"
  base_product_url = "https://sm-web-api.ecomm.cencosud.com/catalog/api/v1/product"


  def _init__(self):
    if not self.starts_urls:
      self.starts_urls = []


  def run(self):
    t1 = time.time()
    self.start_requests()
    print('######################################')
    print('Finalizado en: ', time.time() - t1, 'segundos')


  def start_requests(self):
    # TODO: Recorre las urls
    request_executor = concurrent.futures.ThreadPoolExecutor(max_workers=3)
    request_futures = [request_executor.submit(self.start_pages, url) for url in self.starts_urls]
    
    concurrent.futures.wait(request_futures)


  def start_pages(self, url):
    # TODO: Recorre las páginas
    page = 0
    while True:
      page += 1
      res = requests.get(f'{url}&page={page}', headers=self.headers)
      if res.status_code == 200 and len(res.json()['products']) > 0:
        self.parse(res)
      else:
        break
    print('Finalizado.')
  
  def parse(self, response):
    print(response.url)

    executor = concurrent.futures.ThreadPoolExecutor(max_workers=4)
    futures = [executor.submit(self.process_product, product_list) for product_list in response.json()['products']]
    
    concurrent.futures.wait(futures)

  def process_product(self, product_list):
    product_link = product_list['linkText']
    res = requests.get(f'{self.base_product_url}/{product_link}', headers=self.headers)
    if res.status_code == 200:
      product = res.json()[0]
      url_product = f"{self.base_url}/{product['linkText']}/p"

      #! Producto sin stock
      if not self.is_product_stock(product):
        if api.is_product_exist(url_product):
          api.remove_website(url_product)
        return
      
      self.parse_product(product)
      

  def is_product_stock(self, product):
    stock_product = product['items'][0]['sellers'][0]['commertialOffer']['AvailableQuantity']
    if stock_product == 0:
      return False
    return True
  

  def parse_product(self, product):
    url_product = f"{self.base_url}/{product['linkText']}/p"
    is_product_api = api.is_product_exist(url_product)

    if is_product_api:
      #TODO: Actualiza el producto
      product_data = self.get_update_data(product)
      website = {
        "name": "Jumbo",
        "url": url_product,
        "price": product_data.price,
        "best_price": product_data.best_price,
        "average": product_data.average
      }
      api.update_product(website)
    else:
      #TODO: Guarda el producto
      product_data = self.get_product_data(product)

      if product_data.is_values_none():
        print('Producto incompleto')
        return
      
      website = {
        "name": "Jumbo",
        "url": url_product,
        "price": product_data.price,
        "best_price": product_data.best_price,
        "average": product_data.average
      }

      new_product = api.add_product(product_data, website)
      if new_product == None:
        print('No encontrado')

  def get_product_data(self, product):
    product_data = ProductItem()
    product_data.title = product['productName']
    product_data.brand = product['brand']
    product_data.price = product['items'][0]['sellers'][0]['commertialOffer']['PriceWithoutDiscount']
    product_data.best_price = product['items'][0]['sellers'][0]['commertialOffer']['Price']
    product_data.sub_category = product['categories'][0].split('/')[-2]

    #TODO: obtener quantity
    if 'pack' in product_data.title.lower():
      if 'Cantidad' in product:
        product_data.quantity = int(re.findall(r'\d+', product['Cantidad'][0])[0])
      else:
        product_data.quantity = int(re.search(r'(\d+)\s+un\.', product_data.title).group(1))
    else:
      product_data.quantity = 1

    #TODO: obtener el content
    if 'Contenido' in product:
      content_match = re.search(r'(\d+(\.\d+)?)\s*(\w+)', product['Contenido'][0])
      value = float(content_match.group(1))
      unit = content_match.group(2)
      if unit == 'L':
        value *= 1000
      product_data.content = int(value)
    else:
      content_match = re.search(r'(\d+(?:\.\d+)?)\s(cc|L)', product_data.title)
      if content_match:
        value = float(content_match.group(1))
        unit = content_match.group(2)
        if unit == 'L':
          value *= 1000
        product_data.content = int(value)

    #TODO: obtener alcoholic grade
    if 'Graduación Alcohólica' in product:
      product_data.alcoholic_grade = float(re.findall(r'\d+(?:\.\d+)?', product['Graduación Alcohólica'][0])[0])
    else:
      if '°' in product_data.title:
        product_data.alcoholic_grade = float(re.search(r'\d+(\.\d+)?°', product_data.title.replace(',', '.')).group().replace('°', ''))

    if 'Grado' in product and product_data.alcoholic_grade == None:
      product_data.alcoholic_grade = float(re.findall(r'\d+(?:\.\d+)?', product['Grado'][0].replace(',', '.'))[0])

    #TODO: obtener el package
    if 'Envase' in product:
      distillates = ['pisco', 'ron', 'tequila', 'vodka', 'whisky', 'gin']
      if 'botella' in product['Envase'][0].lower():
        product_data.package = 'Botella'
      elif 'pack' in product['Envase'][0].lower():
        product_data.package = None
      elif product_data.sub_category.lower() in distillates and 'caja' in product['Envase'][0].lower():
        product_data.package = 'Botella'
      else:
        product_data.package = product['Envase'][0]
    else:
      if 'botella' in product_data.title.lower():
        product_data.package = 'Botella'
      elif 'lata' in product_data.title.lower():
        product_data.package = 'Lata'
      elif 'barril' in product_data.title.lower():
        product_data.package = 'Barril'
      elif 'caja' in product_data.title.lower():
        product_data.package = 'Tetrapack'

    #TODO: obtener el average
    average_url = 'https://sm-web-api.ecomm.cencosud.com/catalog/api/v1/reviews/ratings'
    average_res = requests.get(f"{average_url}?ids={product['productId']}", headers=self.headers)
    if average_res.status_code == 200:
      if average_res.json()[0]['totalCount'] > 0:
        product_data.average = average_res.json()[0]['average']

    #TODO: obtener el image_url
    product_data.image_url = product['items'][0]['images'][0]['imageUrl']

    return product_data


  def get_update_data(self, product):
    product_data = ProductItem()

    product_data.price = product['items'][0]['sellers'][0]['commertialOffer']['PriceWithoutDiscount']
    product_data.best_price = product['items'][0]['sellers'][0]['commertialOffer']['Price']

    #TODO: obtener el average
    average_url = 'https://sm-web-api.ecomm.cencosud.com/catalog/api/v1/reviews/ratings'
    average_res = requests.get(f"{average_url}?ids={product['productId']}", headers=self.headers)
    if average_res.status_code == 200:
      if average_res.json()[0]['totalCount'] > 0:
        product_data.average = average_res.json()[0]['average']

    return product_data


if __name__ == "__main__":
  JumboSpider().run()
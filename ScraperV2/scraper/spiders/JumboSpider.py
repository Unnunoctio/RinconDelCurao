import requests

class JumboSpider:
  headers = {
    "apiKey": "WlVnnB7c1BblmgUPOfg"
  }
  starts_urls = [
    "https://sm-web-api.ecomm.cencosud.com/catalog/api/v4/products/vinos-cervezas-y-licores/cervezas?sc=11" # Add Page
  ]
  base_url = "https://jumbo.cl"

  def _init__(self):
    if not self.starts_urls:
      self.starts_urls = []

  def run(self):
    self.start_requests()

  def start_requests(self):
    # TODO: Recorre las urls
    for url in self.starts_urls:
      self.start_pages(url)

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
    for product in response.json()['products']:
      print(product['productName'])
      self.product_stock(product)
      break
    print('-----------------------')

  def product_stock(self, product):
    # TODO: Verifica que la url del producto este en la base de datos
    url_product = f"{self.base_url}/{product['linkText']}/p"
    print(url_product)
    # TODO: Verifica que el producto este en stock
    # TODO: En caso de estar sin stock, elimina la website del producto
    pass

if __name__ == "__main__":
  JumboSpider().run()
import scrapy
import requests
import math
import re

from scraper_v3.items import ProductItem
import api.api as api
import utils.utils as uts


class JumboSpider(scrapy.Spider):
    name = "jumbo_spider"
    allowed_domains = ["sm-web-api.ecomm.cencosud.com"]
    start_urls = [
        "https://sm-web-api.ecomm.cencosud.com/catalog/api/v4/products/vinos-cervezas-y-licores/cervezas",
        "https://sm-web-api.ecomm.cencosud.com/catalog/api/v4/products/vinos-cervezas-y-licores/destilados",
        "https://sm-web-api.ecomm.cencosud.com/catalog/api/v4/products/vinos-cervezas-y-licores/vinos",
    ]
    href_blockeds = [
        # "cerveza-mahou-alhambra-reserva-1925-330-cc"
    ]
    headers = {
        "apiKey": "WlVnnB7c1BblmgUPOfg"
    }
    base_url = "https://jumbo.cl"
    base_product_url = "https://sm-web-api.ecomm.cencosud.com/catalog/api/v1/product"
    products_not_found = []

    def start_requests(self):
        for url in self.start_urls:
            yield scrapy.Request(url=url, headers=self.headers)

    def parse(self, response):
        max_pages = self.get_max_pages(response)
        for page in range(1, max_pages + 1):
            url = f"{response.url}?page={page}&sc=11"

            yield scrapy.Request(url=url, headers=self.headers, callback=self.parse_list_products)

    def get_max_pages(self, response):
        total_products = response.json()['recordsFiltered']
        return math.ceil(total_products/40)

    def parse_list_products(self, response):
        products = response.json()['products']
        for product in products:
            href = product['linkText']
            if href in self.href_blockeds:
                continue
            link_product = f'{self.base_product_url}/{href}?sc=11'

            yield scrapy.Request(url=link_product, headers=self.headers, callback=self.parse_product)

    def parse_product(self, response):
        product = response.json()[0]
        url_product = f"{self.base_url}/{product['linkText']}/p"
        print(url_product)

        #! Producto sin stock
        if not self.is_product_stock(product):
            if api.is_product_exist(url_product):
                api.remove_website(url_product)
        else:
            average_url = "https://sm-web-api.ecomm.cencosud.com/catalog/api/v1/reviews/ratings"
            yield scrapy.Request(url=f"{average_url}?ids={product['productId']}", headers=self.headers, callback=self.process_product, meta={'product': product})

    def is_product_stock(self, product):
        stock_product = product['items'][0]['sellers'][0]['commertialOffer']['AvailableQuantity']
        if stock_product == 0:
            return False
        return True

    def process_product(self, response):
        product = response.meta['product']
        url_product = f"{self.base_url}/{product['linkText']}/p"

        # TODO: Obtener el average
        average_product = None
        if response.json()[0]['totalCount'] > 0:
            average_product = response.json()[0]['average']

        # TODO: Obtener el product data y se crea el website
        product_data = self.get_product_data(product)
        website = {
            "name": "Jumbo",
            "url": url_product,
            "price": product_data['price'],
            "best_price": product_data['best_price'],
            "average": average_product,
        }

        if api.is_product_exist(url_product):
            # TODO: Actualizar el producto
            api.update_website(website)
        else:
            if product_data.is_values_none():
                self.products_not_found.append(product_data)
                return
            
            new_product = api.add_product(product_data, website)
            if new_product == None:
                self.products_not_found.append(product_data)

    def get_product_data(self, product):
        product_data = ProductItem()
        product_data['title'] = product['productName']
        product_data['brand'] = product['brand']
        product_data['price'] = product['items'][0]['sellers'][0]['commertialOffer']['PriceWithoutDiscount']
        product_data['best_price'] = product['items'][0]['sellers'][0]['commertialOffer']['Price']
        product_data['sub_category'] = product['categories'][0].split('/')[-2]

        # TODO: obtener quantity
        if 'pack' in product_data['title'].lower().split():
            if 'Cantidad' in product:
                product_data['quantity'] = int(re.findall(r'\d+', product['Cantidad'][0])[0])
            else:
                quantity_match = re.search(r'(\d+)\s+un\.', product_data['title'])
                if quantity_match:
                    product_data['quantity'] = int(quantity_match.group(1))
        elif 'bipack' in product_data['title'].lower().split():
            product_data['quantity'] = 2
        else:
            product_data['quantity'] = 1

        # TODO: Obtener el content
        if 'Contenido' in product:
            content_match = re.search(r'(\d+(\.\d+)?)\s*(\w+)', product['Contenido'][0])
            if content_match:
                value = float(content_match.group(1))
                unit = content_match.group(3)
                # if unit == None:
                #     unit = content_match.group(3)
                if unit == 'L' or unit == 'l' or unit == 'litro' or unit == 'litros':
                    value *= 1000
                product_data['content'] = int(value)
        else:
            content_match = re.search(r'(\d+(?:\.\d+)?)\s(cc|L)', product_data['title'])
            if content_match:
                value = float(content_match.group(1))
                unit = content_match.group(2)
                if unit == 'L':
                    value *= 1000
                product_data['content'] = int(value)

        # TODO: Obtener el alcohol grade
        if 'Graduación Alcohólica' in product:
            product_data['alcoholic_grade'] = float(re.findall(r'\d+(?:\.\d+)?', product['Graduación Alcohólica'][0])[0])
        else:
            if '°' in product_data['title']:
                alcoholic_match = re.search(r'\d+(\.\d+)?°', product_data['title'].replace(',', '.'))
                if alcoholic_match:
                    product_data['alcoholic_grade'] = float(alcoholic_match.group().replace('°', ''))

        if 'Grado' in product and product_data['alcoholic_grade'] == None:
            product_data['alcoholic_grade'] = float(re.findall(r'\d+(?:\.\d+)?', product['Grado'][0].replace(',', '.'))[0])

        # TODO: Obtener el package
        if 'Envase' in product:
            distillates = ['pisco', 'ron', 'tequila', 'vodka', 'whisky', 'gin']
            if 'botella' in product['Envase'][0].lower():
                product_data['package'] = 'Botella'
            elif 'pack' in product['Envase'][0].lower():
                product_data['package'] = None
            elif product_data['sub_category'].lower() in distillates and 'caja' in product['Envase'][0].lower():
                product_data['package'] = 'Botella'
            else:
                product_data['package'] = product['Envase'][0]
        if product_data['package'] == None:
            if 'botella' in product_data['title'].lower():
                product_data['package'] = 'Botella'
            elif 'lata' in product_data['title'].lower():
                product_data['package'] = 'Lata'
            elif 'barril' in product_data['title'].lower():
                product_data['package'] = 'Barril'
            elif 'caja' in product_data['title'].lower():
                product_data['package'] = 'Tetrapack'

        # TODO: Obtener la image_url
        images = product['items'][0]['images']
        if len(images) > 0:
            product_data['image_url'] = images[0]['imageUrl']

        return product_data
    
    def closed(self, reason):
        uts.export_data('Products_Jumbo', self.products_not_found)
        print('Jumbo Scraper Closed')
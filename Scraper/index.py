from scrapers import jumboScraper
import time
import requests
from bs4 import BeautifulSoup
import utils.utils as uts

t0 = time.time()
jumboScraper.jumboScraper()
# urlProduct = 'https://www.jumbo.cl/pisco-mistral-nobel-fire-30-750cc/p'
# jumboScraper.browseProductTest(urlProduct, 'Destilados')

# uts.saveImage('https://images.lider.cl/wmtcl?source=url[file:/productos/479021a.jpg]&sink', 'Otro')
# uts.removeBackground('Scraper/assets/imagen_2.jpg')
t1 = time.time()

print('la funcion tardo: ', t1 - t0, ' segundos.')


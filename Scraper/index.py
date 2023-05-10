from scrapers import jumboScraper
import time
import requests
from bs4 import BeautifulSoup
import utils.utils as uts

t0 = time.time()
jumboScraper.jumboScraper()
# urlProduct = 'https://www.jumbo.cl/pack-de-cervezas-kunstman-s-alcohol-330-cc/p'
# jumboScraper.browseProductTest(urlProduct, 'Cervezas')

# uts.saveImage('https://jumbo.vtexassets.com/arquivos/ids/643519-750-750?width=750&height=750&aspect=true', 'Cervezas')
t1 = time.time()

print('la funcion tardo: ', t1 - t0, ' segundos.')


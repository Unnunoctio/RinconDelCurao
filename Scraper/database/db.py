from pymongo import MongoClient

client = MongoClient('mongodb://localhost:27017/')
db = client['Rincon_del_Curao']

products_collection = db['products']
scraper_collection = db['scraper_products']

def getProductDB( productData ):
  product_filter = { "brand": productData['brand'], "alcoholic_grade": productData['alcoholContent'], "content": productData['unitContent'], "package": productData['package'] }  
  num_docs = products_collection.count_documents(product_filter)

  if(num_docs == 0):
    return None
  else:
    productCorrect, nameCorrect = None, []
    titleSplit = productData['title'].lower().split()
    for productDB in products_collection.find(product_filter):
      nameSplit = productDB['name'].replace(f'{productDB["brand"]} ', '').lower().split()
      if all(elem in titleSplit for elem in nameSplit):
        if len(nameSplit) > len(nameCorrect):
          nameCorrect, productCorrect = nameSplit, productDB

    return productCorrect

def getScraperProductDB( productFilter ):
  return scraper_collection.find_one(productFilter)

def addWebsiteScraperProductDB( website, scraperProductDB ):
  scraperProductDB['websites'].append(website)
  scraper_collection.update_one({"_id": scraperProductDB['_id']}, {"$set": scraperProductDB})

def addScraperProductDB( scraperProductDB ):
  scraper_collection.insert_one(scraperProductDB)

def updateScraperProductDB( scraperProductDB ):
  scraper_collection.update_one({"_id": scraperProductDB['_id']}, {"$set": scraperProductDB})

def deleteWebsiteScraperProductDB( urlProduct ):
  scraper_collection.update_one(
    {"websites.url": urlProduct},
    {"$pull": {"websites": {"url": urlProduct}}},
    upsert=False
  )

  scraper_collection.delete_one(
    {"websites": {"$exists": True, "$size": 0}}
  )
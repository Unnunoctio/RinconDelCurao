from pymongo import MongoClient

client = MongoClient('mongodb://localhost:27017/')
db = client['Rincon_del_Curao']

product_collection = db['products']
scraper_collection = db['scraper_products']

def get_product(product_data):
  product_filter = {
    'brand': product_data['brand'],
    'alcoholic_grade': product_data['alcoholic_grade'],
    'content': product_data['content_unit'],
    'package': product_data['packaging']
  }
  num_docs = product_collection.count_documents(product_filter)

  if num_docs == 0:
    return None
  else:
    product_correct, name_correct = None, []
    title_split = product_data['title'].lower().split()
    for product in product_collection.find(product_filter):
      name_split = product['name'].replace(f"{product['brand']} ", '').lower().split()
      if all(elem in title_split for elem in name_split):
        if len(name_split) > len(name_correct):
          name_correct, product_correct = name_split, product

    return product_correct

def get_scraper_by_url(url):
  return scraper_collection.find_one({'websites.url': url})

def get_scraper(product_id, quantity):
  return scraper_collection.find_one({'product._id': product_id, 'quantity': quantity})

def add_website(website_name, url_product, scraper_db, product_data, page_hash):
  new_website = {
    'website': website_name,
    'url': url_product,
    'price': product_data['price'],
    'best_price': product_data['best_price'],
    'average': 0,
    'last_hash': page_hash
  }

  scraper_db['websites'].append(new_website)
  scraper_collection.update_one({'_id': scraper_db['_id']}, {'$set': scraper_db})

def delete_website(url):
  scraper_collection.update_one(
    {'webstites.url': url},
    {'$pull': {'websites': {'url': url}}},
    upsert=False
  )
  scraper_collection.delete_many(
    {'websites': {'$exists': True, '$size': 0}}
  )

def update_scraper(scraper_db):
  scraper_collection.update_one({'_id': scraper_db['_id']}, {'$set': scraper_db})

def add_scraper(website_name, url_product, title, product_db, product_data, page_hash, image_path):
  new_scraper = {
    'product': product_db,
    'title': title,
    'quantity': product_data['quantity'],
    'websites': [
      {
        'website': website_name,
        'url': url_product,
        'price': product_data['price'],
        'best_price': product_data['best_price'],
        'average': 0,
        'last_hash': page_hash
      }
    ],
    'image': image_path
  }

  scraper_collection.insert_one(new_scraper)
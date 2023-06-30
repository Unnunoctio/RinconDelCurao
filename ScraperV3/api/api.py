import os
import requests
from dotenv import load_dotenv

load_dotenv()


def make_graphql_request(query, variables=None):
  headers = {
    "Content-Type": "application/json",
    "X-API-KEy": os.getenv("SCRAPY_API_KEY")
  }
  data = {
    "query": query,
    "variables": variables or {}
  }

  response = requests.post(os.getenv("API_URL"), json=data, headers=headers)
  if response.status_code == 200:
    return response.json()
  else:
    raise Exception(
      f"GraphQL request failed with status code {response.status_code}: {response.text}")


def is_product_exist(url_website):
  query = """
    query($urlWebsite: String!) {
      isProductExist(urlWebsite: $urlWebsite)
    }
  """
  variables = {
    "urlWebsite": url_website
  }

  try:
    response = make_graphql_request(query, variables)
    return response['data']['isProductExist']
  except Exception as e:
    print(e)
    return False
  

def add_product(product_data, website):
  query = """
    mutation ($data: DataInput!, $website: WebsiteInput!) {
      addProduct(data: $data, website: $website) {
        title
        quantity
        image
      }
    }
  """

  variables = {
    "data": {
      "title": product_data['title'],
      "brand": product_data['brand'],
      "alcoholic_grade": product_data['alcoholic_grade'],
      "content": product_data['content'],
      "package": product_data['package'],
      "quantity": product_data['quantity'],
      "image_url": product_data['image_url']
    },
    "website": {
      "name": website["name"],
      "url": website["url"],
      "price": website["price"],
      "best_price": website["best_price"],
      "average": website["average"]
    }
  }

  try:
    response = make_graphql_request(query, variables)
    return response['data']['addProduct']
  except Exception as e:
    print(e)
    return None


def update_website(website):
  query = """
    mutation ($website: WebsiteInput!) {
      updateWebsite(newWebsite: $website)
    }
  """
  variables = {
    "website": {
      "name": website["name"],
      "url": website["url"],
      "price": website["price"],
      "best_price": website["best_price"],
      "average": website["average"]
    }
  }

  try:
    response = make_graphql_request(query, variables)
    return response['data']['updateWebsite']
  except Exception as e:
    print(e)
    return False


def remove_website(url_website):
  query = """
    mutation ($urlWebsite: String!) {
      removeWebsite(urlWebsite: $urlWebsite)
    }
  """
  variables = {
    "urlWebsite": url_website
  }

  try:
    response = make_graphql_request(query, variables)
    return response['data']['removeWebsite']
  except Exception as e:
    print(e)
    return False
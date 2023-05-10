import requests
import hashlib
import random
import string
import os
from openpyxl import Workbook

pageHeaders = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36'
}

def randomText( size ):
  types = string.ascii_letters + string.digits + string.ascii_uppercase
  return ''.join(random.choice(types) for i in range(size))

def getPageHash( response ):
  hash_object = hashlib.sha256(response.content)
  hash_hex = hash_object.hexdigest()

  return hash_hex

def saveImage( imgUrl, typeProduct ):
  while(True):
    try:
      imgResponse = requests.get(imgUrl).content
      imgName = randomText(15)
      with open(f"Scraper/assets/{imgName}.webp", "wb") as archivo:
        archivo.write(imgResponse)

      with open(f"Scraper/assets/{imgName}.webp", "rb") as archivo:
        backendResponse = requests.post("http://localhost:4000/api/scraper_products/upload-image", files={ "image": archivo }, data={"category": typeProduct})

      os.remove(f"Scraper/assets/{imgName}.webp")
      return backendResponse.json()['imagePath']
    except Exception as e:
      print(f'Error: {e} url: {imgUrl}')

def createTitle( productDB, productData ):
  title = ""
  if(productData['quantity'] > 1):
    title += f"Pack {productData['quantity']} un. "

  title += f"{productDB['name']} {productDB['package']} "

  if(productDB['content'] >= 1000):
    title += f"{productDB['content']/1000} L"
  else:
    title += f"{productDB['content']} cc"

  return title

def exportData( title, products ):
  workbook = Workbook()
  sheet = workbook.active
  
  sheet["A1"] = "Name"
  sheet["B1"] = "Brand"
  sheet["C1"] = "Category"
  sheet["D1"] = "SubCategory"
  sheet["E1"] = "AlcoholicGrade"
  sheet["F1"] = "Content"
  sheet["G1"] = "Package"

  for i, obj in enumerate(products):
    sheet["A" + str(i+2)] = obj["title"]
    sheet["B" + str(i+2)] = obj["brand"]
    sheet["C" + str(i+2)] = obj["type"]
    sheet["D" + str(i+2)] = obj["subType"]
    sheet["E" + str(i+2)] = obj["alcoholContent"]
    sheet["F" + str(i+2)] = obj["unitContent"]
    sheet["G" + str(i+2)] = obj["package"]

  workbook.save(filename=f"Scraper/assets/{title}.xlsx")

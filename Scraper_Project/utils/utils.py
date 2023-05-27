import requests
import string
import random
import os
import hashlib
from openpyxl import Workbook
from openpyxl.worksheet.table import Table, TableStyleInfo

def random_text(size):
  types = string.ascii_letters + string.digits + string.ascii_uppercase
  return ''.join(random.choice(types) for i in range(size))

def get_page_hash(page_body):
  hash_object = hashlib.sha256(page_body)
  hash_hex = hash_object.hexdigest()
  return hash_hex

def save_product_image(img_url, category_product):
  while(True):
    try:
      img_response = requests.get(img_url).content
      img_name = random_text(15)
      current_dir = os.path.abspath(os.path.dirname(__file__))
      img_dir = os.path.join(current_dir, '../assets')
      os.makedirs(img_dir, exist_ok=True)
      img_path = os.path.join(img_dir, f'{img_name}.webp')
      with open(img_path, "wb") as archivo:
        archivo.write(img_response)

      #TODO: Agregar Codigo para eliminar fondo de la imagen
      # removeBackground(f'Scraper/assets/{imgName}.webp')

      with open(img_path, "rb") as archivo:
        backend_response = requests.post(
          "http://localhost:4000/api/scraper_products/upload-image", 
          files={ "image": archivo }, 
          data={"category": category_product}
        )

      os.remove(img_path)
      return backend_response.json()['imagePath']
    except Exception as e:
      print(f'Error: {e} url: {img_url}')

def create_title(product_db, product_data):
  title = ''
  if product_data['quantity'] > 1:
    title += f"Pack {product_data['quantity']} un. "
  
  title += f"{product_db['name']} {product_db['package']} "

  if product_db['content'] >= 1000:
    title += f"{product_db['content']/1000}L"
  else:
    title += f"{product_db['content']}cc"

  return title

def export_data(title, products):
  workbook = Workbook()
  sheet = workbook.active

  sheet["A1"] = "Name"
  sheet["B1"] = "Brand"
  sheet["C1"] = "SubCategory"
  sheet["D1"] = "AlcoholicGrade"
  sheet["E1"] = "Content"
  sheet["F1"] = "Package"

  for i, obj in enumerate(products):
    sheet["A" + str(i+2)] = obj['title']
    sheet["B" + str(i+2)] = obj['brand']
    sheet["C" + str(i+2)] = obj['sub_category']
    sheet["D" + str(i+2)] = obj['content_unit']
    sheet["E" + str(i+2)] = obj['alcoholic_grade']
    sheet["F" + str(i+2)] = obj['packaging']

  # Crear tabla
  table_range = f"A1:F{len(products) + 1}"
  table = Table(displayName="ProductTable", ref=table_range)
  style = TableStyleInfo(name="TableStyleMedium9", showFirstColumn=False,
                          showLastColumn=False, showRowStripes=True, showColumnStripes=False)
  table.tableStyleInfo = style
  sheet.add_table(table)

  current_dir = os.path.abspath(os.path.dirname(__file__))
  excel_dir = os.path.join(current_dir, '../assets')
  os.makedirs(excel_dir, exist_ok=True)
  excel_path = os.path.join(excel_dir, f'{title}.xlsx')

  workbook.save(filename=excel_path)
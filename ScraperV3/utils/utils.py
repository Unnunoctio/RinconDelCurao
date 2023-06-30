import os
from openpyxl import Workbook
from openpyxl.worksheet.table import Table, TableStyleInfo

def export_data(title, products):
  workbook = Workbook()
  sheet = workbook.active

  sheet["A1"] = "Name"
  sheet["B1"] = "Brand"
  sheet["C1"] = "SubCategory"
  sheet["D1"] = "AlcoholicGrade"
  sheet["E1"] = "Content"
  sheet["F1"] = "Quantity"
  sheet["G1"] = "Package"

  for i, obj in enumerate(products):
    sheet["A" + str(i+2)] = obj['title']
    sheet["B" + str(i+2)] = obj['brand']
    sheet["C" + str(i+2)] = obj['sub_category']
    sheet["D" + str(i+2)] = obj['alcoholic_grade']
    sheet["E" + str(i+2)] = obj['content']
    sheet["F" + str(i+2)] = obj['quantity']
    sheet["G" + str(i+2)] = obj['package']

  # Crear tabla
  table_range = f"A1:G{len(products) + 1}"
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
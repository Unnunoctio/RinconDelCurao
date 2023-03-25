import re

data = ['Pack 6 un. Cerveza Royal Guard Lager botella 355 cc', 
        'Pack 18 un. Cerveza Corona Lager 4.6° 330 cc', 
        'Pack 24 un. Cerveza Stella Artois Lager 5.2° 330 cc', 
        'Pack 6 un. Cerveza Coors Stubby 5° botella 355 cc', 
        'Pack 12 un. Cerveza Stella Artois Belga Lager 5.2° 354 cc', 
        'Pack 6 un. Cerveza Stones Limón lata 350 cc', 
        'Pack 6 un. Cerveza Stones Limón lata 350 cc', 
        'Pack 10 un. Cerveza Heineken 350 cc', 
        'Pack 6 un. Cerveza Austral Patagonia 4.8° Hoppy Lager 470 cc',  
        'Pack 6 un. Cerveza Stella Artois sin alcohol 330 cc',
        'Cerveza Gulden Draak 9000 Quadruple 10.5° 330 cc',
        'Cerveza Bitburger Sin Alcohol Drive botella 330 cc',
        'Cerveza Sin alcohol lata 330 cc'
      ]

for product in data:
  product = product.replace('Cerveza ', '')
  # eliminar la marca

  # Obtener is es un pack o unidad, la cantidad
  if "Pack" in product:
    unit_type = "Pack"
    quantity = re.search(r'\d+', product).group()
    product = product.replace(f'Pack {quantity} un. ', '')
  else:
    unit_type = "Unidad"
    quantity = 1

  # Obtener el envase
  if "botella" in product:
    packaging = "Botella"
    product = product.replace('botella ', '')
  elif "lata" in product:
    packaging = "Lata"
    product = product.replace('lata ', '')
  else:
    packaging = ""

  # Obtener la graduacion
  if "°" in product:
    grad = re.search(r'\d+\.\d+°', product)
    if(grad == None):
      grad = re.search(r'\d+°', product).group()
    else:
      grad = re.search(r'\d+\.\d+°', product).group()
    
    product = product.replace(f'{grad} ', '')
  else:
    grad = ""

  # Obtener el contenido cc
  cc_content = re.search(r'\d+\scc', product).group()
  product = product.replace(cc_content, '')

  

  print(f'{unit_type} - {quantity} - {packaging} - {grad} - {cc_content}')
  print(f'lo que queda: {product}')
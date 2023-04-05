arr = ["hola", "mundo", "mundo", "en", "python"]
str_completo = "Hola mundo en Python, estoy aprendiendo Python"

# Utilizamos la función all() con una expresión generadora para verificar si todos los elementos de 'arr' están presentes en 'str_completo'
if all(elem in str_completo.lower().split() for elem in arr):
    print("Todos los elementos del arreglo están presentes en el string completo")
else:
    print("Al menos uno de los elementos del arreglo no está presente en el string completo")


    {
      "website": "Jumbo",
      "url": "https://www.jumbo.cl/cerveza-kunstman-sin-filtrar-5-0-botella-330-cc/p",
      "price": 2190,
      "best_price": 2190,
      "average": 0,
      "last_hash": "16b17d8366435e4ec9aee955461df561bc1f8b11d34c8bc83c1740a6987c05c9"
    }
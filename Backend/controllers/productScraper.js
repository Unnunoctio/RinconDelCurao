'use strict'

const { response } = require('express')
const shortid = require('shortid')
const path = require('path')
const fs = require('fs')

const ScraperProduct = require('../models/ProductScraper')
const { categoryNames } = require('../assets/categoryNames')

const getProducts = async (req, res = response) => {
  const productsPerPage = 12

  const { orderBy, page: currentPage, filters } = req.body
  console.log(filters)

  // TODO: Obtener los productos
  let scraperProducts = await ScraperProduct.find({ 'product.category': filters.category })

  // TODO: Filtrar y obtener los limites para el filtro reduce

  //! Verifica que la pagina actual este dentro del rango
  if ((currentPage <= 0) || (currentPage > Math.ceil(scraperProducts.length / productsPerPage))) {
    console.log('Entre en el Error 404 de numero de pagina')
    return res.status(404).json({
      ok: false,
      msg: 'Page not found'
    })
  }
  const startIndex = (currentPage - 1) * productsPerPage

  //* Ordenar los websites de cada producto mediante su precio de oferta
  scraperProducts = scraperProducts.map(x => {
    x.websites.sort((a, b) => {
      if (a.best_price < b.best_price) return -1
      if (a.best_price > b.best_price) return 1
      return 0
    })
    return x
  })

  //* Ordenar los productos mediante el orderBy
  scraperProducts.sort((a, b) => {
    switch (orderBy) {
      case 'scoreDesc':
        // eslint-disable-next-line no-case-declarations
        const scoreA = 100 - ((a.websites[0].best_price * 100) / a.websites[0].price)
        // eslint-disable-next-line no-case-declarations
        const scoreB = 100 - ((b.websites[0].best_price * 100) / b.websites[0].price)
        if (scoreA < scoreB) return 1
        if (scoreA > scoreB) return -1
        if (a.websites[0].best_price < b.websites[0].best_price) return -1
        if (a.websites[0].best_price > b.websites[0].best_price) return 1
        if (a.title < b.title) return -1
        if (a.title > b.title) return 1
        break
      case 'priceDesc':
        if (a.websites[0].best_price < b.websites[0].best_price) return 1
        if (a.websites[0].best_price > b.websites[0].best_price) return -1
        if (a.title < b.title) return -1
        if (a.title > b.title) return 1
        break
      case 'priceAsc':
        if (a.websites[0].best_price < b.websites[0].best_price) return -1
        if (a.websites[0].best_price > b.websites[0].best_price) return 1
        if (a.title < b.title) return -1
        if (a.title > b.title) return 1
        break
      case 'nameAsc':
        if (a.title < b.title) return -1
        if (a.title > b.title) return 1
        break
      case 'nameDesc':
        if (a.title < b.title) return 1
        if (a.title > b.title) return -1
        break
    }
    return 0
  })

  //* Obtener solo las variables necesarias
  scraperProducts = scraperProducts.map(x => {
    const { product, title, image, websites, _id } = x.toObject()
    const idString = _id.toString()
    const pidString = product._id.toString()

    const newObject = {
      id: idString.substring(idString.length - 3) + pidString.substring(pidString.length - 3),
      title,
      brand: product.brand,
      alcoholic_grade: product.alcoholic_grade,
      content: product.content,
      best_price: websites[0].best_price,
      image
    }
    return newObject
  })

  res.status(200).json({
    ok: true,
    products: scraperProducts.slice(startIndex, startIndex + productsPerPage),
    // products: scraper_products,
    totalProducts: scraperProducts.length,
    totalPages: Math.ceil(scraperProducts.length / productsPerPage)
    // filter_limits: filter_limits
  })
}

const getBestDiscountProducts = async (req, res = response) => {
  let scraperProducts = await ScraperProduct.find()

  //* Ordenar los websites de cada product mediante su precio oferta y calcular su descuento
  scraperProducts = scraperProducts.map(x => {
    x.websites.sort((a, b) => {
      if (a.best_price < b.best_price) return -1
      if (a.best_price > b.best_price) return 1
      return 0
    })

    const { product, title, image, websites, _id } = x.toObject()
    const idString = _id.toString()
    const pidString = product._id.toString()

    const newObject = {
      id: idString.substring(idString.length - 3) + pidString.substring(pidString.length - 3),
      title,
      brand: product.brand,
      discount: Math.round(100 - (x.websites[0].best_price * 100) / x.websites[0].price),
      best_price: websites[0].best_price,
      image
    }
    return newObject
  })

  //* Ordenar los productos mediante su descuento
  scraperProducts.sort((a, b) => {
    if (a.discount < b.discount) return 1
    if (a.discount > b.discount) return -1
    if (a.best_price < b.best_price) return -1
    if (a.best_price > b.best_price) return 1
    if (a.title < b.title) return -1
    if (a.title > b.title) return 1
    return 0
  })

  res.status(200).json({
    ok: true,
    products: scraperProducts.slice(0, 7)
  })
}

const getProductByURL = async (req, res = response) => {
  const url = req.params.url

  const compuestId = url.substring(0, 6)
  const compuestName = url.substring(7)

  const scraperLast = compuestId.substring(0, 3)
  const productLast = compuestId.substring(3)

  try {
    const scraperProducts = await ScraperProduct.find()
    const productById = scraperProducts.find(x => {
      const scraperIdString = x._id.toString()
      const productIdString = x.product._id.toString()

      return scraperIdString.substring(scraperIdString.length - 3) === scraperLast && productIdString.substring(productIdString.length - 3) === productLast
    })

    if (!productById) {
      return res.status(404).json({
        ok: false,
        msg: 'Producto no existe'
      })
    }

    const compuestTitle = productById.title.toLowerCase().replaceAll('.', '').replaceAll('°', '').replaceAll(' ', '-')
    if (compuestTitle !== compuestName) {
      return res.status(404).json({
        ok: false,
        msg: 'Producto no existe'
      })
    }

    res.status(200).json({
      ok: true,
      product: productById
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      ok: false,
      msg: 'Error en el servidor'
    })
  }
}

const uploadProductImage = async (req, res = response) => {
  const file = req.file
  const category = req.body.category

  const id = shortid.generate()

  let fileName = `${id}${path.extname(file.originalname)}`

  let folder = 'others'
  switch (category) {
    case categoryNames.BEERS.category:
      folder = categoryNames.BEERS.folder
      break
    case categoryNames.DISTILLATES.category:
      folder = categoryNames.DISTILLATES.folder
      break
    case categoryNames.WINES.category:
      folder = categoryNames.WINES.folder
  }

  fileName = `${folder}/${fileName}`

  const destination = `uploads/images/${fileName}`
  fs.rename(file.path, destination, (error) => {
    if (error) {
      console.log(error)
      return res.status(500).send({
        ok: false,
        msg: 'Error al guardar la imagen'
      })
    } else {
      return res.status(200).send({
        ok: true,
        imagePath: fileName
      })
    }
  })
}

const getProductImage = async (req, res = response) => {
  const pathName = req.params.pathname
  const pathCategory = req.params.category

  const destination = `uploads/images/${pathCategory}/${pathName}`

  fs.readFile(destination, (error, data) => {
    if (error) {
      return res.status(404).send({
        ok: false,
        msg: 'Image not found'
      })
    }
    res.writeHead(200, { 'Content-Type': 'image/webp' })
    res.end(data)
  })
}

const deleteProductImage = async (req, res = response) => {
  const imagePath = req.params.pathname

  fs.unlink(`uploads/scraper_images/${imagePath}`, (error) => {
    if (error) {
      console.log(error)
      res.status(500).send({
        ok: false,
        msg: 'Error al eliminar la imagen'
      })
    } else {
      res.status(200).send({
        ok: true,
        msg: 'Imagen eliminada correctamente'
      })
    }
  })
}

module.exports = {
  getProducts,
  getBestDiscountProducts,
  getProductByURL,
  uploadProductImage,
  getProductImage,
  deleteProductImage
}

"use strict"

const { response } = require("express")
const shortid = require("shortid")
const path = require("path")
const fs = require("fs")

const ScraperProduct = require('../models/ProductScraper')
const { categoryNames } = require("../assets/categoryNames")

const getProducts = async(req, res = response) => {
  const productsPerPage = 12

  const { orderBy, page: currentPage, filters } = req.body
  console.log(filters)

  let scraper_products = await ScraperProduct.find().populate({ path: 'product_id', match: { category: filters.category }}).exec()
  
  //* Elimina todos los productos que no sean de la categoria pedida
  scraper_products = scraper_products.filter(x => x.product_id != null)
  
  // TODO: Filtrar y obtener los limites para el filtro
  // const result = scraper_products.reduce((acc, cur) => {
  //   // acc.brands = acc.brands || {}

  //   const { brand, content, sub_category } = cur.product_id
  //   const quantity = cur.quantity;

  //   acc.brands[brand] = acc.brands[brand] ? acc.brands[brand] + 1 : 1
  //   acc.contents[content] = acc.contents[content] ? acc.contents[content] + 1 : 1
  //   acc.sub_categories[sub_category] = acc.sub_categories[sub_category] ? acc.sub_categories[sub_category] + 1 : 1


  //   return acc
  // }, {
  //   brands: {},
  //   contents: {},
  //   sub_categories: {}
  // })

  // result.brands = Object.entries(result.brands).map(([brand, count]) => ({ value: brand, count }))
  // result.contents = Object.entries(result.contents).map(([content, count]) => ({ value: content, count }))
  // result.sub_categories = Object.entries(result.sub_categories).map(([sub_category, count]) => ({ value: sub_category, count }))

  // console.log(result)

  // scraper_products.map(x => {
  //   let minPrice = 1000001
  //   let maxPrice = -1
  //   x.websites.map(website => {
  //     minPrice = minPrice > website.best_price ? website.best_price : minPrice
  //     maxPrice = maxPrice < website.price ? website.price : maxPrice
  //   })
  //   filter_limits.minPrice = filter_limits.minPrice > minPrice ? minPrice : filter_limits.minPrice
  //   filter_limits.maxPrice = filter_limits.maxPrice < maxPrice ? maxPrice : filter_limits.maxPrice

  //   filter_limits.minGrade = filter_limits.minGrade > x.product_id.alcoholic_grade ? x.product_id.alcoholic_grade : filter_limits.minGrade
  //   filter_limits.maxGrade = filter_limits.maxGrade < x.product_id.alcoholic_grade ? x.product_id.alcoholic_grade : filter_limits.maxGrade

  //   const quantityObj = filter_limits.quantities.find(obj => obj.quantity === x.quantity)
  //   if(quantityObj){
  //     quantityObj.count++
  //   }else{
  //     filter_limits.quantities.push({ quantity: x.quantity, count: 1 })
  //   }

  //   const contentObj = filter_limits.contents.find(obj => obj.content === x.product_id.content)
  //   if(contentObj){
  //     contentObj.count++
  //   }else{
  //     filter_limits.contents.push({ content: x.product_id.content, count: 1 })
  //   }

  //   const packageObj = filter_limits.packages.find(obj => obj.package === x.product_id.package)
  //   if(packageObj){
  //     packageObj.count++
  //   }else{
  //     filter_limits.packages.push({ package: x.product_id.package, count: 1 })
  //   }
  // })

  // Sortear el scraper_products

  //* Verifica que la pagina actual este dentro del rango
  if((currentPage <= 0) || (currentPage > Math.ceil(scraper_products.length/productsPerPage)) ) {
    console.log('Entre en el Error 404 de numero de pagina')
    return res.status(404).json({
      ok: false,
      msg: "Page not found"
    })
  }
  const startIndex = (currentPage - 1) * productsPerPage

  //* Ordenar los websites de cada producto mediante su precio de oferta
  scraper_products = scraper_products.map(x => {
    x.websites.sort((a, b) => {
      if (a.best_price < b.best_price) return -1
      if (a.best_price > b.best_price) return 1
      return 0
    })
    return x
  })

  //* Ordenar los productos mediante el orderBy
  scraper_products.sort((a, b) => {
    switch (orderBy) {
      case "scoreDesc":
        const scoreA = 100 - (a.websites[0].best_price * 100)/a.websites[0].price
        const scoreB = 100 - (b.websites[0].best_price * 100)/b.websites[0].price
        if (scoreA < scoreB) return 1
        if (scoreA > scoreB) return -1
        if (a.websites[0].best_price < b.websites[0].best_price) return -1
        if (a.websites[0].best_price > b.websites[0].best_price) return 1
        if (a.title < b.title) return -1
        if (a.title > b.title) return 1
        return 0
      break
      case "priceDesc":
        if (a.websites[0].best_price < b.websites[0].best_price) return 1
        if (a.websites[0].best_price > b.websites[0].best_price) return -1
        if (a.title < b.title) return -1
        if (a.title > b.title) return 1
        return 0
      break
      case "priceAsc":
        if (a.websites[0].best_price < b.websites[0].best_price) return -1
        if (a.websites[0].best_price > b.websites[0].best_price) return 1
        if (a.title < b.title) return -1
        if (a.title > b.title) return 1
        return 0
      break
      case "nameAsc":
        if (a.title < b.title) return -1
        if (a.title > b.title) return 1
        return 0
      break
      case "nameDesc":
        if (a.title < b.title) return 1
        if (a.title > b.title) return -1
        return 0
      break
    }
  })

  res.status(200).json({
    ok: true,
    products: scraper_products.slice(startIndex, startIndex + productsPerPage),
    totalProducts: scraper_products.length,
    totalPages: Math.ceil(scraper_products.length/productsPerPage)
    // filter_limits: filter_limits
  })
}

const getProductById = async(req, res = response) => {
  const scraper_id = req.params.id

  try {
    const scraper_product = await ScraperProduct.findById(scraper_id).populate('product_id')
    
    if(!scraper_product) {
      return res.status(404).json({
        ok: false,
        msg: "Producto no existe"
      })
    }

    res.status(200).json({
      ok: true,
      product: scraper_product
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      ok: false,
      msg: 'Error en el servidor'
    })
  }
}

const uploadProductImage = async(req, res = response) => {
  const file = req.file
  const category = req.body.category

  const id = shortid.generate()

  let fileName = `${id}${path.extname(file.originalname)}`

  let folder = "others"
  switch (category) {
    case categoryNames.BEERS.category:
      folder = categoryNames.BEERS.folder
      break;
    case categoryNames.DISTILLATES.category:
      folder = categoryNames.DISTILLATES.folder
      break;
    case categoryNames.WINES.category:
      folder = categoryNames.WINES.folder
  }

  fileName = `${folder}/${fileName}`

  const destination = `uploads/images/${fileName}`
  fs.rename(file.path, destination, (error) => {
    if(error) {
      console.log(error)
      return res.status(500).send({
        ok: false,
        msg: "Error al guardar la imagen"
      })
    }else {
      return res.status(200).send({
        ok: true,
        imagePath: fileName
      })
    }
  })
}

const getProductImage = async(req, res = response) => {
  const pathName = req.params.pathname
  const pathCategory = req.params.category

  const destination = `uploads/images/${pathCategory}/${pathName}`

  fs.readFile(destination, (error, data) => {
    if(error) {
      return res.status(404).send({
        ok: false,
        msg: "Image not found"
      })
    }
    res.writeHead(200, { 'Content-Type': 'image/webp' })
    res.end(data)
  })
}

const deleteProductImage = async(req, res = response) => {
  const image_name = req.params.pathname

  fs.unlink(`uploads/scraper_images/${image_name}`, (error) => {
    if(error) {
      console.log(error)
      res.status(500).send({
        ok: false,
        msg: "Error al eliminar la imagen"
      })
    }else {
      res.status(200).send({
        ok: true,
        msg: "Imagen eliminada correctamente"
      })
    }
  })
}

module.exports = {
  getProducts,
  getProductById,
  uploadProductImage,
  getProductImage,
  deleteProductImage
}
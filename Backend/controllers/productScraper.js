"use strict"

const { response } = require("express")
const shortid = require("shortid")
const path = require("path")
const fs = require("fs")

const ScraperProduct = require('../models/ProductScraper')

const getProductBrands = async(req, res = response) => {

}

const getProducts = async(req, res = response) => {
  const productsPerPage = 16
  const count_products = await ScraperProduct.find().countDocuments()
  const currentPage = parseInt(req.query.page) || 1

  if((currentPage <= 0) || (currentPage > Math.floor(count_products/productsPerPage) + 1) ) {
    return res.status(404).json({
      ok: false,
      msg: "Page not found"
    })
  }

  const startIndex = (currentPage - 1) * productsPerPage

  let scraper_products = await ScraperProduct.find().populate({ path: 'product_id', match: {}}).exec()
                                              //  .skip(startIndex).limit(productsPerPage)
  const filter_limits = {
    minPrice: 1000000, maxPrice: 0,
    quantities: [],
    contents: [],
    packages: [],
    minGrade: 100, maxGrade: -1,
  }
  scraper_products = scraper_products.filter(x => x.product_id != null)
  scraper_products.map(x => {
    let minPrice = 1000001
    let maxPrice = -1
    x.websites.map(website => {
      minPrice = minPrice > website.best_price ? website.best_price : minPrice
      maxPrice = maxPrice < website.price ? website.price : maxPrice
    })
    filter_limits.minPrice = filter_limits.minPrice > minPrice ? minPrice : filter_limits.minPrice
    filter_limits.maxPrice = filter_limits.maxPrice < maxPrice ? maxPrice : filter_limits.maxPrice

    filter_limits.minGrade = filter_limits.minGrade > x.product_id.alcoholic_grade ? x.product_id.alcoholic_grade : filter_limits.minGrade
    filter_limits.maxGrade = filter_limits.maxGrade < x.product_id.alcoholic_grade ? x.product_id.alcoholic_grade : filter_limits.maxGrade

    const quantityObj = filter_limits.quantities.find(obj => obj.quantity === x.quantity)
    if(quantityObj){
      quantityObj.count++
    }else{
      filter_limits.quantities.push({ quantity: x.quantity, count: 1 })
    }

    const contentObj = filter_limits.contents.find(obj => obj.content === x.product_id.content)
    if(contentObj){
      contentObj.count++
    }else{
      filter_limits.contents.push({ content: x.product_id.content, count: 1 })
    }

    const packageObj = filter_limits.packages.find(obj => obj.package === x.product_id.package)
    if(packageObj){
      packageObj.count++
    }else{
      filter_limits.packages.push({ package: x.product_id.package, count: 1 })
    }
  })

  // Sortear el scraper_products

  res.status(200).json({
    ok: true,
    products: scraper_products.slice(startIndex, startIndex + productsPerPage),
    filter_limits: filter_limits
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

  const id = shortid.generate()

  const fileName = `${id}${path.extname(file.originalname)}`

  const destination = `uploads/scraper_images/${fileName}`
  fs.rename(file.path, destination, (error) => {
    if(error) {
      console.log(error)
      res.status(500).send({
        ok: false,
        msg: "Error al guardar la imagen"
      })
    }else {
      res.status(200).send({
        ok: true,
        imagePath: fileName
      })
    }
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
  deleteProductImage
}
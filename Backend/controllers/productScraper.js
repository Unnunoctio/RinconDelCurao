"use strict"

const { response } = require("express")
const shortid = require("shortid")
const path = require("path")
const fs = require("fs")

const ScraperProduct = require('../models/ProductScraper')

const getProducts = async(req, res = response) => {
  const scraper_products = await ScraperProduct.find().populate('product_id')

  res.status(200).json({
    ok: true,
    products: scraper_products
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
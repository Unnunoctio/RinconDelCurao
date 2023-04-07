"use strict"

const { Router } = require("express")
const multer = require('multer')
const path = require("path")

const { getProducts, getProductById, uploadProductImage, deleteProductImage } = require("../controllers/productScraper")

const router = Router()
const upload = multer({ 
  dest: 'uploads/',
  fileFilter: function (req, file, cb) {
    const filetypes = /jpeg|jpg|png|gif|webp/
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase())
    const mimetype = filetypes.test(file.mimetype)
    if (mimetype && extname) {
      return cb(null, true)
    } else {
      cb(new Error('Solo se permiten imagenes'))
    }
  }
})

router.get('/', getProducts)

router.get('/:id', getProductById)

router.post('/upload-image', upload.single('image'), uploadProductImage)

router.delete('/delete-image/:pathname', deleteProductImage)

module.exports = router
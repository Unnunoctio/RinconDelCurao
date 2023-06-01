'use strict'

const { Router } = require('express')
const multer = require('multer')
const path = require('path')

const { getProducts, getProductByURL, uploadProductImage, deleteProductImage, getProductImage, getBestDiscountProducts } = require('../controllers/productScraper')

const router = Router()
const upload = multer({
  dest: 'uploads/',
  fileFilter: function (req, file, cb) {
    // console.log(file)
    const filetypes = /jpeg|jpg|png|gif|webp/
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase())
    // const mimetype = filetypes.test(file.mimetype)
    if (extname) {
      return cb(null, true)
    } else {
      cb(new Error('Solo se permiten imagenes'))
    }
  }
})

router.post('/', getProducts)

router.get('/best-discount', getBestDiscountProducts)

router.get('/:url', getProductByURL)

router.post('/upload-image', upload.single('image'), uploadProductImage)

router.get('/get-image/:category/:pathname', getProductImage)

router.delete('/delete-image/:pathname', deleteProductImage)

module.exports = router

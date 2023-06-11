import { ForbiddenError, UserInputError } from 'apollo-server'
import Product from '../models/Product.js'
import { GraphQLError } from 'graphql'
import fs from 'fs'
import { BEERS, DISTILLATES, WINES } from '../assets/uploadName.js'

// TODO: Frontend Endpoints
const totalProducts = async (root, args) => {
  try {
    const { filters } = args
    const total = await Product.countDocuments({ 'product.category': filters.category })
    return total
  } catch (error) {
    throw new UserInputError(error.message, {
      invalidArgs: args
    })
  }
}

const totalPages = async (root, args) => {
  try {
    const { page, filters } = args
    const productsPerPage = 12

    const totalProducts = await Product.countDocuments({ 'product.category': filters.category })
    let totalPages = Math.ceil(totalProducts / productsPerPage)
    if (totalPages === 0) totalPages = 1

    if (page <= 0 || (page > totalPages)) {
      throw new GraphQLError('invalid page value')
    }

    return totalPages
  } catch (error) {
    throw new UserInputError(error.message, {
      invalidArgs: args
    })
  }
}

const getProducts = async (root, args) => {
  try {
    const { orderBy, page, filters } = args
    const productsPerPage = 12

    const products = await Product.aggregate([
      { $unwind: '$websites' },
      { $match: { 'product.category': filters.category } },
      { $sort: { 'websites.best_price': 1 } },
      {
        $group: {
          _id: '$_id',
          websites: { $push: '$websites' },
          otherFields: { $first: '$$ROOT' }
        }
      },
      { $replaceRoot: { newRoot: { $mergeObjects: ['$otherFields', { websites: '$websites' }] } } }
    ])

    switch (orderBy) {
      case 'SCORE_DESC':
        products.sort((a, b) => {
          const scoreA = 100 - ((a.websites[0].best_price * 100) / a.websites[0].price)
          const scoreB = 100 - ((b.websites[0].best_price * 100) / b.websites[0].price)
          if (scoreA !== scoreB) return scoreB - scoreA
          if (a.websites[0].best_price !== b.websites[0].best_price) return a.websites[0].best_price - b.websites[0].best_price
          return a.title.localCompare(b.title)
        })
        break
      case 'PRICE_DESC':
        products.sort((a, b) => {
          if (a.websites[0].best_price !== b.websites[0].best_price) return b.websites[0].best_price - a.websites[0].best_price
          return a.title.localCompare(b.title)
        })
        break
      case 'PRICE_ASC':
        products.sort((a, b) => {
          if (a.websites[0].best_price !== b.websites[0].best_price) return a.websites[0].best_price - b.websites[0].best_price
          return a.title.localCompare(b.title)
        })
        break
      case 'NAME_ASC':
        products.sort((a, b) => {
          return a.title.localCompare(b.title)
        })
        break
      case 'NAME_DESC':
        products.sort((a, b) => {
          return b.title.localCompare(a.title)
        })
        break
      default:
        throw new GraphQLError('invalid orderBy value')
    }

    const startIndex = (page - 1) * productsPerPage
    return products.slice(startIndex, startIndex + productsPerPage)
  } catch (error) {
    throw new UserInputError(error.message, {
      invalidArgs: args
    })
  }
}

const getBestDiscountProducts = async () => {
  try {
    const products = await Product.aggregate([
      { $unwind: '$websites' },
      { $sort: { 'websites.best_price': 1 } },
      {
        $group: {
          _id: '$_id',
          websites: { $push: '$websites' },
          otherFields: { $first: '$$ROOT' }
        }
      },
      { $replaceRoot: { newRoot: { $mergeObjects: ['$otherFields', { websites: '$websites' }] } } }
    ])

    // ordena los productos mediante el mayor descuento > menor precio > titulo alfabetico
    products.sort((a, b) => {
      const discountA = Math.round(100 - (a.websites[0].best_price * 100) / a.websites[0].price)
      const discountB = Math.round(100 - (a.websites[0].best_price * 100) / a.websites[0].price)

      if (discountA !== discountB) return discountB - discountA
      if (a.websites[0].best_price !== b.websites[0].best_price) return a.websites[0].best_price - b.websites[0].best_price
      return a.title.localCompare(b.title)
    })

    return products.slice(0, 7)
  } catch (error) {
    throw new GraphQLError(error.message, {
      extensions: { code: 'OPERATION_RESOLUTION_FAILURE' }
    })
  }
}

const getProduct = async (root, args) => {
  try {
    const { id, title } = args
    const productId = id.substring(0, 3)
    const productIdAPI = id.substring(3)

    const products = await Product.aggregate([
      { $unwind: '$websites' },
      {
        $match: {
          $and: [
            { $expr: { $regexMatch: { input: { $toString: '$_id' }, regex: `.*${productId}$` } } },
            { $expr: { $regexMatch: { input: { $toString: '$product._id' }, regex: `.*${productIdAPI}$` } } }
          ]
        }
      },
      { $sort: { 'websites.best_price': 1 } },
      {
        $group: {
          _id: '$_id',
          websites: { $push: '$websites' },
          otherFields: { $first: '$$ROOT' }
        }
      },
      { $replaceRoot: { newRoot: { $mergeObjects: ['$otherFields', { websites: '$websites' }] } } },
      { $limit: 1 }
    ])

    if (products.length === 0) {
      throw new GraphQLError('invalid id')
    }

    const compuestTitle = products[0].title.toLowerCase().replaceAll('.', '').replaceAll('°', '').replaceAll(' ', '-')
    if (compuestTitle !== title) {
      throw new GraphQLError('invalid title')
    }

    return products[0]
  } catch (error) {
    throw new UserInputError(error.message, {
      invalidArgs: args
    })
  }
}

const getProductImage = async (root, args) => {
  try {
    const { imagePath } = args

    const product = await Product.findOne({ image_path: imagePath })
    if (!product) return ''

    let folderPath = 'others'
    const categoryMapping = {
      [BEERS.name]: BEERS.folder,
      [DISTILLATES.name]: DISTILLATES.folder,
      [WINES.name]: WINES.folder
    }
    if (Object.prototype.hasOwnProperty.call(categoryMapping, product.product.category)) {
      folderPath = categoryMapping[product.product.category]
    }

    const filePath = `./uploads/${folderPath}/${imagePath}`
    const imageBuffer = fs.readFileSync(filePath)
    const imageBase64 = imageBuffer.toString('base64')

    return `data:image/webp;base64,${imageBase64}`
  } catch (error) {
    throw new UserInputError(error.message, {
      invalidArgs: args
    })
  }
}

// TODO: Scrapy Endpoints
const isProductExist = async (root, args, context) => {
  if (!context.apiKey) throw new ForbiddenError('unauthorized')

  try {
    const { urlWebsite } = args

    const product = await Product.findOne({ 'websites.url': urlWebsite })
    if (!product) {
      return false
    }
    return true
  } catch (error) {
    throw new GraphQLError(error.message)
  }
}

export {
  totalProducts,
  totalPages,
  getProducts,
  getBestDiscountProducts,
  getProduct,
  getProductImage,
  //* Scrapy EndPoints
  isProductExist
}

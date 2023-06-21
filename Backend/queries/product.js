import { ForbiddenError, UserInputError } from 'apollo-server'
import { GraphQLError } from 'graphql'
import Product from '../models/Product.js'

// TODO: Frontend Endpoints
const totalProducts = async (root, args) => {
  try {
    const { filters } = args

    const matchStage = {
      'product.category': filters.category
    }
    if (filters.sub_category) {
      matchStage['product.sub_category'] = { $in: filters.sub_category }
    }
    if (filters.grade_min && filters.grade_max) {
      matchStage['product.alcoholic_grade'] = { $gte: filters.grade_min, $lte: filters.grade_max }
    }
    if (filters.price_min && filters.price_max) {
      matchStage['websites.best_price'] = { $gte: filters.price_min, $lte: filters.price_max }
    }

    const total = await Product.countDocuments(matchStage)
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

    const matchStage = {
      'product.category': filters.category
    }
    if (filters.sub_category) {
      matchStage['product.sub_category'] = { $in: filters.sub_category }
    }
    if (filters.grade_min && filters.grade_max) {
      matchStage['product.alcoholic_grade'] = { $gte: filters.grade_min, $lte: filters.grade_max }
    }
    if (filters.price_min && filters.price_max) {
      matchStage['websites.best_price'] = { $gte: filters.price_min, $lte: filters.price_max }
    }

    const totalProducts = await Product.countDocuments(matchStage)
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

// Jerarquia
// Categoria: obligatorio
// Subcategoria -> Marcas -> content -> pack-unit -> quantity -> package -> rangeGrade -> rangePrice
// Si viene en los filtros se filtra y se obtiene del anterior en la lista
// Si no viene se obtiene de lo que queda
// El rangeGrade y rangePrice se obtienen siempre sus min y max antes de filtrar por ellos

const getFilterLimits = async (root, { filters }) => {
  const { category } = filters
  console.log(filters)

  // TODO: Obligatorio
  let products = await Product.aggregate([
    { $unwind: '$websites' },
    { $match: { 'product.category': category } },
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

  const filterOptions = {}
  // TODO: Si viene en los filtros
  //* SubCategory = [value, value, value, ...]
  if (filters.sub_category) {
    filterOptions.sub_category = products.reduce((acc, product) => {
      acc[product.product.sub_category] = (acc[product.product.sub_category] || 0) + 1
      return acc
    }, {})

    products = products.filter(product => filters.sub_category.includes(product.product.sub_category))
  }
  //* Brand
  if (filters.brand) {
    filterOptions.brand = products.reduce((acc, product) => {
      acc[product.product.brand] = (acc[product.product.brand] || 0) + 1
      return acc
    }, {})

    products = products.filter(product => filters.brand.includes(product.product.brand))
  }
  //* Package
  if (filters.package) {
    filterOptions.package = products.reduce((acc, product) => {
      acc[product.product.package] = (acc[product.product.package] || 0) + 1
      return acc
    }, {})

    products = products.filter(product => filters.package.includes(product.product.package))
  }
  //* RangeGrade = grade_min, grade_max
  if (filters.grade_min && filters.grade_max) {
    const alcoholicGrades = products.map(product => product.product.alcoholic_grade)
    filterOptions.grade_min = Math.min(...alcoholicGrades)
    filterOptions.grade_max = Math.max(...alcoholicGrades)

    products = products.filter(product => product.product.alcoholic_grade >= filters.grade_min && product.product.alcoholic_grade <= filters.grade_max)
  }
  //* RangePrice = price_min, price_max
  if (filters.price_min && filters.price_max) {
    const prices = products.map(product => product.websites[0].best_price)
    filterOptions.price_min = Math.min(...prices)
    filterOptions.price_max = Math.max(...prices)

    products = products.filter(product => product.websites[0].best_price >= filters.price_min && product.websites[0].best_price <= filters.price_max)
  }

  // TODO: Si NO vinen en los filtros
  //* SubCategory
  if (!filters.sub_category) {
    filterOptions.sub_category = products.reduce((acc, product) => {
      acc[product.product.sub_category] = (acc[product.product.sub_category] || 0) + 1
      return acc
    }, {})
  }
  //* Brand
  if (!filters.brand) {
    filterOptions.brand = products.reduce((acc, product) => {
      acc[product.product.brand] = (acc[product.product.brand] || 0) + 1
      return acc
    }, {})
  }
  //* Package
  if (!filters.package) {
    filterOptions.package = products.reduce((acc, product) => {
      acc[product.product.package] = (acc[product.product.package] || 0) + 1
      return acc
    }, {})
  }
  //* RangeGrade, el || es en caso de que solo se envie 1
  if (!filters.grade_min || !filters.grade_max) {
    const alcoholicGrades = products.map(product => product.product.alcoholic_grade)
    filterOptions.grade_min = Math.min(...alcoholicGrades)
    filterOptions.grade_max = Math.max(...alcoholicGrades)
  }
  //* RangePrice = price_min, price_max
  if (!filters.price_min && !filters.price_max) {
    const prices = products.map(product => product.websites[0].best_price)
    filterOptions.price_min = Math.min(...prices)
    filterOptions.price_max = Math.max(...prices)
  }

  return filterOptions
}

const getProducts = async (root, args) => {
  try {
    const { orderBy, page, filters } = args
    const productsPerPage = 12

    const matchStage = {
      'product.category': filters.category
    }
    if (filters.sub_category) {
      matchStage['product.sub_category'] = { $in: filters.sub_category }
    }
    if (filters.grade_min && filters.grade_max) {
      matchStage['product.alcoholic_grade'] = { $gte: filters.grade_min, $lte: filters.grade_max }
    }
    if (filters.price_min && filters.price_max) {
      matchStage['websites.best_price'] = { $gte: filters.price_min, $lte: filters.price_max }
    }

    const products = await Product.aggregate([
      { $unwind: '$websites' },
      { $match: matchStage },
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

    // products = products.filter(product => product.websites[0].best_price >= filters.price_min && product.websites[0].best_price <= filters.price_max)

    switch (orderBy) {
      case 'SCORE_DESC':
        products.sort((a, b) => {
          const scoreA = 100 - ((a.websites[0].best_price * 100) / a.websites[0].price)
          const scoreB = 100 - ((b.websites[0].best_price * 100) / b.websites[0].price)
          if (scoreA !== scoreB) return scoreB - scoreA
          if (a.websites[0].best_price !== b.websites[0].best_price) return a.websites[0].best_price - b.websites[0].best_price
          return a.title.localeCompare(b.title)
        })
        break
      case 'PRICE_DESC':
        products.sort((a, b) => {
          if (a.websites[0].best_price !== b.websites[0].best_price) return b.websites[0].best_price - a.websites[0].best_price
          return a.title.localeCompare(b.title)
        })
        break
      case 'PRICE_ASC':
        products.sort((a, b) => {
          if (a.websites[0].best_price !== b.websites[0].best_price) return a.websites[0].best_price - b.websites[0].best_price
          return a.title.localeCompare(b.title)
        })
        break
      case 'NAME_ASC':
        products.sort((a, b) => {
          return a.title.localeCompare(b.title)
        })
        break
      case 'NAME_DESC':
        products.sort((a, b) => {
          return b.title.localeCompare(a.title)
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

    // TODO: ordena los productos mediante el mayor descuento > menor precio > titulo alfabetico
    products.sort((a, b) => {
      const discountA = Math.round(100 - (a.websites[0].best_price * 100) / a.websites[0].price)
      const discountB = Math.round(100 - (b.websites[0].best_price * 100) / b.websites[0].price)

      if (discountA !== discountB) return discountB - discountA
      if (a.websites[0].best_price !== b.websites[0].best_price) return a.websites[0].best_price - b.websites[0].best_price
      return a.title.localeCompare(b.title)
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

    const compuestTitle = products[0].title.toLowerCase().replaceAll('.', '').replaceAll('°', '').replaceAll(' ', '-').normalize('NFD').replace(/[\u0300-\u036f]/g, '')
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
  getFilterLimits,
  getProducts,
  getBestDiscountProducts,
  getProduct,
  //* Scrapy EndPoints
  isProductExist
}

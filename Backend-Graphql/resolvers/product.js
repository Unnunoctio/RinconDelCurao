import { UserInputError } from 'apollo-server'
import Product from '../models/Product.js'
import { GraphQLError } from 'graphql'

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
    const { filters } = args
    const productsPerPage = 12

    const totalProducts = await Product.countDocuments({ 'product.category': filters.category })
    const totalPages = Math.ceil(totalProducts / productsPerPage)
    return totalPages > 1 ? totalPages : 1
  } catch (error) {
    throw new UserInputError(error.message, {
      invalidArgs: args
    })
  }
}

const getProducts = async (root, args) => {
  const { orderBy, page, filters } = args
  console.log(orderBy)
  console.log(page)
  console.log(filters)

  return Product.find({})
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

export {
  totalProducts,
  totalPages,
  getProducts,
  getBestDiscountProducts
}

import Product from '../models/Product.js'

const totalProducts = async (root, args) => {
  const { filters } = args
  const total = await Product.countDocuments({ 'product.category': filters.category })
  return total
}

const totalPages = async (root, args) => {
  const { filters } = args
  const productsPerPage = 12

  const totalProducts = await Product.countDocuments({ 'product.category': filters.category })
  return Math.ceil(totalProducts / productsPerPage)
}

const getProducts = async (root, args) => {
  const { orderBy, page, filters } = args
  console.log(orderBy)
  console.log(page)
  console.log(filters)

  return Product.find({})
}

const getBestDiscountProducts = async () => {
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
}

export {
  totalProducts,
  totalPages,
  getProducts,
  getBestDiscountProducts
}

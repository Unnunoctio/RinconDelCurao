import Product from '../models/Product.js'

const totalProducts = async (root, args) => {
  const { filters } = args
  const count = await Product.countDocuments({ 'product.category': filters.category })
  return count
}

const getProducts = async (root, args) => {
  return Product.find({})
}

export {
  totalProducts,
  getProducts
}

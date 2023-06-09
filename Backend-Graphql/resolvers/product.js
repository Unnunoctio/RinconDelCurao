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
  return Product.find({})
}

export {
  totalProducts,
  totalPages,
  getProducts
}

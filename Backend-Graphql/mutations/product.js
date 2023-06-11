import { ForbiddenError, UserInputError } from 'apollo-server'
import { getProductApi, getProductImage, getProductTitle, removeProductImage } from '../helpers/index.js'
import Product from '../models/Product.js'

const addProduct = async (root, args, context) => {
  if (!context.apiKey) throw new ForbiddenError('anauthorized')

  try {
    const { data, website } = args
    const productApi = await getProductApi(data)
    if (!productApi) return null

    // TODO: update data (package and quantity)
    if (data.quantity > 12 && productApi.category === 'Destilados') data.quantity = 1
    if (data.package.toLowerCase() === 'caja' && productApi.category === 'Destilados') data.package = 'Botella'

    // TODO: optiene desde la base de datos un producto con el id del productApi y quantity
    const product = await Product.findOne({ 'product._id': productApi._id, quantity: data.quantity })
    // TODO: si existe se le agrega el website
    if (product) {
      product.websites.push(website)
      await product.save()
      return product
    } else {
      // TODO: si no existe se obtiene la image, se crea un titulo mediante (productApi, data), y se crea el producto con su website
      const title = getProductTitle(productApi, data)
      const imagePath = await getProductImage(data.image_url, productApi.category)
      const newProduct = new Product({ title, product: productApi, quantity: data.quantity, websites: [website], image_path: imagePath })
      await newProduct.save()
      return newProduct
    }
  } catch (error) {
    throw new UserInputError(error.message)
  }
}

const removeWebsite = async (root, args, context) => {
  if (!context.apiKey) throw new ForbiddenError('anauthorized')

  try {
    const { urlWebsite } = args
    // TODO: Busca el producto que contenga un website con la url y elimina el website
    const isProduct = await Product.findOneAndUpdate(
      { 'websites.url': urlWebsite },
      { $pull: { websites: { url: urlWebsite } } },
      { new: true }
    )
    // TODO: si el producto no existe retorna false
    if (!isProduct) return false

    // TODO: si el producto se queda sin websites se elimina el producto
    const deletedProducts = await Product.find({ websites: { $exists: true, $size: 0 } })
    await Product.deleteMany(
      { websites: { $exists: true, $size: 0 } }
    )
    // TODO: elimina la imagen del producto
    deletedProducts.forEach((product) => removeProductImage(product.image_path, product.product.category))
    // TODO: retorna true
    return true
  } catch (error) {
    throw new UserInputError(error.message)
  }
}

export {
  addProduct,
  removeWebsite
}

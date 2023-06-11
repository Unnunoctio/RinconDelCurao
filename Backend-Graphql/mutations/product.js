import { ForbiddenError, UserInputError } from 'apollo-server'
import { getProductImage } from '../helpers/getProductImage.js'

const addProduct = async (root, args, context) => {
  if (!context.apiKey) throw new ForbiddenError('anauthorized')

  try {
    const { data, website } = args
    console.log(data, website)

    const a = await getProductImage(data.image_url, 'Cervezas')
    console.log(a)
    return null
  } catch (error) {
    throw new UserInputError(error.message)
  }
}

export {
  addProduct
}

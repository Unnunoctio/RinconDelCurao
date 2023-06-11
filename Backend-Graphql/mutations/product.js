import { ForbiddenError, UserInputError } from 'apollo-server'
import { getProductImage } from '../helpers/getProductImage.js'
import { getProductApi } from '../helpers/getProductApi.js'

const addProduct = async (root, args, context) => {
  if (!context.apiKey) throw new ForbiddenError('anauthorized')

  try {
    const { data, website } = args
    // console.log(data, website)
    const productApi = await getProductApi(data)
    console.log(productApi)

    // const imagePath = await getProductImage(data.image_url, 'Cervezas')
    // console.log(imagePath)
    return null
  } catch (error) {
    throw new UserInputError(error.message)
  }
}

export {
  addProduct
}

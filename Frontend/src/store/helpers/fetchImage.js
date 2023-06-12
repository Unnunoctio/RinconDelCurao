import productsApi from '../../api/productsApi'

const imageNotFound = 'src/assets/image_not_found.jpg'

const queryGetImage = `
  query ($imagePath: String!){
    productImage(imagePath: $imagePath)
  }
`

export const fetchImage = async (imagePath) => {
  try {
    const { productImage } = await productsApi(queryGetImage, { imagePath })
    return productImage
  } catch (error) {
    // console.error(error)
    return imageNotFound
  }
}

import productsApi from '../../api/productsApi'

const imageNotFound = 'src/assets/image_not_found.jpg'

export const fetchImage = async (imagePath) => {
  try {
    const response = await productsApi.get(`scraper_products/get-image/${imagePath}`, { responseType: 'arraybuffer' })
    const objectData = `data:image/webp;base64,${btoa(
      new Uint8Array(response.data).reduce((datos, byte) => datos + String.fromCharCode(byte), '')
    )}`
    return objectData
  } catch (error) {
    console.log(error)
    return imageNotFound
  }
}

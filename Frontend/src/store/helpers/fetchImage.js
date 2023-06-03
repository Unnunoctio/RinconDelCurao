import productsApi from '../../api/productsApi'

const imageNotFound = 'src/assets/image_not_found.jpg'

export const fetchImage = async (imagePath) => {
  try {
    const response = await productsApi.get(`/scraper_products/get-image/${imagePath}`, { responseType: 'arraybuffer' })
    const objData = `data:image/webp;base64,${btoa(
      new Uint8Array(response.data).reduce((data, byte) => data + String.fromCharCode(byte), '')
    )}`
    return objData
  } catch (error) {
    console.log(error)
    return imageNotFound
  }
}

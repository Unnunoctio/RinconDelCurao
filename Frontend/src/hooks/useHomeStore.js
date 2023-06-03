import { shallow } from 'zustand/shallow'
import { HomeStore } from '../store'
import productsApi from '../api/productsApi'

const imageNotFound = 'src/assets/image_not_found.jpg'

export const useHomeStore = () => {
  const [isLoading, offerProducts] = HomeStore((state) => [state.isLoading, state.offerProducts], shallow)
  const [handleLoading, handleOfferProducts] = HomeStore((state) => [state.handleLoading, state.handleOfferProducts], shallow)

  const fetchImage = async (imagePath) => {
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

  const getHomeProducts = async () => {
    handleLoading(true)

    try {
      const { data } = await productsApi.get('/scraper_products/best-discount')

      await Promise.all(data.products.map(async product => {
        const image = await fetchImage(product.image)
        product.image = image
        return product
      }))

      handleOfferProducts(data.products)
    } catch (error) {
      console.log(error)
      handleOfferProducts([])
    }

    handleLoading(false)
  }

  return {
    isLoading,
    offerProducts,
    //* Methods
    getHomeProducts
  }
}

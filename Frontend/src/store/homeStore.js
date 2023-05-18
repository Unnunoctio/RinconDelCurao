import { create } from 'zustand'
import productsApi from '../api/productsApi'

const imageNotFound = 'src/assets/image_not_found.jpg'

export const useHomeStore = create((set, get) => ({
  offerProducts: [],
  isLoading: false,

  getHomeProducts: async() => {
    set({ isLoading: true })

    const fetchImage = async (imagePath) => {
      try {
        const response = await productsApi.get(`/scraper_products/get-image/${imagePath}`, { responseType: 'arraybuffer' })
        const objectData = `data:image/webp;base64,${btoa(
          new Uint8Array(response.data).reduce((datos, byte) => datos + String.fromCharCode(byte), '')
        )}`
        return objectData
      } catch (error) {
        console.log(error)
        return imageNotFound
      }
    }

    try {
      const { data } = await productsApi.get('/scraper_products/best-discount')

      await Promise.all(data.products.map(async product => {
        const image = await fetchImage(product.image)
        product.image = image
        return product
      }))

      set({ offerProducts: data.products })

      console.log(get().offerProducts)
    } catch (error) {
      console.log(error)
      set({ offerProducts: [] })
    }

    setTimeout(() => {
      set({ isLoading: false })
    }, 500)
  }

}))
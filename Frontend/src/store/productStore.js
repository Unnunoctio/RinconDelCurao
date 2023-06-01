import { create } from 'zustand'
import productsApi from '../api/productsApi'
import { fetchImage } from './helpers/fetchImage'

export const useProductStore = create((set, get) => ({
  product: {},
  isLoading: false,
  isError: false,

  getStoreProduct: async (urlProduct) => {
    set({ isLoading: true })
    set({ isError: false })

    try {
      const { data } = await productsApi.get(`/scraper_products/${urlProduct}`)
      const image = await fetchImage(data.product.image)
      data.product.image = image

      set({ product: data.product })
      set({ isLoading: false })
    } catch (error) {
      console.log(error)
      set({ isLoading: false })
      set({ isError: true })
    }
  },

  resetStoreProduct: () => {
    set((state) => ({
      product: {},
      isLoading: false,
      isError: false
    }))
  }
}))

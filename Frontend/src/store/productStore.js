import { create } from 'zustand'

export const ProductStore = create((set) => ({
  product: {},
  isLoading: false,
  isError: false,

  handleLoading: (loading) => {
    set({ isLoading: loading })
  },

  handleProduct: (product) => {
    set({ product })
  },

  handleError: (error) => {
    set({ isError: error })
  },

  resetStore: () => {
    set((state) => ({
      product: {},
      isLoading: false,
      isError: false
    }))
  }
}))

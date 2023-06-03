import { create } from 'zustand'

export const HomeStore = create((set) => ({
  offerProducts: [],
  isLoading: false,

  handleLoading: (loading) => {
    set({ isLoading: loading })
  },

  handleOfferProducts: (products) => {
    set({ offerProducts: products })
  }
}))

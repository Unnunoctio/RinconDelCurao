import { create } from 'zustand'

export const HomeStore = create((set, get) => ({
  offerProducts: [],
  isLoading: false,

  handleLoading: (loading) => {
    set({ isLoading: loading })
  },

  handleOfferProducts: (products) => {
    set({ offerProducts: products })
  }
}))

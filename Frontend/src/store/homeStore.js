import { create } from 'zustand'

export const HomeStore = create((set) => ({
  offerProducts: [],
  ratingProducts: [],
  isLoading: false,

  handleLoading: (loading) => {
    set({ isLoading: loading })
  },

  handleOfferProducts: (products) => {
    set({ offerProducts: products })
  },

  handleRatingProducts: (products) => {
    set({ ratingProducts: products })
  }
}))

import { create } from 'zustand'

export const useProductsStore = create((set, get) => ({
  products: [],
  count: 0,
  filtersActive: {},
  filtersLimits: {
    rangePrice: [1990, 13590],
    rangeGrade: [0.0, 7.5]
  },
  orderBy: "", // Recomendados
  page: 1, // Page 1
  isLoading: false,

  applyFilters: async(filters) => {
    set({ isLoading: true })
    console.log({filters})

    set({ orderBy: filters.orderBy.value })
    // Setear el Page
    const filtersObj = {}
    if(!!filters.category) filtersObj.category = filters.category
    if(JSON.stringify(get().filtersLimits.rangePrice) !== JSON.stringify(filters.rangePrice)) filtersObj.rangePrice = filters.rangePrice
    if(!!filters.subCategory && filters.subCategory.length > 0) filtersObj.subCategory = filters.subCategory.map(obj => obj.value)
    if(!!filters.brand && filters.brand.length > 0) filtersObj.brand = filters.brand.map(obj => obj.value)
    if(JSON.stringify(get().filtersLimits.rangeGrade) !== JSON.stringify(filters.rangeGrade)) filtersObj.rangeGrade = filters.rangeGrade
    if(!!filters.content && filters.content.length > 0) filtersObj.content = filters.content.map(obj => obj.value)
    if(!!filters.pack_unit && filters.pack_unit.length > 0) filtersObj.pack_unit = filters.pack_unit.map(obj => obj.value)
    if(!!filters.quantity && filters.quantity.length > 0) filtersObj.quantity = filters.quantity.map(obj => obj.value)
    if(!!filters.package && filters.package.length > 0) filtersObj.package = filters.package.map(obj => obj.value)

    set({ filtersActive: filtersObj })

    setTimeout(() => {
      set({ isLoading: false })
    }, 2500)
  }
}))
import { create } from 'zustand'
import productsApi from '../api/productsApi'

export const useProductsStore = create((set, get) => ({
  products: [],
  totalProducts: 0,
  filtersActive: {},
  filtersLimits: {
    rangePrice: [2500, 25000],
    rangeGrade: [0.0, 10.5]
  },
  orderBy: "scoreDesc", // Recomendados
  page: {
    currentPage: 1,
    totalPages: 1
  },
  isLoading: false,

  getProductsByFilters: async(filters) => {
    set({ isLoading: true })

    set({ orderBy: filters.orderBy.value })
    set((state) => ({
      page: {
        ...state.page,
        currentPage: filters.page
      }
    }))
    
    const filtersObj = {}
    if(!!filters.category) filtersObj.category = filters.category
    // if(JSON.stringify(get().filtersLimits.rangePrice) !== JSON.stringify(filters.rangePrice)) filtersObj.rangePrice = filters.rangePrice
    // if(!!filters.subCategory && filters.subCategory.length > 0) filtersObj.subCategory = filters.subCategory.map(obj => obj.value)
    // if(!!filters.brand && filters.brand.length > 0) filtersObj.brand = filters.brand.map(obj => obj.value)
    // if(JSON.stringify(get().filtersLimits.rangeGrade) !== JSON.stringify(filters.rangeGrade)) filtersObj.rangeGrade = filters.rangeGrade
    // if(!!filters.content && filters.content.length > 0) filtersObj.content = filters.content.map(obj => obj.value)
    // if(!!filters.pack_unit && filters.pack_unit.length > 0) filtersObj.pack_unit = filters.pack_unit.map(obj => obj.value)
    // if(!!filters.quantity && filters.quantity.length > 0) filtersObj.quantity = filters.quantity.map(obj => obj.value)
    // if(!!filters.package && filters.package.length > 0) filtersObj.package = filters.package.map(obj => obj.value)

    set({ filtersActive: filtersObj })

    const body = {
      orderBy: get().orderBy,
      page: get().page.currentPage,
      filters: get().filtersActive
    }

    try {
      const { data } = await productsApi.post('/scraper_products', JSON.stringify(body))
      set({ products: data.products })
      set({ totalProducts: data.totalProducts })
      set((state) => ({
        page: {
          ...state.page,
          totalPages: data.totalPages
        }
      }))
      console.log(get().page)
    } catch (error) {
      console.log(error)
      set({ products: [] })
      set({ totalProducts: 0 })
    }

    setTimeout(() => {
      set({ isLoading: false })
    }, 500)
  },

  resetStoreFilters: () => {
    set((state) => ({
      products: [],
      totalProducts: 0,
      filtersActive: {},
      filtersLimits: {},
      orderBy: "scoreDesc",
      page: {
        ...state.page,
        currentPage: 1,
        totalPages: 1
      }
    }))
  }
}))
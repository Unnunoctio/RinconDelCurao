import { create } from 'zustand'
import { orderByItems } from '../assets'

export const ProductsStore = create((set, get) => ({
  products: [],
  totalProducts: 0,
  filterActives: {},
  filterLimits: {},
  orderBy: orderByItems[0].value, // Recomendados
  currentPage: 1,
  totalPages: 1,
  isLoading: false,

  handleLoading: (loading) => {
    set({ isLoading: loading })
  },

  handleProducts: (products, totalProducts) => {
    set({ products })
    set({ totalProducts })
  },

  handleFilterActives: (filters) => {
    set({ filterActives: filters })
  },

  handleFilterLimits: (filters) => {
    set({ filterLimits: filters })
  },

  handleStoreOrderby: (orderBy) => {
    set({ orderBy })
  },

  handleStorePage: (currentPage = null, totalPages = null) => {
    if (totalPages !== null) {
      set({ totalPages })
    }
    if (currentPage !== null) {
      set({ currentPage })
    }
  },

  resetStore: () => {
    set((state) => ({
      products: [],
      totalProducts: 0,
      filterActives: {},
      filterLimits: {},
      orderBy: orderByItems[0].value,
      currentPage: 1,
      totalPages: 1
    }))
  }

  // getStoreProducts: async () => {
  //   set({ isLoading: true })
  //   set({ activePetitions: get().activePetitions + 1 })

  //   const body = {
  //     orderBy: get().orderBy.value,
  //     page: get().page.currentPage,
  //     filters: get().filtersActive
  //   }

  //   set((state) => ({ lastRequest: state.lastRequest + 1 }))
  //   const currentRequest = get().lastRequest

  //   try {
  //     const { data } = await productsApi.post('/scraper_products', JSON.stringify(body))

  //     await Promise.all(data.products.map(async product => {
  //       const image = await fetchImage(product.image)
  //       product.image = image
  //       return product
  //     }))

  //     if (currentRequest === get().lastRequest) {
  //       set((state) => ({
  //         filtersLimits: data.filtersLimits,
  //         products: data.products,
  //         totalProducts: data.totalProducts,
  //         page: {
  //           ...state.page,
  //           totalPages: data.totalPages
  //         }
  //       }))
  //     }
  //   } catch (error) {
  //     console.log(error)
  //     set((state) => ({
  //       products: [],
  //       totalProducts: 0,
  //       page: {
  //         currentPage: 1,
  //         totalPages: 1
  //       }
  //     }))
  //   }

  //   set({ activePetitions: get().activePetitions - 1 })
  //   if (get().activePetitions === 0) {
  //     setTimeout(() => {
  //       set({ isLoading: false })
  //       set({ lastRequest: 0 })
  //     }, 500)
  //   }
  // },

  // handleStoreFilters: (filters) => {
  //   // console.log({filters})
  //   const filtersObj = {}
  //   if (filters.category) filtersObj.category = filters.category
  //   // if(JSON.stringify(get().filtersLimits.rangePrice) !== JSON.stringify(filters.rangePrice)) filtersObj.rangePrice = filters.rangePrice
  //   if (!!filters.subCategory && filters.subCategory.length > 0) filtersObj.subCategory = filters.subCategory.map(obj => obj.value)
  //   // if(!!filters.brand && filters.brand.length > 0) filtersObj.brand = filters.brand.map(obj => obj.value)
  //   // if(JSON.stringify(get().filtersLimits.rangeGrade) !== JSON.stringify(filters.rangeGrade)) filtersObj.rangeGrade = filters.rangeGrade
  //   // if(!!filters.content && filters.content.length > 0) filtersObj.content = filters.content.map(obj => obj.value)
  //   // if(!!filters.pack_unit && filters.pack_unit.length > 0) filtersObj.pack_unit = filters.pack_unit.map(obj => obj.value)
  //   // if(!!filters.quantity && filters.quantity.length > 0) filtersObj.quantity = filters.quantity.map(obj => obj.value)
  //   // if(!!filters.package && filters.package.length > 0) filtersObj.package = filters.package.map(obj => obj.value)
  //   // console.log({filtersObj})
  //   set({ filtersActive: filtersObj })
  // }
}))

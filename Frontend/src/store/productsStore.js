import { create } from 'zustand'
import productsApi from '../api/productsApi'
import { getProducts } from './helpers/getProducts'

const imageNotFound = 'src/assets/image_not_found.jpg'

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
        currentPage: 1
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

    const data = await getProducts(body)
    if(!!data){
      set((state) => ({
        products: data.products,
        totalProducts: data.totalProducts,
        page: {
          ...state.page,
          totalPages: data.totalPages
        }
      }))
    }else{
      set((state) => ({
        products: [],
        totalProducts: 0,
        page: {
          currentPage: 1,
          totalPages: 1
        }
      }))
    }
    
    set({ isLoading: false })
  },

  getProductsByPage: async(page) => {
    set({ isLoading: true })

    set((state) => ({
      page: {
        ...state.page,
        currentPage: page
      }
    }))

    const body = {
      orderBy: get().orderBy,
      page: get().page.currentPage,
      filters: get().filtersActive
    }

    const data = await getProducts(body)
    if(!!data){
      set((state) => ({
        products: data.products,
        totalProducts: data.totalProducts,
        page: {
          ...state.page,
          totalPages: data.totalPages
        }
      }))
    }else{
      set((state) => ({
        products: [],
        totalProducts: 0,
        page: {
          currentPage: 1,
          totalPages: 1
        }
      }))
    }

    set({ isLoading: false })
  },

  getProductsByOrderBy: async(orderBy) => {
    set({ isLoading: true })

    console.log({orderBy})

    set({ orderBy: orderBy.value })

    const body = {
      orderBy: get().orderBy,
      page: get().page.currentPage,
      filters: get().filtersActive
    }

    const data = await getProducts(body)
    if(!!data){
      set((state) => ({
        products: data.products,
        totalProducts: data.totalProducts,
        page: {
          ...state.page,
          totalPages: data.totalPages
        }
      }))
    }else{
      set((state) => ({
        products: [],
        totalProducts: 0,
        page: {
          currentPage: 1,
          totalPages: 1
        }
      }))
    }

    set({ isLoading: false })
  },

  resetStoreFilters: () => {
    set((state) => ({
      products: [],
      totalProducts: 0,
      filtersActive: {},
      filtersLimits: {},
      orderBy: "scoreDesc",
      page: {
        currentPage: 1,
        totalPages: 1
      }
    }))
  }
}))
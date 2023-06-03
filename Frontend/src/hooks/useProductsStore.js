import { useState } from 'react'
import { shallow } from 'zustand/shallow'
import productsApi from '../api/productsApi'
import { ProductsStore, fetchImage } from '../store'

export const useProductsStore = () => {
  const [lastRequest, setLastRequest] = useState(0)

  const [
    isLoading, products, totalProducts,
    filterActives, filterLimits,
    orderBy, currentPage, totalPages
  ] = ProductsStore((state) => [state.isLoading, state.products, state.totalProducts, state.filterActives, state.filterLimits, state.orderBy, state.currentPage, state.totalPages], shallow)

  const [
    handleLoading, handleProducts,
    handleFilterActives, handleFilterLimits,
    handleStoreOrderby, handleStorePage, resetStore
  ] = ProductsStore((state) => [state.handleLoading, state.handleProducts, state.handleFilterActives, state.handleFilterLimits, state.handleStoreOrderby, state.handleStorePage, state.resetStore], shallow)

  const getProducts = async () => {
    handleLoading(true)

    const body = {
      orderBy,
      page: currentPage,
      filters: filterActives
    }

    setLastRequest(lastRequest + 1)
    const currentRequest = lastRequest

    try {
      const { data } = await productsApi.post('/scraper_products', JSON.stringify(body))

      await Promise.all(data.products.map(async product => {
        const image = await fetchImage(product.image)
        product.image = image
        return product
      }))

      if (currentRequest === lastRequest) {
        handleProducts(data.products, data.totalProducts)
        handleFilterLimits(data.filterLimits)
        handleStorePage(null, data.totalPages)
      }
    } catch (error) {
      console.log(error)
      handleProducts([], 0)
      handleStorePage(1, 1)
    }

    if (currentRequest === lastRequest) {
      setTimeout(() => {
        handleLoading(false)
        setLastRequest(0)
      }, 500)
    }
  }

  const handleFilters = (filters) => {
    const filterObj = {}
    if (filters.category) filterObj.category = filters.category
    // rangePrice
    if (!!filters.subCategory && filters.subCategory.length > 0) filterObj.subCategory = filters.subCategory.map(obj => obj.value)
    // brands
    // rangeGrade
    // content
    // pack_unit
    // quantity
    // package

    handleFilterActives(filterObj)
  }

  const handleCurrentPage = (page) => {
    handleStorePage(page, null)
  }

  const handleOrderBy = (orderBy) => {
    handleStoreOrderby(orderBy.value)
  }

  const resetProducts = () => {
    resetStore()
  }

  return {
    isLoading,
    products,
    totalProducts,
    filterActives,
    filterLimits,
    orderBy,
    currentPage,
    totalPages,
    //* Methods
    // generateURL,
    getProducts,
    handleFilters,
    handleCurrentPage,
    handleOrderBy,
    resetProducts
  }
}

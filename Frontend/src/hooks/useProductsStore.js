import { useState } from 'react'
import { shallow } from 'zustand/shallow'
import productsApi from '../api/productsApi'
import { ProductsStore, fetchImage } from '../store'

const queryProducts = `
  query($filters: FiltersInput!, $page: Int!, $orderBy: OrderByEnum!) {
    totalProducts(filters: $filters)
    totalPages(page: $page, filters: $filters)
    allProducts(orderBy: $orderBy, page: $page, filters: $filters) {
      id
      title
      brand
      alcoholic_grade
      content
      best_price
      image_path
    }
  }
`

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

    const variables = {
      orderBy,
      page: currentPage,
      filters: {
        category: filterActives.category
      }
    }

    setLastRequest(lastRequest + 1)
    const currentRequest = lastRequest

    try {
      const { totalProducts, totalPages, allProducts } = await productsApi(queryProducts, variables)
      await Promise.all(allProducts?.map(async product => {
        product.image = await fetchImage(product.image_path)
      }))

      if (currentRequest === lastRequest) {
        handleProducts(allProducts, totalProducts)
        // handleFilterLimits(data.filterLimits)
        handleStorePage(null, totalPages)
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
    // if (!!filters.subCategory && filters.subCategory.length > 0) filterObj.subCategory = filters.subCategory.map(obj => obj.value)
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

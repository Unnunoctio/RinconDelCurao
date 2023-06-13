import { useEffect } from 'react'
import { gql, useLazyQuery } from '@apollo/client'
import { shallow } from 'zustand/shallow'
import { ProductsStore } from '../store'

const GET_ALL_PRODUCTS = gql`
  query GetAllProducts($filters: FiltersInput!, $page: Int!, $orderBy: OrderByEnum!) {
    totalProducts(filters: $filters)
    totalPages(page: $page, filters: $filters)
    allProducts(orderBy: $orderBy, page: $page, filters: $filters) {
      id
      title
      brand
      alcoholic_grade
      content
      best_price
      image
    }
  }
`

export const useProductsStore = () => {
  const [getAllProducts, { error, data }] = useLazyQuery(GET_ALL_PRODUCTS)

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

  useEffect(() => {
    if (error) {
      console.error(error.message)
      handleLoading(false)
    }
    if (data) {
      setTimeout(() => {
        handleProducts(data.allProducts, data.totalProducts)
        // handleFilterLimits(data.filterLimits)
        handleStorePage(null, data.totalPages)
        handleLoading(false)
      }, 500)
    }
  }, [data, error])

  const getProducts = async () => {
    handleLoading(true)

    const variables = {
      orderBy,
      page: currentPage,
      filters: {
        category: filterActives.category
      }
    }

    getAllProducts({ variables })
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

import { useEffect, useRef } from 'react'
import { gql, useLazyQuery } from '@apollo/client'
import { shallow } from 'zustand/shallow'
import { ProductsStore } from '@store'

const GET_ALL_PRODUCTS = gql`
  query GetAllProducts($requestId: ID!, $filters: FiltersInput!, $page: Int!, $orderBy: OrderByEnum!) {
    requestId(requestId: $requestId)
    totalProducts(filters: $filters)
    totalPages(page: $page, filters: $filters)
    filterLimits(filters: $filters) {
      sub_category {
        label
        value
      }
      brand {
        label
        value
      }
      content {
        label
        value
      }
      quantity {
        label
        value
      }
      package {
        label
        value
      }
      range_grade
      range_price
    }
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
  const [getAllProducts, { loading, error, data }] = useLazyQuery(GET_ALL_PRODUCTS, { fetchPolicy: 'network-only' })
  const latestRequestIdRef = useRef(null)

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
    setTimeout(() => {
      if (data?.requestId === latestRequestIdRef.current) {
        if (error) {
          console.error(error.message)
          handleLoading(false)
        }
        if (data) {
          handleProducts(data.allProducts, data.totalProducts)
          handleFilterLimits(data.filterLimits)
          handleStorePage(null, data.totalPages)
        }
        handleLoading(false)
      }
    }, 500)
  }, [data, error, loading])

  const getProducts = async () => {
    handleLoading(true)

    const requestId = Date.now().toString()
    latestRequestIdRef.current = requestId

    console.log(filterActives)

    const variables = {
      requestId,
      orderBy,
      page: currentPage,
      filters: {
        category: filterActives.category,
        sub_category: filterActives.subCategory
      }
    }

    getAllProducts({ variables })
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

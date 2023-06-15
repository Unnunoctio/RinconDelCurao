import { useEffect } from 'react'
import { gql, useLazyQuery } from '@apollo/client'
import { shallow } from 'zustand/shallow'
import { ProductStore } from '../store'

const GET_PRODUCT = gql`
  query GetProduct($productId: ID!, $title: String!) {
    product(id: $productId, title: $title) {
      title
      quantity
      image
      product {
        brand
        alcoholic_grade
        content
        package
        category
        sub_category
        made_in
        variety
        bitterness
        strain
        vineyard
      }
      websites {
        name
        url
        price
        best_price
      }
    }
  }
`

export const useProductStore = () => {
  const [getProductData, { error, data }] = useLazyQuery(GET_PRODUCT, { fetchPolicy: 'network-only' })

  const [isLoading, product, isError] = ProductStore((state) => [state.isLoading, state.product, state.isError], shallow)
  const [handleLoading, handleProduct, handleError, resetStore] = ProductStore((state) => [state.handleLoading, state.handleProduct, state.handleError, state.resetStore], shallow)

  useEffect(() => {
    if (error) {
      console.error(error.message)
      handleError(true)
      handleLoading(false)
    }
    if (data) {
      setTimeout(() => {
        handleProduct(data.product)
        handleLoading(false)
      }, 500)
    }
  }, [data, error])

  const getProduct = async (url) => {
    handleLoading(true)
    handleError(false)

    try {
      const id = url.substring(0, 6)
      const title = url.substring(7)
      getProductData({ variables: { productId: id, title } })
    } catch (error) {
      handleError(true)
      handleLoading(false)
    }
  }

  const resetProduct = () => {
    resetStore()
  }

  return {
    isLoading,
    product,
    isError,
    //* Methods
    getProduct,
    resetProduct
  }
}

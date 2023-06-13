import { shallow } from 'zustand/shallow'
import { HomeStore } from '../store'
import { gql, useLazyQuery } from '@apollo/client'
import { useEffect } from 'react'

const GET_BEST_DISCOUNT_PRODUCTS = gql`
  query GetBestDiscountProducts {
    bestDiscountProducts {
      id
      title
      brand
      discount
      best_price
      image
    }
  }
`

export const useHomeStore = () => {
  const [getProducts, { error, data }] = useLazyQuery(GET_BEST_DISCOUNT_PRODUCTS)

  const [isLoading, offerProducts] = HomeStore((state) => [state.isLoading, state.offerProducts], shallow)
  const [handleLoading, handleOfferProducts] = HomeStore((state) => [state.handleLoading, state.handleOfferProducts], shallow)

  useEffect(() => {
    if (error) {
      console.error(error.message)
      handleLoading(false)
    }
    if (data) {
      console.log(data)
      setTimeout(() => {
        handleOfferProducts(data.bestDiscountProducts)
        handleLoading(false)
      }, 500)
    }
  }, [data, error])

  const getHomeProducts = async () => {
    handleLoading(true)
    getProducts()
  }

  return {
    isLoading,
    offerProducts,
    //* Methods
    getHomeProducts
  }
}

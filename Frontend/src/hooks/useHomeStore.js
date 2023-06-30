import { useEffect } from 'react'
import { gql, useLazyQuery } from '@apollo/client'
import { shallow } from 'zustand/shallow'
import { HomeStore } from '@store'

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
    bestAverageProducts {
      id
      title
      brand
      average
      best_price
      image
    }
  }
`

export const useHomeStore = () => {
  const [getProducts, { error, data }] = useLazyQuery(GET_BEST_DISCOUNT_PRODUCTS, { fetchPolicy: 'network-only' })

  const [isLoading, offerProducts, ratingProducts] = HomeStore((state) => [state.isLoading, state.offerProducts, state.ratingProducts], shallow)
  const [handleLoading, handleOfferProducts, handleRatingProducts] = HomeStore((state) => [state.handleLoading, state.handleOfferProducts, state.handleRatingProducts], shallow)

  useEffect(() => {
    if (error) {
      console.error(error.message)
      handleLoading(false)
    }
    if (data) {
      setTimeout(() => {
        handleOfferProducts(data.bestDiscountProducts)
        handleRatingProducts(data.bestAverageProducts)
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
    ratingProducts,
    //* Methods
    getHomeProducts
  }
}

import { shallow } from 'zustand/shallow'
import { HomeStore, fetchImage } from '../store'
import productsApi from '../api/productsApi'

const queryProducts = `
  query {
    bestDiscountProducts {
      id
      title
      brand
      discount
      best_price
      image_path
    }
  }
`

export const useHomeStore = () => {
  const [isLoading, offerProducts] = HomeStore((state) => [state.isLoading, state.offerProducts], shallow)
  const [handleLoading, handleOfferProducts] = HomeStore((state) => [state.handleLoading, state.handleOfferProducts], shallow)

  const getHomeProducts = async () => {
    handleLoading(true)

    try {
      const { bestDiscountProducts } = await productsApi(queryProducts)
      await Promise.all(bestDiscountProducts?.map(async product => {
        product.image = await fetchImage(product.image_path)
      }))

      handleOfferProducts(bestDiscountProducts)
    } catch (error) {
      console.log(error)
      handleOfferProducts([])
    }

    handleLoading(false)
  }

  return {
    isLoading,
    offerProducts,
    //* Methods
    getHomeProducts
  }
}

import { shallow } from 'zustand/shallow'
import { HomeStore, fetchImage } from '../store'
import productsApi from '../api/productsApi'

export const useHomeStore = () => {
  const [isLoading, offerProducts] = HomeStore((state) => [state.isLoading, state.offerProducts], shallow)
  const [handleLoading, handleOfferProducts] = HomeStore((state) => [state.handleLoading, state.handleOfferProducts], shallow)

  const getHomeProducts = async () => {
    handleLoading(true)

    try {
      const { data } = await productsApi.get('/scraper_products/best-discount')

      await Promise.all(data.products.map(async product => {
        const image = await fetchImage(product.image)
        product.image = image
        return product
      }))

      handleOfferProducts(data.products)
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

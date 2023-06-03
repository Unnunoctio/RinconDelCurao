import { shallow } from 'zustand/shallow'
import { ProductStore, fetchImage } from '../store'
import productsApi from '../api/productsApi'

export const useProductStore = () => {
  const [isLoading, product, isError] = ProductStore((state) => [state.isLoading, state.product, state.isError], shallow)
  const [handleLoading, handleProduct, handleError, resetStore] = ProductStore((state) => [state.handleLoading, state.handleProduct, state.handleError, state.resetStore], shallow)

  const getProduct = async (url) => {
    handleLoading(true)
    handleError(false)

    try {
      const { data } = await productsApi.get(`/scraper_products/${url}`)
      const image = await fetchImage(data.product.image)
      data.product.image = image

      handleProduct(data.product)
    } catch (error) {
      console.log(error)
      handleError(true)
    }

    handleLoading(false)
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

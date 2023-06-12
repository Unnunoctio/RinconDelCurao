import { shallow } from 'zustand/shallow'
import { ProductStore, fetchImage } from '../store'
import productsApi from '../api/productsApi'

const queryProduct = `
  query ($productId: ID!, $title: String!) {
    product(id: $productId, title: $title) {
      title
      quantity
      image_path
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
  const [isLoading, product, isError] = ProductStore((state) => [state.isLoading, state.product, state.isError], shallow)
  const [handleLoading, handleProduct, handleError, resetStore] = ProductStore((state) => [state.handleLoading, state.handleProduct, state.handleError, state.resetStore], shallow)

  const getProduct = async (url) => {
    handleLoading(true)
    handleError(false)

    try {
      const id = url.substring(0, 6)
      const title = url.substring(7)

      const { product } = await productsApi(queryProduct, { productId: id, title })
      product.image = await fetchImage(product.image_path)

      handleProduct(product)
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

import React, { useEffect } from 'react'
import { useProductsStore } from '../store'
import { shallow } from 'zustand/shallow'

export const ProductDetailsPage = () => {
  const [resetStore] = useProductsStore((state) => [state.resetStore], shallow)

  useEffect(() => {
    resetStore()
  }, [])

  return (
    <div>ProductDetailsPage</div>
  )
}

import { Route, Routes } from 'react-router-dom'
import { LayoutApp } from '../layout/LayoutApp'
import { Error404Page } from '../pages'
import { HomePage } from '../pages/HomePage'
import { ProductDetailsPage } from '../pages/ProductDetailsPage'
import { ProductsPage } from '../pages/ProductsPage'

export const AppRouter = () => {
  return (
    <LayoutApp>
      <Routes>
        <Route path='/' element={ <HomePage /> } />
        <Route path='/:category' element={ <ProductsPage /> } />
        <Route path='/:category/:subCategory' element={ <ProductsPage /> } />
        <Route path='productos/:productName' element={ <ProductDetailsPage /> } />

        <Route path='/*' element={ <Error404Page /> } />
      </Routes>
    </LayoutApp>
  )
}

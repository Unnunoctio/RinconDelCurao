import { Route, Routes } from 'react-router-dom'
import { LayoutApp } from '../layout/LayoutApp'
import { Error404Page } from '../pages'
import { HomePage } from '../pages/Home/HomePage'
import { ProductDetailsPage } from '../pages/ProductDetailsPage'
import { ProductsPage } from '../pages/ProductsPage'
import { linkItems } from '../assets/linkItems'

const categoryURls = linkItems.map(obj => obj.url.replace('/', ''))

export const AppRouter = () => {
  return (
    <LayoutApp>
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='productos/:productName' element={<ProductDetailsPage />} />
        <Route path='/'>
          <Route index element={<HomePage />} />
          {
            categoryURls.map(category => (
              <Route
                key={category}
                path={category}
                element={<ProductsPage />}
              />
            ))
          }
        </Route>
        <Route path='/*' element={<Error404Page />} />
      </Routes>
    </LayoutApp>
  )
}

import { useEffect } from 'react'
import { VStack } from '@chakra-ui/react'
import { useHomeStore, useProductStore, useProductsStore } from '@hooks'
import { LayoutPage } from '@layout'
import { Loading } from '@components'
import { SliderBox, SliderList } from './components'

import { OFFER_RATING, STAR_RATING } from './assets/ratingVariant'
import { ratingCards } from './assets/ratingCards'

export const HomePage = () => {
  const { isLoading, offerProducts, getHomeProducts } = useHomeStore()
  const { resetProducts } = useProductsStore()
  const { resetProduct } = useProductStore()

  useEffect(() => {
    resetProducts()
    resetProduct()
  }, [])

  // TODO: Obtener los productos que se mostraran en el home
  useEffect(() => {
    getHomeProducts()
    document.title = 'Rincón del Curao'
  }, [])

  return (
    <LayoutPage>
      <VStack align='flex-start' minH='85vh' justifyContent='space-evenly'>
        <SliderBox title='Ofertas del Día'>
          {
            isLoading
              ? <Loading h='357px' />
              : <SliderList cards={offerProducts} variant={OFFER_RATING} />
          }
        </SliderBox>
        <SliderBox title='Mejor Valorados'>
          {
            isLoading
              ? <Loading h='357px' />
              : <SliderList cards={ratingCards} variant={STAR_RATING} />
          }
        </SliderBox>
      </VStack>
    </LayoutPage>
  )
}

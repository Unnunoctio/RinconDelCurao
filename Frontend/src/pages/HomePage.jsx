import { Box, Flex, Heading, Spinner, VStack, useColorMode } from '@chakra-ui/react'
import { SliderHome } from '../components/slider/SliderHome'
import { useProductStore, useProductsStore } from '../store'
import { shallow } from 'zustand/shallow'
import { useEffect } from 'react'
import { useHomeStore } from '../hooks/useHomeStore'

const imageRating = 'src/assets/jesus.jpg'

const ratingCards = [
  {
    image: imageRating,
    dataValue: 5,
    title: 'Titulo Card 1',
    brand: 'Marca',
    best_price: 5500
  },
  {
    image: imageRating,
    dataValue: 4.7,
    title: 'Titulo Card 2',
    brand: 'Marca',
    best_price: 7000
  },
  {
    image: imageRating,
    dataValue: 4.3,
    title: 'Titulo Card 2',
    brand: 'Marca',
    best_price: 5000
  },
  {
    image: imageRating,
    dataValue: 4,
    title: 'Titulo Card 4',
    brand: 'Marca',
    best_price: 1000
  },
  {
    image: imageRating,
    dataValue: 3.2,
    title: 'Titulo Card 5',
    brand: 'Marca',
    best_price: 2500
  }
]

export const HomePage = () => {
  const { colorMode } = useColorMode()
  // const [isLoading, offerProducts] = useHomeStore((state) => [state.isLoading, state.offerProducts], shallow)
  // const [getHomeProducts] = useHomeStore((state) => [state.getHomeProducts], shallow)
  const { isLoading, offerProducts, getHomeProducts } = useHomeStore()

  const [resetStore] = useProductsStore((state) => [state.resetStore], shallow)
  const [resetStoreProduct] = useProductStore((state) => [state.resetStoreProduct], shallow)

  useEffect(() => {
    resetStore()
    resetStoreProduct()
  }, [])

  // TODO: Obtener los productos que se mostraran en el home
  useEffect(() => {
    getHomeProducts()
    document.title = 'Rincón del Curao'
  }, [])

  return (
    <Box py={{ base: 2, md: 4 }} px={{ base: 2, sm: 4, md: 8 }} w='full'>
      {/* Content Page */}
      <VStack align='flex-start' minH='85vh' justifyContent='space-evenly'>
        <Box w='100%' className='offer-cards'>
          <Heading
            fontSize={{ base: 24, sm: 28 }} fontWeight='medium'
            color={colorMode === 'light' ? 'light.text.main' : 'dark.text.main'}
          >
            Ofertas del Día
          </Heading>
          {
            isLoading
              ? (
                <Flex w='100%' h='357px' justifyContent='center' alignItems='center'>
                  <Spinner
                    size='xl' speed='0.65s'
                    color={colorMode === 'light' ? 'light.component.active' : 'dark.component.active'}
                  />
                </Flex>
                )
              : <SliderHome cards={offerProducts} variant='offer' />
          }
        </Box>

        <Box w='100%' className='rating-cards'>
          <Heading
            fontSize={{ base: 24, sm: 28 }} fontWeight='medium'
            color={colorMode === 'light' ? 'light.text.main' : 'dark.text.main'}
          >
            Mejor Valorados
          </Heading>
          {
            isLoading
              ? (
                <Flex w='100%' h='357px' justifyContent='center' alignItems='center'>
                  <Spinner
                    size='xl' speed='0.65s'
                    color={colorMode === 'light' ? 'light.component.active' : 'dark.component.active'}
                  />
                </Flex>
                )
              : <SliderHome cards={ratingCards} variant='rating' />
          }
        </Box>
      </VStack>
    </Box>
  )
}

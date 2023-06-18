import { Box, Flex, SimpleGrid } from '@chakra-ui/react'
import { Loading } from '@components'
import { useDimensions, useProductsStore } from '@hooks'
import { ProductCard } from './ProductCard'
import { Paginator } from './Paginator'

export const ProductList = () => {
  const { isLoading, products } = useProductsStore()

  const { ref: productsRef, dimensions: productsDimensions } = useDimensions()

  return (
    <Box flex={1} m={0} ml='0px !important' className='product-list' ref={productsRef} maxW='100%'>
      {
        isLoading
          ? <Loading h='70vh' />
          : (
            <Box minH='70vh'>
              <SimpleGrid w='full' minChildWidth='260px' spacing={4} justifyItems='center'>
                {
                  products.map((product, index) => (
                    <ProductCard key={index} dataCard={product} />
                  ))
                }
                {
                  products.length <= 3 && Math.floor((productsDimensions.width - (16 * 3)) / 260) >= 4 && (
                    <ProductCard dataCard={null} visibility='hidden' />
                  )
                }
                {
                  products.length <= 2 && Math.floor((productsDimensions.width - (16 * 2)) / 260) >= 3 && (
                    <ProductCard dataCard={null} visibility='hidden' />
                  )
                }
                {
                  products.length <= 1 && Math.floor((productsDimensions.width - (16 * 1)) / 260) >= 2 && (
                    <ProductCard dataCard={null} visibility='hidden' />
                  )
                }
              </SimpleGrid>
            </Box>
            )
      }
      <Flex w='full' pt={6} justifyContent='center'>
        <Paginator />
      </Flex>
    </Box>
  )
}

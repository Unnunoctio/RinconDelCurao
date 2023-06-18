import { useEffect, useState } from 'react'
import { Box, Flex, Heading, Image, VStack, useColorModeValue } from '@chakra-ui/react'
import { useProductStore, useProductsStore, useURLQuery } from '@hooks'
import { LayoutPage } from '@layout'
import { Error404Page } from '@pages'
import { HeaderPage, Loading } from '@components'
import { linkItems } from '@assets'
import { WebsiteList } from './components/website'
import { FeatureList } from './components/feature'

export const ProductDetailsPage = () => {
  const { queryPaths } = useURLQuery()

  const [breadcrumbLinks, setBreadcrumbLinks] = useState([])
  const { isLoading, product, isError, getProduct } = useProductStore()

  const { resetProducts } = useProductsStore()

  useEffect(() => {
    resetProducts()
  }, [])

  useEffect(() => {
    if (queryPaths.length > 0) {
      const urlProduct = queryPaths[queryPaths.length - 1]
      getProduct(urlProduct)
    }
  }, [queryPaths])

  useEffect(() => {
    if (Object.keys(product).length > 0) {
      const category = linkItems.find(item => item.name === product.product?.category)
      setBreadcrumbLinks([
        { name: 'Home', url: '/' },
        { name: category?.name, url: category?.url },
        { name: product?.title }
      ])
      document.title = `${product?.title} | Rincón del Curao`
    }
  }, [product])

  if (isError) return <Error404Page />
  if (isLoading) return <Loading h='100vh' />

  return (
    <LayoutPage>
      <HeaderPage breadcrumbLinks={breadcrumbLinks}>
        <Heading
          fontSize={{ base: 24, sm: 28 }} fontWeight='medium'
          color={useColorModeValue('light.text.main', 'dark.text.main')}
        >
          {product?.title}
        </Heading>
      </HeaderPage>
      <Flex flexDir={{ base: 'column', md: 'row' }} gap={{ base: 0, md: 1, xl: 8 }}>
        <VStack>
          <Box
            maxH='md' maxW='md'
            p={2} boxShadow='sm' borderRadius='md'
            background={useColorModeValue('light.background.main', 'dark.background.main')}
            border='1px' borderColor={useColorModeValue('light.divider.main', 'dark.divider.main')}
          >
            <Image
              h='full' w='full'
              objectFit='cover'
              borderRadius='sm'
              src={product?.image}
            />
          </Box>
          {/* WebsiteList */}
          {
            product.websites && <WebsiteList websites={product.websites} />
          }
        </VStack>
        {/* FeatureList */}
        {
          (Object.keys(product).length > 0) && <FeatureList quantity={product.quantity} {...product.product} />
        }
      </Flex>
    </LayoutPage>
  )
}

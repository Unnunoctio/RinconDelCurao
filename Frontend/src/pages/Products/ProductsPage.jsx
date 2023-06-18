import { useEffect, useState } from 'react'
import { Flex, HStack, Heading, Text, useColorModeValue } from '@chakra-ui/react'
import { useProductStore, useProductsStore, useURLQuery } from '@hooks'
import { LayoutPage } from '@layout'
import { linkItems } from '@assets'
import { HeaderPage } from '@components'
import { FilterProducts, ProductList } from './components'
import { OrderBySelect } from './components/inputs'

export const ProductsPage = () => {
  const { queryPaths } = useURLQuery()

  const [breadcrumbLinks, setBreadcrumbLinks] = useState([])
  const [title, setTitle] = useState('')

  const {
    totalProducts, filterActives, currentPage, orderBy,
    getProducts
  } = useProductsStore()

  const { resetProduct: resetProductStore } = useProductStore()

  useEffect(() => {
    resetProductStore()
  }, [])

  useEffect(() => {
    const category = linkItems.find(item => item.url === `/${queryPaths[1]}`)
    if (category) {
      setBreadcrumbLinks([
        { name: 'Home', url: '/' },
        { name: category?.name, url: category?.url }
      ])

      setTitle(category?.name)
      document.title = `${category?.name} | Rincón del Curao`
    }
  }, [queryPaths])

  useEffect(() => {
    if (Object.entries(filterActives).length > 0) {
      console.log('me ejecute')
      getProducts()
    }
  }, [filterActives, currentPage, orderBy])

  return (
    <LayoutPage>
      <HeaderPage
        breadcrumbLinks={breadcrumbLinks}
        justifyContent='space-between' alignItems={{ base: 'flex-start', md: 'center' }}
        flexDir={{ base: 'column', md: 'row' }}
      >
        <Flex gap={2} alignItems='baseline'>
          <Heading
            fontSize={28} fontWeight='medium'
            color={useColorModeValue('light.text.main', 'dark.text.main')}
          >
            {title}
          </Heading>
          <Text
            display={{ base: 'block', xl: 'none' }}
            color={useColorModeValue('light.text.active', 'dark.text.active')}
          >
            {totalProducts} {totalProducts !== 1 ? 'resultados' : 'resultado'}
          </Text>
        </Flex>
        <HStack spacing={2} mt={{ base: 2, md: 0 }} w={{ base: 'full', md: 'auto' }} justifyContent='flex-end'>
          <OrderBySelect />
        </HStack>
      </HeaderPage>
      <HStack align='flex-start' gap={6}>
        {/* Filtro */}
        <FilterProducts />
        {/* Lista de productos */}
        <ProductList />
      </HStack>
    </LayoutPage>
  )
}

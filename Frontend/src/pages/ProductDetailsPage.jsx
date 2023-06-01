import { useProductsStore } from '../store'
import { shallow } from 'zustand/shallow'
import { useEffect, useState } from 'react'
import { Box, Flex, Heading, Image, SimpleGrid, VStack, useColorModeValue } from '@chakra-ui/react'
import { FeatureItem, WebsiteItem } from '../components/items'
import { useDimensions, useQueryURL } from '../hooks'
import { useProductStore } from '../store/productStore'
import { Error404Page } from './Error404Page'
import { linkItems } from '../assets'
import { AlcoholicIcon, BitternessIcon, BrandIcon, CategoryIcon, ContentIcon, PackagingIcon, PlaceIcon, QuantityIcon, StrainIcon, VineyardIcon, WheatIcon } from '../assets/SvgFeatures'
import { BreadcrumbPage } from '../components/breadcrumbs/BreadcrumbPage'

export const ProductDetailsPage = () => {
  const { queryPaths } = useQueryURL()

  const [breadCrumbLinks, setBreadCrumbLinks] = useState([])
  const [product, isError] = useProductStore((state) => [state.product, state.isError], shallow)
  const [getStoreProduct] = useProductStore((state) => [state.getStoreProduct], shallow)

  const [resetStore] = useProductsStore((state) => [state.resetStore], shallow)

  useEffect(() => {
    resetStore()
  }, [])

  useEffect(() => {
    if (queryPaths.length > 0) {
      const urlProduct = queryPaths[queryPaths.length - 1]
      getStoreProduct(urlProduct)

      if (product.product?.alcoholic_grade !== undefined) {
        console.log('xd')
      }
    }
  }, [queryPaths])

  useEffect(() => {
    const category = linkItems.find(item => item.name === product.product?.category)
    setBreadCrumbLinks([
      { name: 'Home', url: '/' },
      { name: category?.name, url: category?.url },
      { name: product?.title }
    ])
    document.title = `${product?.title} | Rincón del Curao`
  }, [product])

  const { ref: featuresRef, dimensions: featuresDimensions } = useDimensions()

  // console.log(featuresDimensions)

  return (
    <>
      {
        isError
          ? <Error404Page />
          : (
            <Box py={{ base: 2, md: 4 }} px={{ base: 2, sm: 4, md: 8 }} w='100%'>
              {/* Breadcrumb */}
              <BreadcrumbPage links={breadCrumbLinks} />
              {/* Title */}
              <Flex py={4} alignItems='center' minH='72px'>
                <Heading fontSize={{ base: 24, sm: 28 }} fontWeight='medium'>{product.title}</Heading>
              </Flex>
              {/* Content Page */}
              <Flex flexDir={{ base: 'column', md: 'row' }} gap={{ base: 0, md: 1, xl: 8 }}>
                {/* Image and Websites */}
                <VStack>
                  <Box
                    maxH='md' maxW='md'
                    p={2} boxShadow='sm' borderRadius='md'
                    background={useColorModeValue('light.background.main', 'dark.background.main')}
                    border='1px' borderColor={useColorModeValue('light.divider.main', 'dark.divider.main')}
                  >
                    <Image
                      h='100%' w='100%'
                      objectFit='cover'
                      borderRadius='sm'
                      src={product.image}
                    />
                  </Box>
                  {/* Websites */}
                  <Box py={2} w='full'>
                    <Heading fontSize={{ base: 22, sm: 24 }} fontWeight='medium' textAlign='center'>Tiendas</Heading>
                    <VStack py={2}>
                      {
                        product.websites?.map((website, index) => (
                          <WebsiteItem key={index} website={website} />
                        ))
                      }
                    </VStack>
                  </Box>
                </VStack>
                {/* Features */}
                <Box flex={1} ref={featuresRef}>
                  <Heading fontSize={{ base: 22, sm: 24 }} fontWeight='medium' textAlign='center'>Caracteristicas</Heading>
                  <SimpleGrid
                    py={4}
                    rowGap={3}
                    columns={featuresDimensions.width <= 550 ? 1 : 2}
                    justifyItems='center'
                  >
                    {// TODO: Icono de Marca
                      product.product?.brand && (
                        <FeatureItem title='Marca' icon={<BrandIcon boxSize={`${4 * 11}px`} />}>
                          {product.product.brand}
                        </FeatureItem>
                      )
                    }
                    {// TODO: Icono de Sub-Categoria
                      product.product?.category && (
                        <FeatureItem title='Categoria' icon={<CategoryIcon boxSize={12} />}>
                          {product.product.sub_category}
                        </FeatureItem>
                      )
                    }
                    {// TODO: Icono de Cantidad
                      product.quantity && (
                        <FeatureItem title='Cantidad' icon={<QuantityIcon boxSize={12} />}>
                          {product.quantity} {product.quantity > 1 ? 'Unidades' : 'Unidad'}
                        </FeatureItem>
                      )
                    }
                    {// TODO: Icono de Contenido
                      product.product?.content && (
                        <FeatureItem title='Contenido' icon={<ContentIcon boxSize={`${4 * 11}px`} />}>
                          {(product.product.content / 1000) > 1 ? `${product.product.content / 1000} L` : `${product.product.content} cc`}
                        </FeatureItem>
                      )
                    }
                    {// TODO: Icono de Estilo para cervezas
                      product.product?.variety && (
                        <FeatureItem title='Estilo' icon={<WheatIcon boxSize={`${4 * 11}px`} />}>
                          {product.product.variety}
                        </FeatureItem>
                      )
                    }
                    {// TODO: Icono de Cepa
                      product.product?.strain && (
                        <FeatureItem title='Cepa' icon={<StrainIcon boxSize={12} />}>
                          {product.product.strain}
                        </FeatureItem>
                      )
                    }
                    {// TODO: Icono de Viña
                      product.product?.vineyard && (
                        <FeatureItem title='Viña' icon={<VineyardIcon boxSize={12} />}>
                          {product.product.vineyard}
                        </FeatureItem>
                      )
                    }
                    {// TODO: Icono de Alcohol
                      (product.product?.alcoholic_grade !== undefined) && (
                        <FeatureItem title='Grado Alcohólico' icon={<AlcoholicIcon boxSize={12} />}>
                          {product.product.alcoholic_grade.toString().replace('.', ',')}°
                        </FeatureItem>
                      )
                    }
                    {// TODO: Icono de Amargor
                      product.product?.bitterness && (
                        <FeatureItem title='Amargor' icon={<BitternessIcon boxSize={`${4 * 11}px`} />}>
                          {product.product.bitterness}
                        </FeatureItem>
                      )
                    }
                    {// TODO: Icono de Packaging
                      product.product?.package && (
                        <FeatureItem title='Envase' icon={<PackagingIcon boxSize={12} />}>
                          {product.product.package}
                        </FeatureItem>
                      )
                    }
                    {// TODO: Icono de Lugar de Origen
                      product.product?.made_in && (
                        <FeatureItem title='Lugar de Origen' icon={<PlaceIcon boxSize={12} />}>
                          {product.product.made_in}
                        </FeatureItem>
                      )
                    }
                  </SimpleGrid>
                </Box>
              </Flex>
            </Box>
            )
      }
    </>
  )
}

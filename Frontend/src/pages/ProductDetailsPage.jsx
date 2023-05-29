import { useProductsStore } from '../store'
import { shallow } from 'zustand/shallow'
import { useEffect, useState } from 'react'
import { Box, Flex, Heading, Icon, Image, SimpleGrid, Text, useColorModeValue } from '@chakra-ui/react'
import { FeatureItem } from '../components/items'
import { useDimensions } from '../hooks'
// import { useQueryURL } from '../hooks'

const imageRating = '../src/assets/chela.webp'

export const ProductDetailsPage = () => {
  // const { queryPaths } = useQueryURL()

  // const [breadCrumbLinks, setBreadCrumbLinks] = useState([])

  const [resetStore] = useProductsStore((state) => [state.resetStore], shallow)

  useEffect(() => {
    resetStore()
  }, [])

  // useEffect(() => {
  //   console.log({ queryPaths })
  // }, [])

  const { ref: featuresRef, dimensions: featuresDimensions } = useDimensions()

  console.log(featuresDimensions)

  return (
    <Box py={{ base: 2, md: 4 }} px={{ base: 2, sm: 4, md: 8 }} w='full'>
      {/* Breadcrumb */}
      {/* Title */}
      <Flex py={4} alignItems='center' h='72px'>
        <Heading fontSize={{ base: 28, sm: 28 }} fontWeight='medium'>Titulo</Heading>
      </Flex>
      {/* Content Page */}
      <Flex flexDir={{ base: 'column', md: 'row' }} gap={{ base: 0, md: 12 }}>
        {/* Image and Websites */}
        <Box
          h='md' w='md'
          p={2} boxShadow='sm' borderRadius='md'
          background={useColorModeValue('light.background.main', 'dark.background.main')}
        >
          <Image
            h='100%' w='100%'
            objectFit='cover'
            borderRadius='sm'
            src={imageRating}
          />
        </Box>
        {/* Features */}
        <Box flex={1} p={2} ref={featuresRef}>
          <Heading fontSize={26} fontWeight='medium'>Caracteristicas</Heading>
          <SimpleGrid
            py={4}
            rowGap={3}
            columns={featuresDimensions.width <= 550 ? 1 : 2}
          >
            <FeatureItem title='Categoria 1' value='Cervezas Artesanales'>
              <Icon boxSize={12} />
            </FeatureItem>
            <FeatureItem title='Categoria 2' value='Cervezas Artesanales'>
              <Icon boxSize={12} />
            </FeatureItem>
            <FeatureItem title='Categoria 3' value='Cervezas Artesanales'>
              <Icon boxSize={12} />
            </FeatureItem>
            <FeatureItem title='Categoria 4' value='Cervezas Artesanales'>
              <Icon boxSize={12} />
            </FeatureItem>
            <FeatureItem title='Categoria 5' value='Cervezas Artesanales'>
              <Icon boxSize={12} />
            </FeatureItem>
            <FeatureItem title='Categoria 6' value='Cervezas Artesanales'>
              <Icon boxSize={12} />
            </FeatureItem>
            <FeatureItem title='Categoria 7' value='Cervezas Artesanales'>
              <Icon boxSize={12} />
            </FeatureItem>
            <FeatureItem title='Categoria 8' value='Cervezas Artesanales'>
              <Icon boxSize={12} />
            </FeatureItem>
            <FeatureItem title='Categoria 9' value='Cervezas Artesanales'>
              <Icon boxSize={12} />
            </FeatureItem>
          </SimpleGrid>
        </Box>
      </Flex>
    </Box>
  )
}

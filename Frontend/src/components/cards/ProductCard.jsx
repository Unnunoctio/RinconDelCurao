import { Card, CardBody, HStack, Image, Text, VStack, useColorModeValue } from '@chakra-ui/react'
import React, { useEffect } from 'react'
import { useState } from 'react'
import productsApi from '../../api/productsApi'

const imageNotFound = 'src/assets/image_not_found.jpg'

export const ProductCard = ({ dataCard, ...rest }) => {
  const [imageSrc, setImageSrc] = useState(null)

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const response = await productsApi.get(`/scraper_products/get-image/${dataCard?.image}`, { responseType: 'arraybuffer' })
        const objectData = `data:image/webp;base64,${btoa(
          new Uint8Array(response.data).reduce((datos, byte) => datos + String.fromCharCode(byte), '')
        )}`
        setImageSrc(objectData)
      } catch (error) {
        console.log(error)
        setImageSrc(imageNotFound)
      }
    }

    fetchImage()
  }, [])

  const onClickCard = () => {
    //TODO: Enviar al link de la card
  }

  return (
    <Card
      className='product-card'
      w={{ base: 260, md: 260 }}
      background={useColorModeValue('white', 'gray.900')}
      boxShadow={'md'}
      border={'1px'} borderColor={useColorModeValue('gray.200', 'gray.700')}
      transition={'transform 200ms ease'}
      cursor={'pointer'}
      _hover={{
        transform: 'scale(1.025)'
      }}
      {...rest}
    >
      <CardBody h={'full'} p={2} display={'flex'} flexDir={'column'}>
        <Image
          h={200}
          objectFit={'cover'}
          borderRadius={'sm'}
          src={imageSrc}
        />

        <VStack flex={1} pt={2}
          spacing={0}
          alignItems={'flex-start'}
          justifyContent={'space-between'}
        >
          <VStack spacing={0} alignItems={'flex-start'} w={'full'}>
            <Text color={'gray.600'} >{dataCard?.product.brand}</Text>
            <Text fontWeight={'medium'} fontSize={18}>{dataCard?.title}</Text>
          </VStack>
          <HStack w={'full'} justifyContent={'space-between'} alignItems={'flex-end'}>
            <VStack spacing={0} alignItems={'flex-start'}>
              <Text color={'gray.600'} >Graduación: {dataCard?.product.alcoholic_grade}°</Text>
              <Text color={'gray.600'} >Contenido: {dataCard?.product.content}cc</Text>
            </VStack>
            <Text fontWeight={'medium'} fontSize={20}>${dataCard?.websites[0].best_price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}</Text>
          </HStack>
        </VStack>
      </CardBody>
    </Card>
  )
}

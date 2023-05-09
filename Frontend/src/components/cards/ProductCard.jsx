import { Card, CardBody, HStack, Image, Text, VStack, useColorModeValue } from '@chakra-ui/react'
import React from 'react'

const imageOffer = 'src/assets/seba.jpg'

export const ProductCard = ({ dataCard, ...rest }) => {

  const onClickCard = () => {
    //TODO: Enviar al link de la carta
  }

  return (
    <Card
      className='product-card'
      w={{ base: 260, md: 260 }}
      background={useColorModeValue('white', 'gray.900')}
      boxShadow={'md'}
      border={'1px'} borderColor={useColorModeValue('gray.200', 'gray.700')}
      transition={'transform 0.1s ease-out'}
      cursor={'pointer'}
      _hover={{
        transform: 'scale(1.01)'
      }}
      {...rest}
    >
      <CardBody h={'full'} p={2} display={'flex'} flexDir={'column'}>
        <Image
          h={170}
          objectFit={'cover'}
          borderRadius={'sm'}
          src={imageOffer}
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

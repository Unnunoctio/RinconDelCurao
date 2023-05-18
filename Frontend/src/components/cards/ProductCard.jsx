import { Card, CardBody, HStack, Image, Text, VStack, useColorModeValue } from '@chakra-ui/react'

export const ProductCard = ({ dataCard, ...rest }) => {
  const onClickCard = () => {
    //TODO: Enviar al link de la card
  }

  return (
    <Card
      className='product-card'
      w={{ base: 260, md: 260 }}
      background={useColorModeValue('light.background.main', 'dark.background.main')}
      boxShadow={'md'}
      border={'1px'} borderColor={useColorModeValue('light.divider.main', 'dark.divider.main')}
      transition={'transform 200ms ease'}
      cursor={'pointer'}
      _hover={{
        transform: 'scale(1.025)',
        borderColor: useColorModeValue('light.divider.active', 'dark.divider.active')
      }}
      {...rest}
    >
      <CardBody h={'full'} p={2} display={'flex'} flexDir={'column'}>
        <Image
          h={200}
          objectFit={'cover'}
          borderRadius={'sm'}
          src={dataCard?.image}
        />

        <VStack flex={1} pt={2}
          spacing={0}
          alignItems={'flex-start'}
          justifyContent={'space-between'}
        >
          <VStack spacing={0} alignItems={'flex-start'} w={'full'}>
            <Text color={useColorModeValue('light.text.secondary', 'dark.text.secondary')} >{dataCard?.product.brand}</Text>
            <Text fontWeight={'medium'} fontSize={18} 
              color={useColorModeValue('light.text.main', 'dark.text.main')}
            >
              {dataCard?.title}
            </Text>
          </VStack>
          <HStack w={'full'} justifyContent={'space-between'} alignItems={'flex-end'}>
            <VStack spacing={0} alignItems={'flex-start'}>
              <Text color={useColorModeValue('light.text.secondary', 'dark.text.secondary')} >Graduación: {dataCard?.product.alcoholic_grade}°</Text>
              <Text color={useColorModeValue('light.text.secondary', 'dark.text.secondary')} >Contenido: {dataCard?.product.content}cc</Text>
            </VStack>
            <Text fontWeight={'medium'} fontSize={20}
              color={useColorModeValue('light.text.main', 'dark.text.main')}
            >
              ${dataCard?.websites[0].best_price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
            </Text>
          </HStack>
        </VStack>
      </CardBody>
    </Card>
  )
}

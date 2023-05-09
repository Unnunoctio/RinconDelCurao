import { Box, Card, CardBody, HStack, Image, Text, useColorModeValue, VStack } from "@chakra-ui/react"
import { StarRating } from "../items"

export const SliderCard = ({ dataCard, variant }) => {
  return (
    <Card
      my={3} mx={4}
      w={{ base: 240, md: 260 }} h={{ base: 260, md: 280 }}
      background={useColorModeValue('white', 'gray.900')}
      boxShadow={'md'} 
      border={'1px'} borderColor={useColorModeValue('gray.200', 'gray.700')}
      transition={'transform 0.2s ease-out'}
      cursor={'pointer'}
      _hover={{
        transform: 'scale(1.025)',
        // boxShadow: 'lg'
      }}
    >
      <CardBody h={'full'} p={0} display={'flex'} flexDir={'column'}>
        <Image
          w={'100%'} h={{ base: '156px', md: '176px' }}
          objectFit={'cover'}
          borderTopRadius={'md'}
          src={dataCard.image}
        />

        <VStack 
          px={3} py={2}
          spacing={1}
          justifyContent={'space-between'} alignItems={'flex-start'}
        >
          {
            (variant === 'offer') 
            ? (
              <Box px={2} py={'1px'} background={'rgba(214,158,46,0.6)'} borderRadius={'md'}>
                <Text fontWeight={'medium'} fontSize={14}>{dataCard.dataValue}% desc</Text>
              </Box>
            )
            : (variant === 'rating')
            ? <StarRating rating={dataCard.dataValue} />
            : null
          }
          <Text fontWeight={'medium'} fontSize={18}>{dataCard.title}</Text>
          <HStack w={'full'} justifyContent={'space-between'}>
            <Text color={'gray.600'}>{dataCard.brand}</Text>
            <Text fontWeight={'medium'} fontSize={20}>${(dataCard.price).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}</Text>
          </HStack>
        </VStack>
      </CardBody>
    </Card>
  )
}

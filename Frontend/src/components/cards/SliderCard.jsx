import { Box, Card, CardBody, HStack, Image, Text, useColorModeValue, VStack } from '@chakra-ui/react'
import { StarRating } from '../items'
import { NavLink } from 'react-router-dom'
import { useEffect, useState } from 'react'

export const SliderCard = ({ dataCard, variant }) => {
  const [hrefCard, setHrefCard] = useState('')

  useEffect(() => {
    const titleLink = dataCard?.title.toLowerCase().replaceAll('.', '').replaceAll('°', '').replaceAll(' ', '-')
    setHrefCard(`/productos/${dataCard?.id}-${titleLink}`)
  }, [dataCard])

  return (
    <Card
      className='slider-card'
      my={3} mx={2}
      w={{ base: 260, md: 260 }}
      background={useColorModeValue('light.background.main', 'dark.background.main')}
      boxShadow='md'
      border='1px' borderColor={useColorModeValue('light.divider.main', 'dark.divider.main')}
      transition='transform 0.2s ease-out'
      cursor='pointer'
      _hover={{
        transform: 'scale(1.025)',
        borderColor: useColorModeValue('light.divider.active', 'dark.divider.active')
      }}
    >
      <NavLink to={hrefCard}>

        <CardBody h='full' p={2} display='flex' flexDir='column'>
          <Image
            h={200}
            objectFit='cover'
            borderRadius='sm'
            src={dataCard?.image}
          />

          <VStack
            flex={1} pt={2}
            spacing={0}
            alignItems='flex-start'
            justifyContent='space-between'
          >
            {
              (variant === 'offer')
                ? (
                  <Box px={2} py='1px' background={useColorModeValue('light.background.active', 'dark.background.active')} borderRadius='md'>
                    <Text fontWeight='medium' fontSize={14} color={useColorModeValue('light.text.main', 'dark.text.main')}>
                      {dataCard?.discount}% desc
                    </Text>
                  </Box>
                  )
                : (variant === 'rating')
                    ? <StarRating rating={dataCard?.dataValue} />
                    : null
            }
            <Text
              fontWeight='medium' fontSize={18} minH={54}
              color={useColorModeValue('light.text.main', 'dark.text.main')}
            >
              {dataCard?.title}
            </Text>
            <HStack w='full' justifyContent='space-between'>
              <Text color={useColorModeValue('light.text.secondary', 'dark.text.secondary')}>{dataCard?.brand}</Text>
              <Text
                fontWeight='medium' fontSize={20}
                color={useColorModeValue('light.text.main', 'dark.text.main')}
              >
                ${dataCard?.best_price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}
              </Text>
            </HStack>
          </VStack>
        </CardBody>
      </NavLink>
    </Card>
  )
}

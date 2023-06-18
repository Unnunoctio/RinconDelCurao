import { useEffect, useState } from 'react'
import { HStack, Image, Text, VStack, useColorModeValue } from '@chakra-ui/react'
import { CardLink } from '@components'
import { OfferRating, StarRating } from './rating'
import { OFFER_RATING, STAR_RATING } from '../assets/ratingVariant'

export const SliderCard = ({ dataCard, variant }) => {
  const [hrefCard, setHrefCard] = useState('')

  useEffect(() => {
    const titleLink = dataCard?.title.toLowerCase().replaceAll('.', '').replaceAll('°', '').replaceAll(' ', '-').normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    setHrefCard(`/productos/${dataCard?.id}-${titleLink}`)
  }, [dataCard])

  return (
    <CardLink herf={hrefCard} my={3} mx={2}>
      <Image
        h={200}
        objectFit='cover'
        borderRadius='sm'
        src={dataCard?.image}
      />

      <VStack
        flex={1} pt={2}
        spacing={0}
        alignItems='flex-start' justifyContent='space-between'
      >
        <>
          {
            (variant === OFFER_RATING) && <OfferRating value={dataCard?.discount} />
          }
          {
            (variant === STAR_RATING) && <StarRating value={dataCard?.dataValue} />
          }
        </>
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
    </CardLink>
  )
}

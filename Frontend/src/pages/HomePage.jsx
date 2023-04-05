import { Flex } from '@chakra-ui/react'
import { SliderHome } from '../components/slider/SliderHome'

const imageOffer = 'src/assets/seba.jpg'
const imageRating = 'src/assets/jesus.jpg'

const offerCards = [
  {
    image: imageOffer,
    dataValue: 26,
    title: 'Titulo Card 1',
    brand: 'Marca',
    price: 5600,
    href: '#',
  },
  {
    image: imageOffer,
    dataValue: 26,
    title: 'Titulo Card 2',
    brand: 'Marca',
    price: 5600,
    href: '#',
  },
  {
    image: imageOffer,
    dataValue: 26,
    title: 'Titulo Card 3',
    brand: 'Marca',
    price: 5600,
    href: '#',
  },
  {
    image: imageOffer,
    dataValue: 26,
    title: 'Titulo Card 4',
    brand: 'Marca',
    price: 5600,
    href: '#',
  },
  {
    image: imageOffer,
    dataValue: 26,
    title: 'Titulo Card 5',
    brand: 'Marca',
    price: 5600,
    href: '#',
  },
  {
    image: imageOffer,
    dataValue: 26,
    title: 'Titulo Card 6',
    brand: 'Marca',
    price: 5600,
    href: '#',
  },
  {
    image: imageOffer,
    dataValue: 26,
    title: 'Titulo Card 7',
    brand: 'Marca',
    price: 5600,
    href: '#',
  },
  {
    image: imageOffer,
    dataValue: 26,
    title: 'Titulo Card 8',
    brand: 'Marca',
    price: 5600,
    href: '#',
  },
  {
    image: imageOffer,
    dataValue: 26,
    title: 'Titulo Card 9',
    brand: 'Marca',
    price: 5600,
    href: '#',
  },
  {
    image: imageOffer,
    dataValue: 26,
    title: 'Titulo Card 10',
    brand: 'Marca',
    price: 5600,
    href: '#',
  }
]

const ratingCards = [
  {
    image: imageRating,
    dataValue: 5,
    title: 'Titulo Card 1',
    brand: 'Marca',
    price: 5600,
    href: '#',
  },
  {
    image: imageRating,
    dataValue: 4.7,
    title: 'Titulo Card 2',
    brand: 'Marca',
    price: 7000,
    href: '#',
  },
  {
    image: imageRating,
    dataValue: 4,
    title: 'Titulo Card 3',
    brand: 'Marca',
    price: 2300,
    href: '#',
  },
  {
    image: imageRating,
    dataValue: 4,
    title: 'Titulo Card 4',
    brand: 'Marca',
    price: 1000,
    href: '#',
  },
  {
    image: imageRating,
    dataValue: 3.2,
    title: 'Titulo Card 5',
    brand: 'Marca',
    price: 3000,
    href: '#',
  },
]

export const HomePage = () => {
  return (
    <Flex p={4} gap={4} w={'full'} minH={'90vh'} flexDir={'column'} justifyContent={'space-evenly'}>
      <SliderHome title={'Ofertas del Día'} cards={offerCards} variant={'offer'} />

      <SliderHome title={'Mejor Valorados'} cards={ratingCards} variant={'rating'} />
    </Flex>
  )
}

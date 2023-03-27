import { Box } from '@chakra-ui/react'
import { StarRating } from '../components/items'
import { SliderHome } from '../components/slider/SliderHome'

const image = 'src/assets/seba.jpg'
const cards = [
  {
    image: image,
    dataValue: 26,
    title: 'Titulo Card 1',
    brand: 'Marca',
    price: 5600,
    href: '#',
  },
  {
    image: image,
    dataValue: 26,
    title: 'Titulo Card 2',
    brand: 'Marca',
    price: 5600,
    href: '#',
  },
  {
    image: image,
    dataValue: 26,
    title: 'Titulo Card 3',
    brand: 'Marca',
    price: 5600,
    href: '#',
  },
  {
    image: image,
    dataValue: 26,
    title: 'Titulo Card 4',
    brand: 'Marca',
    price: 5600,
    href: '#',
  },
  {
    image: image,
    dataValue: 26,
    title: 'Titulo Card 5',
    brand: 'Marca',
    price: 5600,
    href: '#',
  },
  {
    image: image,
    dataValue: 26,
    title: 'Titulo Card 6',
    brand: 'Marca',
    price: 5600,
    href: '#',
  },
  {
    image: image,
    dataValue: 26,
    title: 'Titulo Card 7',
    brand: 'Marca',
    price: 5600,
    href: '#',
  },
  {
    image: image,
    dataValue: 26,
    title: 'Titulo Card 8',
    brand: 'Marca',
    price: 5600,
    href: '#',
  },
  {
    image: image,
    dataValue: 26,
    title: 'Titulo Card 9',
    brand: 'Marca',
    price: 5600,
    href: '#',
  },
  {
    image: image,
    dataValue: 26,
    title: 'Titulo Card 10',
    brand: 'Marca',
    price: 5600,
    href: '#',
  }
]

export const HomePage = () => {
  return (
    <Box w={'full'}>
      <SliderHome title={'Ofertas del Día'} />

      <br/>
      <StarRating rating={3.2}/>
    </Box>
  )
}

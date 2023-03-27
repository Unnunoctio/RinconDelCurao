import { Box, Icon, Heading, IconButton } from "@chakra-ui/react";
import Slider from "react-slick"
import { SliderCard } from "../cards/SliderCard";
import { SlArrowLeft, SlArrowRight } from 'react-icons/sl'
import { RxDot, RxDotFilled } from 'react-icons/rx'
import { useState } from "react";

import './sliderHome.css'

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

function CustomNextArrow(props) {
  const { onClick } = props

  return (
    <IconButton onClick={onClick}
      icon={<Icon boxSize={8} as={SlArrowRight} />}
      position={'absolute'}
      bg={'transparent'}
      top={'calc(50% - 20px)'}
      right={'-44px'}
      color={'gray.500'}
      borderRadius={'full'}
      justifyContent={'flex-end'}
      _hover={{ color: 'yellow.500' }}
    />
  )
}

function CustomPrevArrow(props) {
  const { onClick } = props

  return (
    <IconButton onClick={onClick}
      icon={<Icon boxSize={8} as={SlArrowLeft} />}
      position={'absolute'}
      bg={'transparent'}
      top={'calc(50% - 20px)'}
      left={'-44px'}
      color={'gray.500'}
      borderRadius={'full'}
      justifyContent={'flex-start'}
      _hover={{ color: 'yellow.500' }}
    />
  )
}

function CustomDot(i, currentSlide, slidesToScroll) {
  return (
    <Icon boxSize={7}
      as={(i === (currentSlide/slidesToScroll)) ? RxDotFilled : RxDot}
      color={(i === (currentSlide/slidesToScroll)) ? 'yellow.500' : 'gray.500'}
      _hover={{ color: 'yellow.500' }}
    />
  )
}

export const SliderHome = ({ title }) => {
  const [currentSlide, setCurrentSlide] = useState(0)

  const settings = {
    dots: true,
    infinite: true,
    // centerMode: true,
    slidesToShow: 4,
    slidesToScroll: 4,
    speed: 800,
    autoplay: true,
    autoplaySpeed: 5000,

    afterChange: (index) => {
      setCurrentSlide(index)
    },
    prevArrow: <CustomPrevArrow />,
    nextArrow: <CustomNextArrow />,
    customPaging: i => CustomDot(i, currentSlide, 4)
  }
  // appendDots: dots => { console.log({dots}) }

  return (
    <Box>
      <Heading fontSize={28} fontWeight={'medium'} fontFamily={'roboto'}>{title}</Heading>

      <Slider {...settings}>
        {
          cards.map((card, index) => (
            <SliderCard key={index} dataCard={card} />
          ))
        }
      </Slider>
    </Box>
  )
}

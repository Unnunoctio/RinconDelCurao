import { Box, Icon, Heading, IconButton } from "@chakra-ui/react";
import Slider from "react-slick"
import { SliderCard } from "../cards/SliderCard";
import { SlArrowLeft, SlArrowRight } from 'react-icons/sl'
import { RxDot, RxDotFilled } from 'react-icons/rx'
import { useState } from "react";

import './sliderHome.css'

function CustomNextArrow(props) {
  const { onClick } = props

  return (
    <IconButton onClick={onClick} display={{ base: 'none', md: 'flex' }}
      icon={<Icon boxSize={7} as={SlArrowRight} />}
      position={'absolute'}
      bg={'transparent'}
      top={'calc(50% - 20px)'}
      right={'-44px'}
      color={'gray.500'}
      borderRadius={'md'}
      // justifyContent={'flex-end'}
      _hover={{ color: 'yellow.500' }}
    />
  )
}

function CustomPrevArrow(props) {
  const { onClick } = props

  return (
    <IconButton onClick={onClick} display={{ base: 'none', md: 'flex' }}
      icon={<Icon boxSize={7} as={SlArrowLeft} />}
      position={'absolute'}
      bg={'transparent'}
      top={'calc(50% - 20px)'}
      left={'-44px'}
      color={'gray.500'}
      borderRadius={'md'}
      // justifyContent={'flex-start'}
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

export const SliderHome = ({ title, cards, variant }) => {
  const [currentSlide, setCurrentSlide] = useState(0)

  const settings = {
    dots: false,
    infinite: true,
    centerMode: true,

    variableWidth: true,

    speed: 800,
    autoplay: true,
    autoplaySpeed: 5000,
    pauseOnFocus: true,

    afterChange: (index) => {
      setCurrentSlide(index)
    },
    prevArrow: <CustomPrevArrow />,
    nextArrow: <CustomNextArrow />,
    customPaging: i => CustomDot(i, currentSlide, 1),
    // arrows: false
  }
  // appendDots: dots => { console.log({dots}) }

  return (
    <Box>
      <Heading fontSize={{base: 24, sm: 28}} fontWeight={'medium'} fontFamily={'roboto'}>{title}</Heading>
      <Box px={{ base: 0, sm: 2, md: 4 }}>
        <Slider {...settings}>
          {
            cards.map((card, index) => (
              <SliderCard key={index} dataCard={card} variant={variant} />
            ))
          }
        </Slider>
      </Box>
    </Box>
  )
}

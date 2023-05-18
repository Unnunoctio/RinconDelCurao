import { Box, Icon, Heading, IconButton, useColorModeValue} from "@chakra-ui/react";
import Slider from "react-slick"
import { SliderCard } from "../cards/SliderCard";
import { BsChevronLeft, BsChevronRight } from "react-icons/bs";

import './sliderHome.css'

const CustomNextArrow = (props) => {
  const { onClick } = props

  return (
    <IconButton onClick={onClick} display={{ base: 'none', md: 'flex' }}
      icon={<Icon boxSize={9} as={BsChevronRight} />}
      position={'absolute'}
      bg={'transparent'}
      top={'calc(50% - 20px)'}
      right={'-44px'}
      color={useColorModeValue('light.component.main', 'dark.component.main')}
      borderRadius={'md'}
      justifyContent={'flex-end'}
      _hover={{ color: useColorModeValue('light.component.active', 'dark.component.active') }}
    />
  )
}

const CustomPrevArrow = (props) => {
  const { onClick } = props

  return (
    <IconButton onClick={onClick} display={{ base: 'none', md: 'flex' }}
      icon={<Icon boxSize={9} as={BsChevronLeft} />}
      position={'absolute'}
      bg={'transparent'}
      top={'calc(50% - 20px)'}
      left={'-44px'}
      color={useColorModeValue('light.component.main', 'dark.component.main')}
      borderRadius={'md'}
      justifyContent={'flex-start'}
      _hover={{ color: useColorModeValue('light.component.active', 'dark.component.active') }}
    />
  )
}

export const SliderHome = ({ cards, variant }) => {

  const settings = {
    dots: false,
    infinite: true,
    variableWidth: true,

    speed: 500,
    autoplay: true,
    autoplaySpeed: 5000,
    pauseOnFocus: true,

    prevArrow: <CustomPrevArrow />,
    nextArrow: <CustomNextArrow />,

    responsive: [
      {
        breakpoint: 767,
        settings: {
          centerMode: true
        }
      }
    ]
  }

  return (
    <Box px={{ base: 0, sm: 2, md: 4 }} w={'100%'}>
      <Slider {...settings}>
        {
          cards.map((card, index) => (
            <SliderCard key={index} dataCard={card} variant={variant} />
          ))
        }
      </Slider>
    </Box>
  )
}

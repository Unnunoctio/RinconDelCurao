import { Box, Button, Icon, IconButton, useColorMode, useColorModeValue } from '@chakra-ui/react'
import React, { memo, useState } from 'react'
import { useProductsStore } from '../../store'
import { useEffect } from 'react'
import Slider from 'react-slick'
import { BsChevronLeft, BsChevronRight } from 'react-icons/bs'

const CustomPrevArrow = (props) => {
  const { onClick, currentSlide } = props

  return (
    <IconButton onClick={onClick} display={currentSlide === 0 ? 'none' : 'flex'}
      icon={<Icon boxSize={7} as={BsChevronLeft} />}
      position={'absolute'}
      top={'calc(50% - 20px)'}
      left={'-44px'}
      color={useColorModeValue('light.text.secondary', 'dark.text.secondary')}
      bg={'transparent'}
      _hover={{
        color: useColorModeValue('light.text.main', 'dark.text.main'),
        background: useColorModeValue('light.background.active', 'dark.background.active')
      }}
    />
  )
}

const CustomNextArrow = (props) => {
  const { onClick, currentSlide, slideCount } = props

  return (
    <IconButton onClick={onClick}
      display={(currentSlide/5 === Math.floor(slideCount/5)) ? 'none' : 'flex'}
      icon={<Icon boxSize={7} as={BsChevronRight} />}
      position={'absolute'}
      top={'calc(50% - 20px)'}
      right={'-44px'}
      color={useColorModeValue('light.text.secondary', 'dark.text.secondary')}
      bg={'transparent'}
      _hover={{
        color: useColorModeValue('light.text.main', 'dark.text.main'),
        background: useColorModeValue('light.background.active', 'dark.background.active')
      }}
    />
  )
}

export const PaginatorCustom = () => {
  const [pages, setPages] = useState([])

  const { totalPages } = useProductsStore((state) => state.page)
  const getProductsByPage = useProductsStore((state) => state.getProductsByPage)

  useEffect(() => {
    setPages(Array.from({ length: totalPages }, (_, i) => i + 1))
  }, [totalPages])

  const settings = {
    dots: false,
    infinity: false,
    speed: 300,
    // variableWidth: true,
    slidesToShow: (totalPages >= 5) ? 5 : totalPages,
    slidesToScroll: 5,

    prevArrow: <CustomPrevArrow />,
    nextArrow: <CustomNextArrow />
  }

  const onHandleClick = (pageNum) => {
    // setValue(name, pageNum)
    // handlePaginator()
    getProductsByPage(pageNum)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <Box
      w={totalPages >= 5 ? `calc(51px * 5)` : `calc(51px * ${totalPages})`}
      display={ totalPages === 1 ? 'none' : '' }
    >
      <Slider {...settings}>
        {
          pages.map(pageNum => (
            <PageButton key={pageNum} pageNum={pageNum} onButtonClick={onHandleClick} />
          ))
        }
      </Slider>
    </Box>
  )
}

const PageButton = memo(({ pageNum, onButtonClick }) => {
  const { colorMode } = useColorMode()
  const { currentPage } = useProductsStore((state) => state.page)

  return (
    <Box mx={1}>
      <Button
        onClick={() => { onButtonClick(pageNum) }}
        variant={'outline'}
        maxW={'43px'}
        fontWeight={'medium'}
        color={currentPage === pageNum ? colorMode === 'light' ? 'light.text.main' : 'dark.text.main' : colorMode === 'light' ? 'light.text.secondary' : 'dark.text.secondary'}
        background={currentPage === pageNum ? colorMode === 'light' ? 'light.background.active' : 'dark.background.active' : 'transparent'}
        borderColor={currentPage === pageNum ? 'transparent' : colorMode === 'light' ? 'light.component.main' : 'dark.component.main' }
        _hover={{
          color: currentPage === pageNum ? colorMode === 'light' ? 'light.text.main' : 'dark.text.main' : colorMode === 'light' ? 'light.text.active' : 'dark.text.active',
          borderColor: currentPage === pageNum ? 'transparent' : colorMode === 'light' ? 'light.component.active' : 'dark.component.active'
        }}
      >
        {pageNum}
      </Button>
    </Box>
  )
})

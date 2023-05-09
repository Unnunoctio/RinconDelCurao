import { Box, Button, Icon, IconButton, useColorMode, useColorModeValue } from '@chakra-ui/react'
import React, { memo, useState } from 'react'
import { useProductsStore } from '../../store'
import { shallow } from 'zustand/shallow'
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
      color={'gray.500'}
      _hover={{
        color: useColorModeValue('gray.800', 'white'),
        background: 'rgba(214,158,46,0.6)'
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
      color={'gray.500'}
      _hover={{
        color: useColorModeValue('gray.800', 'white'),
        background: 'rgba(214,158,46,0.6)'
      }}
    />
  )
}

export const PaginatorCustom = memo(({ name, setValue, handlePaginator }) => {
  const [pages, setPages] = useState([])
  const [page] = useProductsStore((state) => [state.page], shallow)

  useEffect(() => {
    setPages(Array.from({ length: page.totalPages }, (_, i) => i + 1))
  }, [page.totalPages])

  const settings = {
    dots: false,
    infinity: false,
    speed: 300,
    // variableWidth: true,
    slidesToShow: (page.totalPages >= 5) ? 5 : page.totalPages,
    slidesToScroll: 5,

    prevArrow: <CustomPrevArrow />,
    nextArrow: <CustomNextArrow />
  }

  const onHandleClick = (pageNum) => {
    setValue(name, pageNum)
    handlePaginator()
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <Box
      w={page.totalPages >= 5 ? `calc(51px * 5)` : `calc(51px * ${page.totalPages})`}
      display={ page.totalPages === 1 ? 'none' : '' }
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
})

const PageButton = ({ pageNum, onButtonClick }) => {
  const { colorMode } = useColorMode()
  const [page] = useProductsStore((state) => [state.page], shallow)

  return (
    <Box mx={1}>
      <Button
        onClick={() => { onButtonClick(pageNum) }}
        variant={'outline'}
        maxW={'43px'}
        fontWeight={'medium'}
        color={page.currentPage === pageNum ? colorMode === 'light' ? 'gray.800' : 'white' : 'gray.500'}
        background={page.currentPage === pageNum ? 'rgba(214,158,46,0.6)' : ''}
        borderColor={page.currentPage === pageNum ? 'transparent' : 'gray.500'}
        _hover={{
          color: page.currentPage === pageNum ? colorMode === 'light' ? 'gray.800' : 'white' : 'yellow.500',
          borderColor: page.currentPage === pageNum ? 'transparent' : 'yellow.500'
        }}
      >
        {pageNum}
      </Button>
    </Box>
  )
}

import { useEffect, useState } from 'react'
import { Box, Button, Icon, IconButton, useColorModeValue } from '@chakra-ui/react'
import { BsChevronLeft, BsChevronRight } from 'react-icons/bs'
import Slider from 'react-slick'
import { useProductsStore, useURLQuery } from '@hooks'

const CustomPrevArrow = (props) => {
  const { onClick, currentSlide } = props

  return (
    <IconButton
      onClick={onClick} display={currentSlide === 0 ? 'none' : 'flex'}
      icon={<Icon boxSize={7} as={BsChevronLeft} />}
      position='absolute'
      top='calc(50% - 20px)'
      left='-44px'
      color={useColorModeValue('light.text.secondary', 'dark.text.secondary')}
      bg='transparent'
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
    <IconButton
      onClick={onClick}
      display={(currentSlide / 5 === Math.floor(slideCount / 5)) ? 'none' : 'flex'}
      icon={<Icon boxSize={7} as={BsChevronRight} />}
      position='absolute'
      top='calc(50% - 20px)'
      right='-44px'
      color={useColorModeValue('light.text.secondary', 'dark.text.secondary')}
      bg='transparent'
      _hover={{
        color: useColorModeValue('light.text.main', 'dark.text.main'),
        background: useColorModeValue('light.background.active', 'dark.background.active')
      }}
    />
  )
}

export const Paginator = () => {
  const [pages, setPages] = useState([])

  const { totalPages } = useProductsStore()

  useEffect(() => {
    setPages(Array.from({ length: totalPages }, (_, i) => i + 1))
  }, [totalPages])

  const settings = {
    dots: false,
    infinity: false,
    speed: 300,
    slidesToShow: (totalPages >= 5) ? 5 : totalPages,
    slidesToScroll: 5,

    prevArrow: <CustomPrevArrow />,
    nextArrow: <CustomNextArrow />
  }

  return (
    <Box
      w={totalPages >= 5 ? 'calc(51px * 5)' : `calc(51px * ${totalPages})`}
      display={totalPages === 1 ? 'none' : ''}
    >
      <Slider {...settings}>
        {
          pages.map((pageNum, index) => (
            <PageButton key={index} pageNum={pageNum} />
          ))
        }
      </Slider>
    </Box>
  )
}

const PageButton = ({ pageNum }) => {
  const { addQueryParamURL } = useURLQuery()
  const { currentPage, handleCurrentPage } = useProductsStore()

  const onPageClick = () => {
    handleCurrentPage(pageNum)

    console.log('Ejecucion: Productos via Paginator')
    addQueryParamURL('page', pageNum)

    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <Box mx={1}>
      <Button
        onClick={onPageClick}
        variant='outline'
        maxW='43px'
        fontWeight='medium'
        color={currentPage === pageNum ? useColorModeValue('light.text.main', 'dark.text.main') : useColorModeValue('light.text.secondary', 'dark.text.secondary')}
        background={currentPage === pageNum ? useColorModeValue('light.background.active', 'dark.background.active') : useColorModeValue('transparent', 'transparent')}
        borderColor={currentPage === pageNum ? useColorModeValue('transparent', 'transparent') : useColorModeValue('light.component.main', 'dark.component.main')}
        _hover={{
          color: currentPage === pageNum ? useColorModeValue('light.text.main', 'dark.text.main') : useColorModeValue('light.text.active', 'dark.text.active'),
          borderColor: currentPage === pageNum ? useColorModeValue('transparent', 'transparent') : useColorModeValue('light.component.active', 'dark.component.active')
        }}
      >
        {pageNum}
      </Button>
    </Box>
  )
}

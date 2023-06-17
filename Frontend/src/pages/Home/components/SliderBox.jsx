import { Box, Heading, useColorModeValue } from '@chakra-ui/react'
import React from 'react'

export const SliderBox = ({ title, children, ...rest }) => {
  return (
    <Box className='slider-box' w='100%' {...rest}>
      <Heading
        fontSize={{ base: 24, sm: 28 }}
        fontWeight='medium'
        color={useColorModeValue('light.text.main', 'dark.text.main')}
      >
        {title}
      </Heading>
      {children}
    </Box>
  )
}

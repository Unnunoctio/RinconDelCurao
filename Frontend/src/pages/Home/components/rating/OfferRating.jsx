import { Box, Text, useColorModeValue } from '@chakra-ui/react'

export const OfferRating = ({ value, ...rest }) => {
  return (
    <Box
      px={2} py='1px'
      background={useColorModeValue('light.background.active', 'dark.background.active')}
      borderRadius='md'
      {...rest}
    >
      <Text
        fontSize={14} fontWeight='medium'
        color={useColorModeValue('light.text.main', 'dark.text.main')}
      >
        {value}% desc
      </Text>
    </Box>
  )
}

import { Box } from '@chakra-ui/react'

export const LayoutPage = ({ children }) => {
  return (
    <Box py={{ base: 2, md: 4 }} px={{ base: 2, sm: 4, md: 8 }} w='full'>
      {children}
    </Box>
  )
}

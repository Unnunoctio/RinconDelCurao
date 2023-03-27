import { Box, Flex, useColorModeValue } from "@chakra-ui/react"
import { Navbar } from "./components/Navbar"

export const LayoutApp = ({ children }) => {
  return (
    <Box minH={'100vh'} bg={useColorModeValue('gray.100', 'gray.800')}>
      {/* Navbar and Sidebar Mobile */}
      <Navbar />
      
      <Box h={'73px'} w={'full'}></Box>
      <Flex w={'full'} justifyContent={'center'}>
        {/* <Flex w={{ base: '100%', sm: '90%', md: '80%',  }}> */}
        <Flex minW={'80%'} maxW={{ base: '100%', sm: '90%', md: '80%' }} >
          {children}
        </Flex>
      </Flex>

      {/* Footer */}
    </Box>
  )
}

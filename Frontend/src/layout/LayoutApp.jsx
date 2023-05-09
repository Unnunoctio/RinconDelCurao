import { Box, Flex, useColorModeValue } from "@chakra-ui/react"
import { Navbar } from "./components/Navbar"

export const LayoutApp = ({ children }) => {
  return (
    <Box minH={'100vh'} bg={useColorModeValue('gray.100', 'gray.800')}>
      {/* Navbar and Sidebar Mobile */}
      <Navbar />
      
      <Box h={'73px'} w={'full'}></Box>
      <Flex w={'100%'} justifyContent={'center'}>
        {/* <Flex w={{ base: '100%', sm: '90%', md: '80%',  }}> */}
        <Flex flex={1} maxW={`${1850*0.8}px`} >
          {children}
        </Flex>
      </Flex>

      {/* Footer */}
    </Box>
  )
}

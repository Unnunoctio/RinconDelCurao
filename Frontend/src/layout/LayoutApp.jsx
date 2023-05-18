import { Box, Flex, useColorModeValue } from "@chakra-ui/react"
import { Navbar } from "./components/Navbar"

export const LayoutApp = ({ children }) => {
  return (
    <Box minH={'100vh'} bg={useColorModeValue('light.background.secondary', 'dark.background.secondary')}>
      {/* Navbar and Sidebar Mobile */}
      <Navbar />
      
      <Box h={'73px'} w={'full'}></Box>
      <Flex w={'100%'} justifyContent={'center'}>
        {/* <Flex w={{ base: '100%', sm: '90%', md: '80%',  }}> */}
        <Flex flex={1} maxW={`${1850*0.8}px`} w={'full'} >
          {children}
        </Flex>
      </Flex>

      {/* Footer */}
    </Box>
  )
}

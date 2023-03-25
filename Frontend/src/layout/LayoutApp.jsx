import { Box, Text, useColorModeValue } from "@chakra-ui/react"
import { Navbar } from "../components/Navbar"

export const LayoutApp = ({ children }) => {
  return (
    <Box minH={'100vh'} bg={useColorModeValue('gray.100', 'gray.800')}>
      {/* Navbar and Sidebar Mobile */}
      <Navbar />
      
      <Box h={'73px'} w={'full'}></Box>
      {children}

      {/* Footer */}
    </Box>
  )
}

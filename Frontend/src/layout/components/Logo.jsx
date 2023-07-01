import { Box, Center, Icon, Text, useColorModeValue } from '@chakra-ui/react'
import { NavLink } from 'react-router-dom'
import { GiShatteredGlass } from 'react-icons/gi'

export const Logo = ({ ...rest }) => {
  return (
    <Center {...rest}>
      <NavLink to='/'>
        <Center
          color={useColorModeValue('light.text.active', 'dark.text.active')}
          transition='transform 0.2s ease-out'
          _hover={{ transform: 'scale(1.03)' }}
        >
          <Icon boxSize={9} as={GiShatteredGlass} />
          <Box ml={2} fontFamily='Finger Paint'>
            <Text>Rincón</Text>
            <Text>Del Curao</Text>
          </Box>
        </Center>
      </NavLink>
    </Center>
  )
}

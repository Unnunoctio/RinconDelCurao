import { Divider, Flex, Text, VStack, useColorModeValue } from '@chakra-ui/react'
import { Logo } from './Logo'

export const Footer = () => {
  return (
    <Flex
      as='footer'
      w='100%'
      py={8}
      bg={useColorModeValue('light.background.main', 'dark.background.main')}
      borderTop='1px' borderTopColor={useColorModeValue('light.divider.main', 'dark.divider.main')}
      justifyContent='center'
    >
      <Flex
        flex={1} flexDir='column'
        maxW={`${1850 * 0.75}px`}
        px={{ base: 4, md: 8 }}
      >
        <FooterLogo />
        <Divider my={6} borderColor={useColorModeValue('light.divider.main', 'dark.divider.main')} />
        <Text textAlign='center'>
          &copy; {new Date().getFullYear()} Rincón del Curao. Todos los derechos reservados.
        </Text>
      </Flex>
    </Flex>
  )
}

const FooterLogo = () => {
  return (
    <VStack maxW={{ base: 'full', sm: '300' }} gap={1} alignItems={{ base: 'center', sm: 'flex-start' }}>
      <Logo h='60px' />
      <Text
        fontStyle='italic' textAlign={{ base: 'center', sm: 'left' }}
        color={useColorModeValue('light.text.main', 'dark.text.main')}
      >
        Nuestra misión es ayudar a los consumidores a escoger las mejores bebidas para sus presupuestos
      </Text>
    </VStack>
  )
}

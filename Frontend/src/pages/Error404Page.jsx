import { Button, Flex, Heading, Text, VStack, useColorModeValue } from '@chakra-ui/react'
import { LayoutPage } from '@layout/LayoutPage'
import { useNavigate } from 'react-router-dom'

export const Error404Page = () => {
  const navigate = useNavigate()

  const onClick = () => navigate('/')

  return (
    <LayoutPage>
      <Flex justifyContent='center' alignItems='center' height='85vh' px={4}>
        <VStack gap={6} alignItems='flex-start'>
          <Flex flexDir='column' alignItems='flex-start'>
            <Text
              as='h3'
              fontSize='2xl' fontWeight='medium'
              color={useColorModeValue('light.text.active', 'dark.text.active')}
            >
              Error 404
            </Text>
            <Heading as='h2' fontWeight='medium' color={useColorModeValue('light.text.main', 'dark.text.main')}>
              La página que buscas no existe
            </Heading>
            <Text color={useColorModeValue('light.text.main', 'dark.text.main')}>
              Este contenido no existe o fue removido.
            </Text>
          </Flex>
          <Button
            onClick={onClick}
            variant='outline'
            fontWeight='medium'
            borderColor='gray.500'
            _hover={{
              color: useColorModeValue('light.text.active', 'dark.text.active'),
              borderColor: useColorModeValue('light.text.active', 'dark.text.active')
            }}
          >
            Ir al Home
          </Button>
        </VStack>
      </Flex>
    </LayoutPage>
  )
}

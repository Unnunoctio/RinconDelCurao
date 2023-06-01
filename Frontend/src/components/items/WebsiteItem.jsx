import { Flex, HStack, Heading, Icon, Link, Text, useColorModeValue } from '@chakra-ui/react'

export const WebsiteItem = ({ website }) => {
  return (
    <Link href={website.url} isExternal>
      <HStack
        gap={{ base: 2, sm: 5 }}
        minW='264px'
        maxW='sm'
        w='100%'
        py={2} px={{ base: 2, sm: 4 }}
        background={useColorModeValue('light.background.main', 'dark.background.main')}
        justifyContent='center'
        boxShadow='md'
        borderRadius='md'
        border='1px' borderColor={useColorModeValue('light.divider.main', 'dark.divider.main')}
        transition='transform 200ms ease'
        cursor='pointer'
        _hover={{
          transform: 'scale(1.025)',
          borderColor: useColorModeValue('light.divider.active', 'dark.divider.active')
        }}
      >
        <Flex minW={12} justifyContent='center'>
          <Icon boxSize={{ base: 12, sm: 14 }} />
        </Flex>
        <Flex flexDir='column' gap={2}>
          <Heading
            fontSize={20}
            fontWeight='medium'
            color={useColorModeValue('light.text.main', 'dark.text.main')}
          >
            {website.website}
          </Heading>
          <HStack gap={{ base: 0, sm: 4 }}>
            <Flex flexDir='column' alignItems='flex-end'>
              <Text fontSize={{ base: 14, sm: 16 }} color={useColorModeValue('light.text.secondary', 'dark.text.secondary')}>Precio Oferta</Text>
              <Text
                fontSize={18}
                fontWeight='medium'
                color={useColorModeValue('light.text.active', 'dark.text.active')}
              >
                {website.best_price}
              </Text>
            </Flex>
            <Flex flexDir='column' alignItems='flex-end'>
              <Text fontSize={{ base: 14, sm: 16 }} color={useColorModeValue('light.text.secondary', 'dark.text.secondary')}>Precio Normal</Text>
              <Text
                fontSize={18}
                fontWeight='medium'
                color={useColorModeValue('light.text.main', 'dark.text.main')}
              >
                {website.price}
              </Text>
            </Flex>
          </HStack>
        </Flex>
      </HStack>
    </Link>
  )
}

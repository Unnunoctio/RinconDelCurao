import { Flex, HStack, Heading, Icon, Text, useColorModeValue } from '@chakra-ui/react'

export const WebsiteItem = ({ website }) => {
  return (
    <a href={website.url} target='_blank' rel='noopener noreferrer'>
      <HStack
        minW='264px' w='full'
        gap={{ base: 0, sm: 5 }}
        py={2} px={4}
        background={useColorModeValue('light.background.main', 'dark.background.main')}
        justifyContent='center'
        boxShadow='md'
        border='1px' borderRadius='md' borderColor={useColorModeValue('light.divider.main', 'dark.divider.main')}
        cursor='pointer'
        transition='transform .2s ease'
        _hover={{
          transform: 'scale(1.05)',
          borderColor: useColorModeValue('light.divider.active', 'dark.divider.active')
        }}
      >
        <Flex minW={12} justifyContent='center' display={{ base: 'none', sm: 'flex' }}>
          <Icon boxSize={{ base: 12, sm: 14 }} />
        </Flex>
        <Flex flexDir='column' gap={2} w={{ base: 'full', sm: 'auto' }}>
          <Heading
            fontSize={20} fontWeight='medium'
            color={useColorModeValue('light.text.main', 'dark.text.main')}
          >
            {website.name}
          </Heading>
          <HStack gap={4}>
            <PriceItem title='Precio Oferta' value={website.best_price} color={useColorModeValue('light.text.active', 'dark.text.active')} />
            <PriceItem title='Precio Normal' value={website.price} color={useColorModeValue('light.text.main', 'dark.text.main')} />
          </HStack>
        </Flex>
      </HStack>
    </a>
  )
}

const PriceItem = ({ title, value, ...rest }) => {
  return (
    <Flex flexDir='column' alignItems='flex-end'>
      <Text
        fontSize={16}
        color={useColorModeValue('light.text.secondary', 'dark.text.secondary')}
      >
        {title}
      </Text>
      <Text
        fontSize={18} fontWeight='medium'
        {...rest}
      >
        ${value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}
      </Text>
    </Flex>
  )
}

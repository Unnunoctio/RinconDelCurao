import { Flex, HStack, Text, useColorModeValue } from '@chakra-ui/react'

export const FeatureItem = ({ title, icon, children }) => {
  return (
    <HStack py={2} gap={1} minW={240}>
      <Flex minW={12} justifyContent='center' color={useColorModeValue('light.text.active', 'dark.text.active')}>
        {icon}
      </Flex>
      <Flex flexDir='column'>
        <Text color={useColorModeValue('light.text.active', 'dark.text.active')}>{title}</Text>
        <Text
          fontSize={18}
          fontWeight='medium'
          color={useColorModeValue('light.text.main', 'dark.text.main')}
        >
          {children}
        </Text>
      </Flex>
    </HStack>
  )
}

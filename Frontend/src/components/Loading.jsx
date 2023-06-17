import { Flex, Spinner, useColorModeValue } from '@chakra-ui/react'

export const Loading = ({ ...rest }) => {
  return (
    <Flex w='100%' justifyContent='center' alignItems='center' {...rest}>
      <Spinner
        size='xl' speed='0.65s'
        color={useColorModeValue('light.component.active', 'dark.component.active')}
      />
    </Flex>
  )
}

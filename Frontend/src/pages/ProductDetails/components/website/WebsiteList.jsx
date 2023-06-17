import { Box, Heading, VStack, useColorModeValue } from '@chakra-ui/react'
import { WebsiteItem } from './WebsiteItem'

export const WebsiteList = ({ websites }) => {
  return (
    <Box py={2} w='full'>
      <Heading
        fontSize={{ base: 22, sm: 24 }} fontWeight='medium' textAlign='center'
        color={useColorModeValue('light.text.main', 'dark.text.main')}
      >
        Tiendas
      </Heading>
      <VStack py={2}>
        {
          websites.map((website, index) => (
            <WebsiteItem key={index} website={website} />
          ))
        }
      </VStack>
    </Box>
  )
}

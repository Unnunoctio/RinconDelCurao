import { Box, Button, Divider, Flex, Text, VStack, useColorModeValue } from '@chakra-ui/react'
import React from 'react'
import { useProductsStore } from '../../store'
import { shallow } from 'zustand/shallow'

export const FilterProducts = ({ handleSubmit, setValue, reset, children }) => {
  const [totalProducts] = useProductsStore((state) => [state.totalProducts], shallow)
  const [getProductsByFilters, resetStoreFilters] = useProductsStore((state) => [state.getProductsByFilters, state.resetStoreFilters], shallow)

  const onSubmit = (data) => {
    setValue('page', 1)
    getProductsByFilters(data)
  }

  return (
    <Box w='300px' minW='300px' display={{ base: 'none', xl: 'block' }}>
      <Flex justifyContent='space-between' alignItems='baseline' pb={1}>
        <Text
          color={useColorModeValue('light.text.active', 'dark.text.active')}
        >
          {totalProducts} resultados
        </Text>

        <Button
          variant='ghost'
          size='sm'
          fontWeight='medium'
          color={useColorModeValue('light.text.active', 'dark.text.active')}
          isDisabled
          _disabled={{ color: 'gray.500', cursor: 'auto' }}
        >
          Borrar Filtros
        </Button>
      </Flex>
      <Divider borderColor={useColorModeValue('light.divider.main', 'dark.divider.main')} />
      <form onSubmit={handleSubmit(onSubmit)}>
        <VStack alignItems='stretch' gap={2} my={2}>
          {children}
          <Flex justifyContent='flex-end'>
            <Button
              type='onSubmit' variant='outline'
              fontWeight='medium'
              w='50%'
              borderColor='gray.500'
              _hover={{
                color: useColorModeValue('light.text.active', 'dark.text.active'),
                borderColor: useColorModeValue('light.text.active', 'dark.text.active')
              }}
            >
              Aplicar Filtros
            </Button>
          </Flex>
        </VStack>
      </form>
    </Box>
  )
}

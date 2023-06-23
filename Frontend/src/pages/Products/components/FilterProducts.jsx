import { Box, Button, Divider, Flex, Text, VStack, useColorModeValue } from '@chakra-ui/react'
import { useProductsStore } from '@hooks'
import { MultiSelect, Slider } from './inputs'
import { useFilter } from './hooks/useFilter'

export const FilterProducts = () => {
  const { totalProducts, filterLimits } = useProductsStore()
  const { onSubmitFilter, handleSubmit, control } = useFilter()

  return (
    <Box w='300px' minW='300px' display={{ base: 'none', xl: 'block' }}>
      <Flex justifyContent='space-between' alignItems='baseline' pb={1}>
        <Text color={useColorModeValue('light.text.active', 'dark.text.active')}>
          {totalProducts} {totalProducts !== 1 ? 'resultados' : 'resultado'}
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
      <Divider borderColor={useColorModeValue('light.component.main', 'dark.component.main')} />
      <form onSubmit={handleSubmit(onSubmitFilter)}>
        <VStack alignItems='stretch' gap={2} my={2}>
          <Slider control={control} label='Precio' name='rangePrice' minValue={filterLimits.range_price?.[0]} maxValue={filterLimits.range_price?.[1]} startSymbol='$' format={(value) => { return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') }} />
          <MultiSelect control={control} label='Categoria' name='subCategory' options={filterLimits.sub_category} />
          <MultiSelect control={control} label='Marca' name='brand' options={filterLimits.brand} />
          <Slider control={control} label='Graduación' name='rangeGrade' step={0.1} minValue={filterLimits.range_grade?.[0]} maxValue={filterLimits.range_grade?.[1]} endSymbol='°' />
          <MultiSelect control={control} label='Contenido' name='content' options={filterLimits.content} />
          <MultiSelect control={control} label='Cantidad' name='quantity' options={filterLimits.quantity} />
          <MultiSelect control={control} label='Envase' name='package' options={filterLimits.package} />

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

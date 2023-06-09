import { Box, Button, Divider, Flex, Text, VStack, useColorModeValue } from '@chakra-ui/react'
import { useProductsStore, useURLQuery } from '../../hooks'

export const FilterProducts = ({ handleSubmit, setValue, reset, children }) => {
  const { updateQueryMultiParamsURL } = useURLQuery()
  const { totalProducts, handleFilters, handleCurrentPage } = useProductsStore()

  // const [clicked, setClicked] = useState(false)

  const onSubmit = async (data) => {
    handleFilters(data)
    handleCurrentPage(1)

    console.log('Ejecucion: Productos via Filter')
    const deleteParams = []
    const addParams = [
      { label: 'page', value: 1 }
    ]

    if (data.subCategory.length > 0) {
      addParams.push({ label: 'category', value: data.subCategory.map(obj => obj.value).join(',') })
    } else {
      deleteParams.push('category')
    }
    // console.log(data.subCategory.map(obj => obj.value).join(','))
    // console.log(params)
    updateQueryMultiParamsURL(addParams, deleteParams)
  }

  // useEffect(() => {
  //   if (clicked) {
  //     handleStorePage(1)
  //     getStoreProducts()
  //     console.log('Ejecucion: Productos via Filter')

  //     const params = [
  //       { label: 'page', value: 1 }
  //     ]
  //     if (filtersActive.subCategory) { params.push({ label: 'category', value: filtersActive.subCategory.join(',') }) }

  //     addQueryMultiParamsURL(params)
  //     setClicked(false)
  //   }
  // }, [filtersActive])

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

import { useEffect } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { Box, Button, Divider, Flex, Text, VStack, useColorModeValue } from '@chakra-ui/react'
import { useProductsStore, useURLQuery } from '@hooks'
import { linkItems, orderByItems } from '@assets'
import { MultiSelect } from './inputs'
import { sameStrings } from '../helpers'

export const FilterProducts = () => {
  const { queryPaths, queryParams, updateQueryMultiParamsURL } = useURLQuery()
  const {
    totalProducts, filterActives, filterLimits, currentPage, orderBy,
    handleFilters, handleCurrentPage, handleOrderBy, resetProducts
  } = useProductsStore()

  const { handleSubmit, setValue, getValues, reset, control } = useForm({
    defaultValues: {
      category: '',
      rangePrice: [0, 0],
      subCategory: [],
      brand: [],
      rangeGrade: [0.0, 0.0],
      content: [],
      pack_unit: [],
      quantity: [],
      package: []
    }
  })
  const categoryForm = useWatch({ control, name: 'category' })

  // TODO: Ejecución via Pathname (se ejecuta la primera vez que se renderiza el componente)
  useEffect(() => {
    reset()
    const category = linkItems.find(item => item.url === `/${queryPaths[1]}`)
    if (category) {
      setValue('category', category?.name)
      resetProducts()
      handleFilters(getValues())
      console.log('Ejecucion: Productos via Pathname')
    }
  }, [queryPaths])

  // TODO: Ejecución via QueryParams (Se ejecuta si existen variables en la url)
  useEffect(() => {
    // if (queryParams && Object.entries(filterLimits).length > 0) {
    if (queryParams) {
      let changesURl = false

      const pageParam = parseInt(queryParams.page)
      if (!!pageParam && pageParam !== currentPage) changesURl = true

      const orderByParam = queryParams.orderBy
      if (!!orderByParam && orderByParam !== orderBy) changesURl = true

      const subCategoryByParam = queryParams.category
      if (!!subCategoryByParam && !sameStrings(filterActives.subCategory, subCategoryByParam.split(','))) {
        setValue('subCategory', filterLimits.subCategory?.filter((x) => { return subCategoryByParam.split(',').includes(x.value) }))
        changesURl = true
      }

      if (changesURl) {
        handleFilters(getValues())
        if (!!pageParam && pageParam !== currentPage) handleCurrentPage(pageParam)
        if (!!orderByParam && orderByParam !== orderBy) handleOrderBy(orderByItems.find(item => item.value === orderByParam))
        console.log('Ejecucion: Productos via QueryParams')
      }
    }
  }, [queryParams, filterLimits])

  // TODO: Ejecución via sin QueryParams (se ejecuta si no existen variables en la url)
  useEffect(() => {
    const category = linkItems.find(item => item.url === `/${queryPaths[1]}`)
    if (queryParams === null && categoryForm !== '' && category.name === categoryForm) {
      const category = categoryForm
      reset()
      setValue('category', category)
      resetProducts()
      handleFilters(getValues())
      console.log('Ejecucion: Productos via sin QueryParams')
    }
  }, [queryParams])

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

    updateQueryMultiParamsURL(addParams, deleteParams)
  }

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
      <form onSubmit={handleSubmit(onSubmit)}>
        <VStack alignItems='stretch' gap={2} my={2}>
          {/* <Slider control={control} label='Precio' name='rangePrice' minValue={0} maxValue={30000} startSymbol='$' format={(value) => { return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') }} /> */}
          <MultiSelect control={control} label='Categoria' name='subCategory' options={filterLimits.subCategory} />
          {/* <MultiSelectCustom control={control} label='Marca' name='brand' options={marcaData} />
          <SliderCustom control={control} label='Graduación' name='rangeGrade' step={0.1} minValue={0.0} maxValue={10.0} endSymbol='°' />
          <MultiSelectCustom control={control} label='Contenido' name='content' options={contenidoData} />
          <MultiSelectCustom control={control} label='Pack-Unitario' name='pack_unit' options={packUnitarioData} />
          <MultiSelectCustom control={control} label='Cantidad' name='quantity' options={cantidadData} />
          <MultiSelectCustom control={control} label='Envase' name='package' options={envaseData} /> */}

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

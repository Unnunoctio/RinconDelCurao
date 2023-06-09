import { useEffect, useState } from 'react'

import { linkItems } from '../assets/linkItems'
import { Box, Flex, HStack, Heading, SimpleGrid, Spinner, Text, useColorModeValue } from '@chakra-ui/react'
import { BreadcrumbPage } from '../components/breadcrumbs/BreadcrumbPage'
import { MultiSelectCustom, SliderCustom, OrderBySelect } from '../components/inputs'

import { useForm, useWatch } from 'react-hook-form'
import { orderByItems } from '../assets'
import { PaginatorCustom } from '../components/paginator'
import { ProductCard } from '../components/cards'
import { FilterProducts } from '../components/filter/FilterProducts'
import { useDimensions, useProductStore, useProductsStore, useURLQuery } from '../hooks'
import { sameStrings } from '../helpers'

// const packUnitarioData = [
//   { value: 'pack', label: 'Pack (150)' },
//   { value: 'unit', label: 'Unitario (25)' }
// ]

// const marcaData = [
//   { value: 'Kunstmann', label: 'Kunstmann (50)' },
//   { value: 'Cristal', label: 'Cristal (26)' },
//   { value: 'Corona', label: 'Corona (35)' },
//   { value: 'Stella Artois', label: 'Stella Artois (5)' }
// ]

// const envaseData = [
//   { value: 'Botella', label: 'Botella (120)' },
//   { value: 'Lata', label: 'Lata (35)' },
//   { value: 'Barril', label: 'Barril (2)' },
//   { value: 'Caja', label: 'Caja (1)' }
// ]

// const cantidadData = [
//   { value: 1, label: '1 Unidad (203)' },
//   { value: 4, label: '4 Unidades (52)' },
//   { value: 6, label: '6 Unidades (12)' },
//   { value: 12, label: '12 Unidades (4)' },
//   { value: 18, label: '18 Unidades (5)' }
// ]

// const categoriaData = [
//   { value: 'Cervezas Tradicionales', label: 'Cervezas Tradicionales (150)' },
//   { value: 'Cervezas Artesanales', label: 'Cervezas Artesanales (25)' },
//   { value: 'Cervezas Sin Alcohol', label: 'Cervezas Sin Alcohol (4)' }
// ]

// const contenidoData = [
//   { value: 330, label: '330 ml (120)' },
//   { value: 470, label: '470 ml (25)' },
//   { value: 500, label: '500 ml (10)' },
//   { value: 1000, label: '1 L (2)' }
// ]

export const ProductsPage = () => {
  const { queryPaths, queryParams } = useURLQuery()

  const [breadCrumbLinks, setBreadCrumbLinks] = useState([])
  const [title, setTitle] = useState('')

  const {
    isLoading, products, totalProducts, filterActives, filterLimits, currentPage, orderBy,
    getProducts, handleFilters, handleCurrentPage, handleOrderBy, resetProducts
  } = useProductsStore()

  const { resetProduct: resetProductStore } = useProductStore()

  useEffect(() => {
    resetProductStore()
  }, [])

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

  // TODO: Obtener el Title, Breadcrumb y setear la categoria
  useEffect(() => {
    reset()
    const category = linkItems.find(item => item.url === `/${queryPaths[1]}`)
    if (category) {
      setBreadCrumbLinks([
        { name: 'Home', url: '/' },
        { name: category?.name, url: category?.url }
      ])

      setTitle(category?.name)
      document.title = `${category?.name} | Rincón del Curao`

      setValue('category', category?.name)

      resetProducts()
      console.log(getValues())
      handleFilters(getValues())
      console.log('Ejecucion: Productos via Pathname')
    }
  }, [queryPaths])

  useEffect(() => {
    if (Object.entries(filterActives).length > 0) {
      console.log('me ejecute')
      getProducts()
    }
  }, [filterActives, currentPage, orderBy])

  // TODO: Obtener los parametros del filtro activo mediante la query en la url del front
  useEffect(() => {
    // if (queryParams && Object.entries(filterLimits).length > 0) {
    if (queryParams) {
      // console.log(queryParams)
      // console.log(filtersLimits)
      let changesURl = false

      const pageParam = parseInt(queryParams.page)
      if (!!pageParam && pageParam !== currentPage) {
        changesURl = true
      }
      const orderByParam = queryParams.orderBy
      if (!!orderByParam && orderByParam !== orderBy) {
        changesURl = true
      }
      const subCategoryByParam = queryParams.category
      if (!!subCategoryByParam && !sameStrings(filterActives.subCategory, subCategoryByParam.split(','))) {
        setValue('subCategory', filterLimits.subCategory?.filter((x) => { return subCategoryByParam.split(',').includes(x.value) }))
        changesURl = true
      }

      if (changesURl) {
        handleFilters(getValues())
        if (!!pageParam && pageParam !== currentPage) {
          handleCurrentPage(pageParam)
        }
        if (!!orderByParam && orderByParam !== orderBy) {
          handleOrderBy(orderByItems.find(item => item.value === orderByParam))
        }
        console.log('Ejecucion: Productos via QueryParams')
      }
    }
  }, [queryParams, filterLimits])

  useEffect(() => {
    const category = linkItems.find(item => item.url === `/${queryPaths[1]}`)
    if (queryParams === null && categoryForm !== '' && category.name === categoryForm) {
      const category = categoryForm
      reset()
      setValue('category', category)

      resetProducts()
      handleFilters(getValues())
      console.log('Ejecucion: Productos via Sin QueryParams')
    }
  }, [queryParams])

  const { ref: productsRef, dimensions: productsDimensions } = useDimensions()

  return (
    <Box py={{ base: 2, md: 4 }} px={{ base: 2, sm: 4, md: 8 }} w='full'>
      <BreadcrumbPage links={breadCrumbLinks} />
      {/* Title and OrderBy */}
      <Flex py={4} justifyContent='space-between' alignItems={{ base: 'flex-start', md: 'center' }} flexDir={{ base: 'column', md: 'row' }}>
        <Flex gap={2} alignItems='baseline'>
          <Heading
            fontSize={{ base: 28, sm: 28 }}
            fontWeight='medium'
            color={useColorModeValue('light.text.main', 'dark.text.main')}
          >
            {title}
          </Heading>
          <Text color={useColorModeValue('light.text.active', 'dark.text.active')} display={{ base: 'block', xl: 'none' }}>{totalProducts} resultados</Text>
        </Flex>

        <OrderBySelect />
      </Flex>
      {/* Content Page */}
      <HStack align='flex-start' gap={6}>
        {/* Filtro */}
        <FilterProducts handleSubmit={handleSubmit} setValue={setValue} reset={reset}>
          {/* <SliderCustom control={control} label='Precio' name='rangePrice' minValue={0} maxValue={30000} startSymbol='$' format={(value) => { return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') }} /> */}
          <MultiSelectCustom control={control} label='Categoria' name='subCategory' options={filterLimits.subCategory} />
          {/* <MultiSelectCustom control={control} label='Marca' name='brand' options={marcaData} />
          <SliderCustom control={control} label='Graduación' name='rangeGrade' step={0.1} minValue={0.0} maxValue={10.0} endSymbol='°' />
          <MultiSelectCustom control={control} label='Contenido' name='content' options={contenidoData} />
          <MultiSelectCustom control={control} label='Pack-Unitario' name='pack_unit' options={packUnitarioData} />
          <MultiSelectCustom control={control} label='Cantidad' name='quantity' options={cantidadData} />
          <MultiSelectCustom control={control} label='Envase' name='package' options={envaseData} /> */}
        </FilterProducts>
        {/* Lista de productos y Paginador */}
        <Box flex={1} m={0} ml='0px !important' className='product-list' ref={productsRef} maxW='100%'>
          {
            isLoading
              ? (
                <Flex w='full' h='70vh' justifyContent='center' alignItems='center'>
                  <Spinner color='yellow.500' size='xl' speed='0.65s' />
                </Flex>
                )
              : (
                <Box minH='70vh'>
                  <SimpleGrid width='full' minChildWidth='260px' spacing={4} justifyItems='center'>
                    {products.map((product, index) => (
                      <ProductCard key={index} dataCard={product} />
                    ))}
                    {products.length <= 3 && Math.floor((productsDimensions.width - (16 * 3)) / 260) >= 4 && (
                      <ProductCard dataCard={null} visibility='hidden' />
                    )}
                    {products.length <= 2 && Math.floor((productsDimensions.width - (16 * 2)) / 260) >= 3 && (
                      <ProductCard dataCard={null} visibility='hidden' />
                    )}
                    {products.length <= 1 && Math.floor((productsDimensions.width - (16 * 1)) / 260) >= 2 && (
                      <ProductCard dataCard={null} visibility='hidden' />
                    )}
                  </SimpleGrid>
                </Box>
                )
          }
          <Flex w='full' pt={6} justifyContent='center'>
            <PaginatorCustom />
          </Flex>
        </Box>
      </HStack>
    </Box>
  )
}

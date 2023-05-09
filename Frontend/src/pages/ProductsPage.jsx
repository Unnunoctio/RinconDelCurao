import { useEffect, useRef, useState } from "react"
import { useLocation, useParams } from "react-router-dom"
import { shallow } from 'zustand/shallow'

import { linkItems } from "../assets/linkItems"
import { Box, Button, Divider, Flex, HStack, Heading, SimpleGrid, Text, VStack, useColorModeValue } from "@chakra-ui/react"
import { BreadcrumbPage } from "../components/breadcrumbs/BreadcrumbPage"
import { MultiSelectCustom, SliderCustom, OrderBySelect } from "../components/inputs"

import { useForm } from 'react-hook-form'
import { useProductsStore } from "../store/productsStore"
import { orderByData } from "../assets"
import { PaginatorCustom } from "../components/paginator"
import { ProductCard } from "../components/cards"


const packUnitarioData = [
  { value: 'pack', label: 'Pack (150)' },
  { value: 'unit', label: 'Unitario (25)' },
]

const marcaData = [
  { value: 'Kunstmann', label: 'Kunstmann (50)' },
  { value: 'Cristal', label: 'Cristal (26)' },
  { value: 'Corona', label: 'Corona (35)' },
  { value: 'Stella Artois', label: 'Stella Artois (5)' },
]

const envaseData = [
  { value: 'Botella', label: 'Botella (120)' },
  { value: 'Lata', label: 'Lata (35)' },
  { value: 'Barril', label: 'Barril (2)' },
  { value: 'Caja', label: 'Caja (1)' },
]

const cantidadData = [
  { value: 1, label: '1 Unidad (203)' },
  { value: 4, label: '4 Unidades (52)' },
  { value: 6, label: '6 Unidades (12)' },
  { value: 12, label: '12 Unidades (4)' },
  { value: 18, label: '18 Unidades (5)' },
]

const categoriaData = [
  { value: 'Cervezas Tradicionales', label: 'Cervezas Tradicionales (150)' },
  { value: 'Cervezas Artesanales', label: 'Cervezas Artesanales (25)' },
  { value: 'Cervezas Sin Alcohol', label: 'Cervezas Sin Alcohol (4)' },
]

const contenidoData = [
  { value: 330, label: '330 ml (120)' },
  { value: 470, label: '470 ml (25)' },
  { value: 500, label: '500 ml (10)' },
  { value: 1000, label: '1 L (2)' },
]

export const ProductsPage = () => {
  const { pathname, search } = useLocation()

  const [breadCrumbLinks, setBreadCrumbLinks] = useState([])
  const [title, setTitle] = useState('')

  const [
    isLoading, products, totalProducts, filtersActive
  ] = useProductsStore((state) => [state.isLoading, state.products, state.totalProducts, state.filtersActive], shallow)
  const [
    getProductsByFilters, resetStoreFilters
  ] = useProductsStore((state) => [state.getProductsByFilters, state.resetStoreFilters], shallow)

  const { handleSubmit, setValue, getValues, reset, control } = useForm({
    defaultValues: {
      orderBy: orderByData[0],
      page: 1,
      category: '',
      rangePrice: [0, 30000],
      subCategory: [],
      brand: [],
      rangeGrade: [0.0, 10.0],
      content: [],
      pack_unit: [],
      quantity: [],
      package: []
    }
  })

  //TODO: Obtener el Title, Breadcrumb y setear la categoria
  useEffect(() => {
    const pathSplit = pathname.split('/')
    const pathCategory = pathSplit[1]

    const category = linkItems.find(item => item.url === `/${pathCategory}`)

    if (!!category) {
      setBreadCrumbLinks([
        { name: 'Home', url: '/' },
        { name: category.name, url: category.url }
      ])
      setTitle(category.name)

      reset()
      setValue('category', category.name)

      resetStoreFilters()
      getProductsByFilters(getValues())
    }
  }, [pathname])

  //TODO: Obtener los parametros del filtro activo mediante la query en la url del front
  useEffect(() => {
    const searchParams = new URLSearchParams(search)
    const subCategory = searchParams.get('category')
    if (!!subCategory) {
      const categorySplit = subCategory.split(',')
      const categoriesActive = categoriaData.filter(obj => categorySplit.includes(obj.value))
      setValue('subCategory', categoriesActive)
    }
  }, [search, pathname])

  const onSubmit = (data) => {
    getProductsByFilters(data)
  }

  const productsRef = useRef()
  const [boxWidth, setBoxWidth] = useState(null)

  useEffect(() => {
    function handleResize() {
      if (productsRef.current) {
        setBoxWidth(productsRef.current.offsetWidth)
      }
    }

    handleResize()

    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [productsRef, products.length])


  // const onResetForm = () => {
  //   reset()
  //   console.log(getValues())
  // }

  return (
    <Box py={{ base: 2, md: 4 }} px={{ base: 2, sm: 4, md: 8 }} w={'full'}>
      <BreadcrumbPage links={breadCrumbLinks} />
      {/* Title and OrderBy */}
      <Flex py={4} justifyContent={'space-between'} flexDir={{ base: 'column', md: 'row' }}>
        <Flex gap={2} alignItems={'baseline'}>
          <Heading fontSize={{ base: 28, sm: 28 }} fontWeight={'medium'} >{title}</Heading>
          <Text color={'yellow.500'} display={{ base: 'block', xl: 'none' }} >{totalProducts} resultados</Text>
        </Flex>

        {/* <MenuCustom label={'Ordernar por'} options={dataSelect} defaultValue={dataSelect[0]} onSelect={genericFunction} isReset={resetSelect} /> */}
        <OrderBySelect control={control} label={'Ordenar por'} name={'orderBy'} options={orderByData} 
          handleSelect={() => {
            setValue('page', 1)
            getProductsByFilters(getValues())
          }} 
        />
      </Flex>
      {/* Content Page */}
      <HStack align={'flex-start'} gap={6}>
        {/* Filtro */}
        <Box w={'300px'} minW={'300px'} display={{ base: 'none', xl: 'block' }}>
          <Flex justifyContent={'space-between'} alignItems={'baseline'} pb={1}>
            <Text color={'yellow.500'}>{totalProducts} resultados</Text>

            <Button variant={'ghost'} size={'sm'} fontWeight={'medium'} color={'yellow.500'}
              //! Error al Resetear, verificar al final del proyecto
              // isDisabled={ Object.keys(filtersActive).length <= 1 }
              isDisabled={true}
              _disabled={{ color: 'gray.500', cursor: 'auto' }}
            >
              Borrar Filtros
            </Button>
          </Flex>
          <Divider borderColor={useColorModeValue('gray.400', 'gray.600')} />
          <form onSubmit={handleSubmit(onSubmit)}>
            <VStack alignItems={'stretch'} gap={2} my={2}>
              <SliderCustom control={control} label={'Precio'} name={'rangePrice'} minValue={0} maxValue={30000} startSymbol={'$'} format={(value) => { return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") }} />
              <MultiSelectCustom control={control} label={'Categoria'} name={'subCategory'} options={categoriaData} />
              <MultiSelectCustom control={control} label={'Marca'} name={'brand'} options={marcaData} />
              <SliderCustom control={control} label={'Graduación'} name={'rangeGrade'} step={0.1} minValue={0.0} maxValue={10.0} endSymbol={'°'} />
              <MultiSelectCustom control={control} label={'Contenido'} name={'content'} options={contenidoData} />
              <MultiSelectCustom control={control} label={'Pack-Unitario'} name={'pack_unit'} options={packUnitarioData} />
              <MultiSelectCustom control={control} label={'Cantidad'} name={'quantity'} options={cantidadData} />
              <MultiSelectCustom control={control} label={'Envase'} name={'package'} options={envaseData} />

              <Flex justifyContent={'flex-end'}>
                <Button type="onSubmit"
                  variant={'outline'}
                  fontWeight={'medium'}
                  w={'50%'}
                  borderColor={'gray.500'}
                  _hover={{
                    color: 'yellow.500',
                    borderColor: 'yellow.500'
                  }}
                >
                  Aplicar Filtros
                </Button>
              </Flex>
            </VStack>
          </form>
        </Box>
        {/* Lista de productos y Paginador */}
        <Box flex={1} m={0} ml={'0px !important'} className="product-list" ref={productsRef} maxW={'100%'}>
          <SimpleGrid width={'full'} minChildWidth={'260px'} spacing={4} justifyItems={'center'}>
            {
              isLoading
                ? 'Cargando'
                : (
                  <>
                    {products.map((product, index) => (
                      <ProductCard key={index} dataCard={product} />
                    ))}
                    {products.length <= 3 && Math.floor((boxWidth - 16 * 3) / 260) >= 4 && (
                      <ProductCard dataCard={null} visibility={'hidden'} />
                    )}
                    {products.length <= 2 && Math.floor((boxWidth - 16 * 2) / 260) >= 3 && (
                      <ProductCard dataCard={null} visibility={'hidden'} />
                    )}
                    {products.length <= 1 && Math.floor((boxWidth - 16 * 1) / 260) >= 2 && (
                      <ProductCard dataCard={null} visibility={'hidden'} />
                    )}
                  </>
                )
            }
          </SimpleGrid>
          <Flex w={'full'} pt={6} justifyContent={'center'}>
            <PaginatorCustom name={'page'} setValue={setValue} handlePaginator={() => { getProductsByFilters(getValues()) }} />
          </Flex>
        </Box>
      </HStack>
    </Box>
  )
}

import { useEffect, useRef, useState } from "react"
import { useLocation, useParams } from "react-router-dom"
import { shallow } from 'zustand/shallow'

import { linkItems } from "../assets/linkItems"
import { Box, Button, Divider, Flex, HStack, Heading, Text, VStack, useColorModeValue } from "@chakra-ui/react"
import { BreadcrumbPage } from "../components/breadcrumbs/BreadcrumbPage"
import { MultiSelectCustom, SliderCustom, OrderBySelect } from "../components/inputs"

import { useForm } from 'react-hook-form'
import { useProductsStore } from "../store/productsStore"

const orderByData = [
  { value: 'scoreDesc', label: 'Recomendados' },
  { value: 'priceDesc', label: 'Mayor Precio' },
  { value: 'priceAsc', label: 'Menor Precio' },
  { value: 'nameAsc', label: 'A - Z' },
  { value: 'nameDesc', label: 'Z - A' },
]

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

   const [ isLoading, filtersActive ] = useProductsStore((state) => [ state.isLoading, state.filtersActive ], shallow)
   const [ applyFilters ] = useProductsStore((state) => [ state.applyFilters ], shallow)

   const { handleSubmit, setValue, control } = useForm({
     defaultValues: {
       orderBy: orderByData[0],
       rangePrice: [1990, 13590],
       rangeGrade: [0.0, 7.5]
     }
   })

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
      setValue('category', category.name)
    }
  }, [pathname])

  useEffect(() => {
    const searchParams = new URLSearchParams(search)
    const subCategory = searchParams.get('category')
    if(!!subCategory){
      const categorySplit = subCategory.split(',')
      const categoriesActive = categoriaData.filter(obj => categorySplit.includes(obj.value))
      setValue('subCategory', categoriesActive)
    }
  }, [search, pathname])

  const buttonSubmit = useRef()
  const handleOrderBy = () => {
    buttonSubmit.current.click()
  }

  const onSubmit = (data) => {
    applyFilters(data)
    // console.log({ data })
  }

  return (
    <Box p={{ base: 2, md: 4 }} w={'full'} minH={'190vh'}>
      <BreadcrumbPage links={breadCrumbLinks} />
      {/* Title and OrderBy */}
      <Flex py={4} justifyContent={'space-between'}>
        <Flex gap={2} alignItems={'baseline'}>
          <Heading fontSize={{ base: 24, sm: 28 }} fontWeight={'medium'} >{title}</Heading>
          {/* <Text color={'yellow.500'} >54 resultados</Text> */}
        </Flex>

        {/* <MenuCustom label={'Ordernar por'} options={dataSelect} defaultValue={dataSelect[0]} onSelect={genericFunction} isReset={resetSelect} /> */}
        <OrderBySelect control={control} label={'Ordenar por'} name={'orderBy'} options={orderByData} handleSelect={handleOrderBy} />
      </Flex>
      {/* Content Page */}
      <HStack align={'flex-start'} gap={4}>
        {/* Filter */}
        <Box w={'300px'}>
          <Flex justifyContent={'space-between'} alignItems={'baseline'} pb={1}>
            <Text color={'yellow.500'}>54 resultados</Text>
            <Button variant={'ghost'} size={'sm'} fontWeight={'medium'} color={'yellow.500'} 
              // isDisabled={ Object.keys(filtersActive).length <= 1 }
              isDisabled={ true }
              _disabled={{ color: 'gray.500', cursor: 'auto' }}
            >
              Borrar Filtros
            </Button>
          </Flex>
          <Divider borderColor={useColorModeValue('gray.400', 'gray.600')} />
          <form onSubmit={handleSubmit(onSubmit)}>
            <VStack alignItems={'stretch'} gap={2} my={2}>
              <SliderCustom control={control} label={'Precio'} name={'rangePrice'} minValue={1990} maxValue={13590} startSymbol={'$'} format={(value) => { return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") }} />
              <MultiSelectCustom control={control} label={'Categoria'} name={'subCategory'} options={categoriaData} />
              <MultiSelectCustom control={control} label={'Marca'} name={'brand'} options={marcaData} />
              <SliderCustom control={control} label={'Graduación'} name={'rangeGrade'} step={0.1} minValue={0.0} maxValue={7.5} endSymbol={'°'} />
              <MultiSelectCustom control={control} label={'Contenido'} name={'content'} options={contenidoData} />
              <MultiSelectCustom control={control} label={'Pack-Unitario'} name={'pack_unit'} options={packUnitarioData} />
              <MultiSelectCustom control={control} label={'Cantidad'} name={'quantity'} options={cantidadData} />
              <MultiSelectCustom control={control} label={'Envase'} name={'package'} options={envaseData} />

              <Flex justifyContent={'flex-end'}>
                <Button type="onSubmit"
                  ref={buttonSubmit}
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
        <Box flex={1} bg={'white'} h={'auto'} color={'black'} m={0}>
          {
            isLoading ? "Cargando" : "a"
          }
        </Box>
      </HStack>
    </Box>
  )
}

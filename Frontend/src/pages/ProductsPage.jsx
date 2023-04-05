import { useEffect, useState } from "react"
import { useLocation } from "react-router-dom"
import { Error404Page } from "./Error404Page"

import { linkItems } from "../assets/linkItems"
import { Box, Flex, Heading, Text } from "@chakra-ui/react"
import { BreadcrumbPage } from "../components/breadcrumbs/BreadcrumbPage"
import { SelectCustom } from "../components/inputs/SelectCustom"

const dataSelect = [
  { value: '1', name: 'Recomendados' },
  { value: '2', name: 'Mejor descuento' },
  { value: '3', name: 'Mayor Precio' },
  { value: '4', name: 'Menor Precio' },
  { value: '5', name: 'A - Z' },
  { value: '6', name: 'Z - A' },
]

export const ProductsPage = () => {
  const { pathname } = useLocation()
  const [error404, setError404] = useState(false)

  const [breadCrumbLinks, setBreadCrumbLinks] = useState([])
  const [resetSelect, setResetSelect] = useState(false)
  const [title, setTitle] = useState('')

  // Mandar a un hook
  useEffect(() => {
    const pathSplit = pathname.split('/')
    const pathCategory = pathSplit[1]
    const pathSubCategory = pathSplit[2]

    let isPathAllowed = true

    // ver si esta por medio de category-subCategory o solo category
    if (!!pathSubCategory) {
      isPathAllowed = linkItems.some((item) => {
        if (item.url === `/${pathCategory}`) {
          return item.categories.some((subCategory) => { return subCategory.url === `/${pathSubCategory}` })
        }
        return false
      })
    } else {
      isPathAllowed = linkItems.some((item) => { return item.url === `/${pathCategory}` })
    }

    setError404(isPathAllowed === false)
  }, [pathname])

  useEffect(() => {
    const pathSplit = pathname.split('/')
    const pathCategory = pathSplit[1]
    const pathSubCategory = pathSplit[2]

    const category = linkItems.find(item => item.url === `/${pathCategory}`)
    const subCategory = category.categories.find(item => item.url === `/${pathSubCategory}`)

    if (!!pathSubCategory) {
      if (!!category && !!subCategory) {
        setBreadCrumbLinks([
          { name: 'Home', url: '/' },
          { name: category.name, url: category.url },
          { name: subCategory.name, url: category.url + subCategory.url }
        ])
        setTitle(subCategory.name)
      }
    } else {
      if (!!category) {
        setBreadCrumbLinks([
          { name: 'Home', url: '/' },
          { name: category.name, url: category.url }
        ])
        setTitle(category.name)
      }
    }
  }, [pathname])

  useEffect(() => {
    setResetSelect(!resetSelect)
  }, [pathname])

  const genericFunction = (value) => {
    console.log(value)
  }

  return (
    <>
      {
        (error404)
          ? (<Error404Page />)
          : (
            <Box p={{ base: 2, md: 4 }} w={'full'} minH={'150vh'}>
              <BreadcrumbPage links={breadCrumbLinks} />
              {/* Title and OrderBy */}
              <Flex py={4} justifyContent={'space-between'}>
                <Flex gap={2} alignItems={'baseline'}>
                  <Heading fontSize={{ base: 24, sm: 28 }} fontWeight={'medium'} >{title}</Heading>
                  <Text color={'yellow.500'} >54 resultados</Text>
                </Flex>

                <SelectCustom label={'Ordernar por'} options={dataSelect} defaultValue={dataSelect[0]} onSelect={genericFunction} isReset={resetSelect} />
              </Flex>
            </Box>
          )
      }
    </>
  )
}

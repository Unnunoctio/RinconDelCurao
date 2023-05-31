import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, Text, useColorMode } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'

export const BreadcrumbPage = ({ links = [] }) => {
  const { colorMode } = useColorMode()
  const navigate = useNavigate()

  const goLink = (url) => {
    navigate(url)
  }

  return (
    <Breadcrumb spacing={2}>
      {
        links.slice(0, -1).map((link, index) => (
          <BreadcrumbItem key={index} color={colorMode === 'light' ? 'light.text.secondary' : 'dark.text.secondary'}>
            <BreadcrumbLink onClick={() => goLink(link.url)}>
              {link.name}
            </BreadcrumbLink>
          </BreadcrumbItem>
        ))
      }
      <BreadcrumbItem flex={1}>
        <Text userSelect='none' color={colorMode === 'light' ? 'light.text.active' : 'dark.text.active'}>
          {links[links.length - 1]?.name}
        </Text>
      </BreadcrumbItem>
    </Breadcrumb>
  )
}

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
        links.map((link, index) => (
          <BreadcrumbItem key={index} color={colorMode === 'light' ? 'light.text.secondary' : 'dark.text.secondary'}>
            {
              (index === links.length - 1)
                ? (
                  <Text userSelect='none' color={colorMode === 'light' ? 'light.text.active' : 'dark.text.active'}>
                    {link.name}
                  </Text>
                  )
                : (
                  <BreadcrumbLink onClick={() => goLink(link.url)}>
                    {link.name}
                  </BreadcrumbLink>
                  )
            }
          </BreadcrumbItem>
        ))
      }
    </Breadcrumb>
  )
}

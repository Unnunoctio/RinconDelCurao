import { Breadcrumb, BreadcrumbItem, Text, useColorMode } from '@chakra-ui/react'
import { NavLink } from 'react-router-dom'

export const BreadcrumbPage = ({ links = [] }) => {
  const { colorMode } = useColorMode()

  return (
    <Breadcrumb spacing={2} maxW='100%' overflow='hidden'>
      {
        links.slice(0, -1).map((link, index) => (
          <BreadcrumbItem key={index} color={colorMode === 'light' ? 'light.text.secondary' : 'dark.text.secondary'}>
            <NavLink to={link.url}>
              <Text _hover={{ textDecoration: 'underline' }}>
                {link.name}
              </Text>
            </NavLink>
          </BreadcrumbItem>
        ))
      }
      <BreadcrumbItem>
        <Text
          userSelect='none'
          color={colorMode === 'light' ? 'light.text.active' : 'dark.text.active'}
          // isTruncated
          // overflow='hidden'
          whiteSpace='nowrap'
          // textOverflow='ellipsis'
        >
          {links[links.length - 1]?.name}
        </Text>
      </BreadcrumbItem>
    </Breadcrumb>
  )
}

import { Breadcrumb, BreadcrumbItem, Text, useColorModeValue } from '@chakra-ui/react'
import { NavLink } from 'react-router-dom'

export const BreadcrumbPage = ({ links = [] }) => {
  if (links.length === 0) return null
  return (
    <Breadcrumb spacing={2} overflow='hidden'>
      {
        links.slice(0, -1).map((link, index) => (
          <BreadcrumbItem
            key={index}
            color={useColorModeValue('light.text.secondary', 'dark.text.secondary')}
          >
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
          whiteSpace='nowrap'
          color={useColorModeValue('light.text.active', 'dark.text.active')}
        >
          {links[links.length - 1]?.name}
        </Text>
      </BreadcrumbItem>
    </Breadcrumb>
  )
}

import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, Icon, Text } from "@chakra-ui/react"
import { useNavigate } from "react-router-dom"
import { BsChevronRight } from "react-icons/bs"

export const BreadcrumbPage = ({ links = [] }) => {
  const navigate = useNavigate()

  const goLink = (url) => {
    navigate(url, { replace: true })
  }

  return (
    <Breadcrumb spacing={2} separator={<Icon display={'flex'} boxSize={4} color={'gray.500'} as={BsChevronRight} />}>
      {
        links.map((link, index) => (
          <BreadcrumbItem key={index}>
            {
              (index === links.length - 1) 
              ? (
                <Text userSelect={'none'} color={'yellow.500'}>
                  {link.name}
                </Text>
              )
              : (
                <BreadcrumbLink onClick={() => goLink(link.url)} color={'gray.500'}>
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

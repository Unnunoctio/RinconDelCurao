import { Box, Flex } from '@chakra-ui/react'
import { BreadcrumbPage } from './BreadcrumbPage'

export const HeaderPage = ({ breadcrumbLinks, children, ...rest }) => {
  return (
    <Box className='header-page'>
      <BreadcrumbPage links={breadcrumbLinks} />
      <Flex py={4} alignItems='center' minH='72px' {...rest}>
        {children}
      </Flex>
    </Box>
  )
}

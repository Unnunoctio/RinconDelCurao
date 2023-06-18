import { Card, CardBody, useColorModeValue } from '@chakra-ui/react'
import { NavLink } from 'react-router-dom'

export const CardLink = ({ href, children, ...rest }) => {
  return (
    <Card
      className='card-link'
      w={260}
      background={useColorModeValue('light.background.main', 'dark.background.main')}
      boxShadow='md'
      border='1px' borderColor={useColorModeValue('light.divider.main', 'dark.divider.main')}
      transition='transform 0.2s ease'
      cursor='pointer'
      _hover={{
        transform: 'scale(1.05)',
        borderColor: useColorModeValue('light.divider.active', 'dark.divider.active')
      }}
      {...rest}
    >
      <NavLink to={href}>
        <CardBody h='full' p={2} display='flex' flexDir='column'>
          {children}
        </CardBody>
      </NavLink>
    </Card>
  )
}

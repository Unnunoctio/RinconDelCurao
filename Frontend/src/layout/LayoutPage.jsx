import { Box } from '@chakra-ui/react'
import { useURLQuery } from '@hooks/useUrlQuery'
import { useEffect } from 'react'

export const LayoutPage = ({ children }) => {
  const { queryPaths, queryParams } = useURLQuery()

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }, [queryPaths, queryParams])

  return (
    <Box py={{ base: 2, md: 4 }} px={{ base: 2, sm: 4, md: 8 }} w='full' minH='85vh'>
      {children}
    </Box>
  )
}

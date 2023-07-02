import { ChakraProvider, ColorModeScript, CSSReset, useColorMode } from '@chakra-ui/react'
import { Global } from '@emotion/react'
import { theme } from './theme'

export const AppTheme = ({ children }) => {
  return (
    <ChakraProvider theme={theme}>
      {/* <CSSReset />
      <Global /> */}
      <CustomScrollbar />
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      {children}
    </ChakraProvider>
  )
}

const CustomScrollbar = () => {
  const { colorMode } = useColorMode()

  return (
    <>
      <CSSReset />
      <Global
        styles={{
          '::-webkit-scrollbar': {
            width: '8px',
            borderRadius: '8px',
            backgroundColor: colorMode === 'light' ? '#FFFFFF' : '#171923'
          },
          '::-webkit-scrollbar-thumb': {
            borderRadius: '8px',
            backgroundColor: colorMode === 'light' ? '#D69E2E99' : '#805AD599'
          },
          '::-webkit-scrollbar-thumb:hover': {
            backgroundColor: colorMode === 'light' ? '#D69E2E' : '#805AD5'
          }
        }}
      />
    </>
  )
}

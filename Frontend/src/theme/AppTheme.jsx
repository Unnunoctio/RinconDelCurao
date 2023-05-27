import { ChakraProvider, ColorModeScript, CSSReset } from '@chakra-ui/react'
import { Global } from '@emotion/react'
import { theme } from './theme'

export const AppTheme = ({ children }) => {
  return (
    <ChakraProvider theme={theme}>
      <CSSReset />
      <Global />
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      {children}
    </ChakraProvider>
  )
}

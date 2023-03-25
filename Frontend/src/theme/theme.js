import { extendTheme } from "@chakra-ui/react";

export const theme = extendTheme({
  fonts: {
    body: 'Roboto'
  },
  config: {
    initialColorMode: 'light',
    useSystemColorMode: true
  }
})

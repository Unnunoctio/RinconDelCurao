import { extendTheme } from '@chakra-ui/react'

export const theme = extendTheme({
  colors: {
    light: {
      background: {
        main: '#FFFFFF', // white
        secondary: '#EDF2F7', // gray.100
        active: '#D69E2E99' // yellow.500 0.6 -- rgba(214, 158, 46, 0.6)
      },
      divider: {
        main: '#E2E8F0', // gray.200
        active: '#D69E2E' // yellow.500
      },
      text: {
        main: '#1A202C', // gray.800
        secondary: '#718096', // gray.500
        active: '#D69E2E' // yellow.500
      },
      component: {
        main: '#A0AEC0', // gray.400
        active: '#D69E2E', // yellow.500
        background: '#FFFFFF', // white
        bg_active: '#E2E8F0', // gray.200
        border: '#718096' // gray.500
      }
    },
    dark: {
      background: {
        main: '#171923', // gray.900
        secondary: '#1A202C', // gray.800
        active: '#805AD599' // purple.500 0.6 -- rgba(128, 90, 213, 0.6)
      },
      divider: {
        main: '#2D3748', // gray.700
        // // active: '#D69E2E'       // yellow.500
        active: '#805AD5' // purple.500
      },
      text: {
        main: '#FFFFFFEB', // whiteAlpha.900
        secondary: '#718096', // gray.500
        // // active: '#D69E2E'       // yellow.500
        active: '#805AD5' // purple.500
      },
      component: {
        main: '#4A5568', // gray.600
        // // active: '#D69E2E'       // yellow.500
        active: '#805AD5', // purple.500
        background: '#2D3748', // gray.700
        bg_active: '#4A5568', // gray.600
        border: '#718096' // gray.500
      }
    }
  },
  fonts: {
    heading: 'Roboto',
    body: 'Roboto'
  },
  config: {
    initialColorMode: 'light',
    useSystemColorMode: true
  }
})

import { Text } from "@chakra-ui/react"
import { LayoutApp } from "./layout/LayoutApp"
import { AppTheme } from "./theme/AppTheme"

export const App = () => {
  return (
    <AppTheme>
      <LayoutApp>
        <Text color={{ base: 'red', sm: 'blue', md: 'pink', xl: 'white', '2xl': 'green' }} >probar tamaño</Text>
      </LayoutApp>
    </AppTheme>
  )
}


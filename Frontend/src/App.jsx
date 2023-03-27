import { AppRouter } from "./router/AppRouter"
import { AppTheme } from "./theme/AppTheme"

export const App = () => {
  return (
    <AppTheme>
      {/* <LayoutApp>
        <Text color={{ base: 'red', sm: 'blue', md: 'pink', xl: 'white', '2xl': 'green' }} >probar tamaño</Text>
        {/* <Box p={5}>
          <SliderCard />
        </Box> */}
        {/* <Box p={5}>
          <SliderHome />
        </Box> */}
        {/* <Box p={5}>
          <SliderCustom gap={32}>
            {
              cards.slice(5,10).map((card, index) => (
                <SliderCard key={index} dataCard={card} />
              ))
            }
          </SliderCustom>
        </Box> */}
      {/* </LayoutApp> */}
      <AppRouter />
    </AppTheme>
  )
}


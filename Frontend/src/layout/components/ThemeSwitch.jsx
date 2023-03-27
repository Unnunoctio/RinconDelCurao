import { useEffect, useState } from 'react'
import { Flex, Icon, useColorMode } from "@chakra-ui/react"
import { FiMoon, FiSun } from 'react-icons/fi'
import Switch from 'react-switch'

import './themeSwitch.css'

export const ThemeSwitch = () => {
  const { colorMode, toggleColorMode } = useColorMode()
  const [checked, setChecked] = useState(false)

  const handleChange = (nextChecked) => {
    setChecked(nextChecked)
    setTimeout(() => {
      toggleColorMode()
    }, 250)
  }

  useEffect(() => {
    if(colorMode === 'light') {
      setChecked(false)
    }else {
      setChecked(true)
    }
  }, [colorMode])
  

  return (
    <Switch
      onChange={handleChange}
      checked={ checked }
      height={32}
      width={68}
      handleDiameter={26}
      uncheckedIcon={
        <Flex w={'full'} h={'full'} alignItems={'center'} justifyContent={'center'} >
          <Icon boxSize={6} as={FiSun} />
        </Flex>
      }
      checkedIcon={
        <Flex w={'full'} h={'full'} alignItems={'center'} justifyContent={'center'} >
          <Icon boxSize={6} as={FiMoon} />
        </Flex>
      }
    />
  )
}

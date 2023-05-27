import { useEffect, useState } from 'react'
import { Flex, Icon, useColorMode, useColorModeValue } from '@chakra-ui/react'
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
    if (colorMode === 'light') {
      setChecked(false)
    } else {
      setChecked(true)
    }
  }, [colorMode])

  return (
    <Switch
      onChange={handleChange}
      checked={checked}
      height={32}
      width={68}
      handleDiameter={26}
      background='yellow.500'
      uncheckedIcon={
        <Flex w='full' h='full' alignItems='center' justifyContent='center'>
          <Icon boxSize={6} color={useColorModeValue('light.text.main', 'dark.text.main')} as={FiMoon} />
        </Flex>
      }
      checkedIcon={
        <Flex w='full' h='full' alignItems='center' justifyContent='center'>
          <Icon boxSize={6} color={useColorModeValue('light.text.main', 'dark.text.main')} as={FiSun} />
        </Flex>
      }
    />
  )
}

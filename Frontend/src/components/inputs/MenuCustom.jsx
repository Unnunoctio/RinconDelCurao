import { useEffect, useState } from "react"
import { Box, Button, Icon, Menu, MenuButton, MenuItem, MenuList, Text, useColorModeValue } from "@chakra-ui/react"
import { BiChevronDown } from 'react-icons/bi'

export const MenuCustom = ({ label, options = [], defaultValue, onSelect, isReset }) => {
  const [selectedOption, setSelectedOption] = useState(defaultValue.name)
  const [focus, setFocus] = useState(false)

  useEffect(() => {
    setSelectedOption(defaultValue.name)
  }, [isReset])
  
  const handleOptionSelect = (option) => {
    if(option.name !== selectedOption){
      setSelectedOption(option.name)
      onSelect(option.value)
    }
  }

  return (
    <Box width={'200px'} position={'relative'}>
      <Text fontSize={14}
        position={'absolute'}
        top={'-12px'}
        left={'8px'}
        zIndex={1}
        bg={useColorModeValue('gray.100', 'gray.800')}
        px={1}
        color={(focus) ? 'yellow.500': 'gray.500'}
        transition={'color 100ms linear'}
        userSelect={'none'}
      >
        {label}
      </Text>
      <Menu onOpen={() => setFocus(true)} onClose={() => setFocus(false)}>
        <MenuButton as={Button}
          rightIcon={
            <Icon boxSize={6} as={BiChevronDown} 
              color={'gray.500'}
              transition={'transform 100ms linear'}
              transform={(focus) ? 'rotate(-180deg)' : ''} 
            />
          }
          pr={1}
          variant={'outline'}
          width={'full'}
          textAlign={'left'}
          fontWeight={'normal'}
          // border={(focus) ? '2px' : '1px'}
          borderColor={(focus) ? 'yellow.500': 'gray.500'}
          transition={'border-color 100ms linear'}
          _hover={{
            bg: 'transparent'
          }}
          _active={{
            bg: 'transparent'
          }}
        >
          {selectedOption}
        </MenuButton>
        <MenuList>
          {
            options.map((option, index) => (
              <MenuItem key={index} onClick={() => handleOptionSelect(option)}
                bg={(option.name === selectedOption) ? useColorModeValue('gray.100', 'gray.600') : ''}
                _hover={{
                  bg: useColorModeValue('gray.200', 'gray.500')
                }}
              >
                {option.name}
              </MenuItem>
            ))
          }
        </MenuList>
      </Menu>
    </Box>
  )
}

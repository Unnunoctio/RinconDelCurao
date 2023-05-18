import { Box, Icon, IconButton, Popover, PopoverArrow, PopoverBody, PopoverContent, PopoverTrigger, useColorModeValue } from '@chakra-ui/react'
import React from 'react'
import { BsGear } from 'react-icons/bs'
import { ThemeSwitch } from './ThemeSwitch'


export const OptionsButton = ({ funOnClick, onOptionOpen, onOptionClose }) => {
  
  return (
    <>
      <Box>
        <Popover
          onOpen={onOptionOpen}
          onClose={onOptionClose}
        >
          <PopoverTrigger>
            <IconButton onClick={funOnClick}
              bg={'transparent'}
              color={useColorModeValue('light.text.main', 'dark.text.main')}
              icon={<Icon boxSize={6} as={BsGear} />}
              _hover={{
                color: useColorModeValue('light.text.active', 'dark.text.active')
              }}
            />
          </PopoverTrigger>
          <PopoverContent boxShadow={'md'} w={'auto'} bg={useColorModeValue('light.component.background', 'dark.component.background')}>
            <PopoverArrow bg={useColorModeValue('light.component.background', 'dark.component.background')}/>
            <PopoverBody px={4} py={3}>
              <ThemeSwitch />
            </PopoverBody>
          </PopoverContent>
        </Popover>
      </Box>
    </>
  )
}

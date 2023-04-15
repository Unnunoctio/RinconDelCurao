import { Box, Icon, IconButton, Popover, PopoverArrow, PopoverBody, PopoverContent, PopoverTrigger } from '@chakra-ui/react'
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
              icon={<Icon boxSize={6} as={BsGear} />}
              _hover={{
                color: 'yellow.500'
              }}
            />
          </PopoverTrigger>
          <PopoverContent boxShadow={'md'} w={'auto'}>
            <PopoverArrow />
            <PopoverBody px={4} py={3}>
              <ThemeSwitch />
            </PopoverBody>
          </PopoverContent>
        </Popover>
      </Box>
    </>
  )
}

import React from 'react'
import { Box, Text, useColorModeValue } from '@chakra-ui/react'
import { Controller } from 'react-hook-form'
import { Select } from 'chakra-react-select'
import { useState } from 'react'

export const OrderBySelect = ({ control, label, name, options = [], handleSelect }) => {
  const [focus, setFocus] = useState(false)

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value, name, ref } }) => (
        <Box w={'210px'} position={'relative'}>
          <Text fontSize={14}
            position={'absolute'}
            top={'-12px'}
            left={'8px'}
            zIndex={2}
            bg={useColorModeValue('gray.100', 'gray.800')}
            px={1}
            transition={'color 200ms linear'}
            color={(focus) ? 'yellow.500' : 'gray.500'}
          >
            {label}
          </Text>
          <Select
            name={name}
            ref={ref}
            onChange={(selectedOption) => {
              onChange(selectedOption)
              handleSelect()
            }}
            value={value}
            onFocus={() => setFocus(true)}
            onBlur={() => setFocus(false)}
            options={options}
            closeMenuOnSelect={true}
            focusBorderColor={'yellow.500'}
            blurInputOnSelect={true}
            chakraStyles={{
              control: (provided, state) => ({
                ...provided,
                borderColor: 'gray.500',
                boxShadow: 'none !important',
                cursor: 'pointer',
                ":hover": {
                  borderColor: `${focus ? 'yellow.500' : 'gray.500'}`
                }
              }),
              option: (provided, state) => ({
                ...provided,
                background: state.isSelected ? useColorModeValue('gray.200', 'gray.600') : provided.background,
                color: state.isSelected ? useColorModeValue('gray.800', 'white') : provided.color
              }),
              dropdownIndicator: (provided, { selectProps }) => ({
                ...provided,
                background: 'transparent',
                "> svg": {
                  transition: 'transform 100ms linear',
                  transform: `rotate(${selectProps.menuIsOpen ? -180 : 0}deg)`
                }
              }),
            }}
          />
        </Box>
      )}
    />
  )
}


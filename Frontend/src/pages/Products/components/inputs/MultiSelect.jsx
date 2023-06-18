import { memo, useState } from 'react'
import { FormControl, FormLabel, useColorModeValue } from '@chakra-ui/react'
import { Controller } from 'react-hook-form'
import { Select } from 'chakra-react-select'

export const MultiSelect = memo(({ control, label, name, options = [] }) => {
  const [focus, setFocus] = useState(false)

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value, name, ref } }) => (
        <FormControl>
          <FormLabel fontSize={18} mb={1}>{label}</FormLabel>
          <Select
            isMulti
            name={name}
            ref={ref}
            onChange={onChange}
            onFocus={() => setFocus(true)}
            onBlur={() => setFocus(false)}
            value={value}
            options={options}
            placeholder=''
            closeMenuOnSelect={false}
            focusBorderColor={useColorModeValue('light.component.active', 'dark.component.active')}
            chakraStyles={{
              control: (provided, state) => ({
                ...provided,
                borderColor: useColorModeValue('light.component.border', 'dark.component.border'),
                boxShadow: 'none !important',
                cursor: 'pointer',
                ':hover': {
                  borderColor: `${focus ? useColorModeValue('light.component.active', 'dark.component.active') : useColorModeValue('light.component.border', 'dark.component.border')}`
                }
              }),
              multiValue: (provided, state) => ({
                ...provided,
                background: useColorModeValue('light.background.active', 'dark.background.active'),
                color: useColorModeValue('light.text.main', 'dark.text.main')
              }),
              indicatorSeparator: (provided, state) => ({
                ...provided,
                borderColor: useColorModeValue('light.component.main', 'dark.component.main')
              }),
              dropdownIndicator: (provided, { selectProps }) => ({
                ...provided,
                background: 'transparent',
                '> svg': {
                  transition: 'transform 100ms linear',
                  transform: `rotate(${selectProps.menuIsOpen ? -180 : 0}deg)`
                }
              })
            }}
          />
        </FormControl>
      )}
    />
  )
})

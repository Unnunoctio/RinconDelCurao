import { FormControl, FormLabel, useColorModeValue } from "@chakra-ui/react"
import { Select } from "chakra-react-select"
import { useState } from "react"
import { Controller } from "react-hook-form"

export const MultiSelectCustom = ({ control, label, name, options = [] }) => {
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
            placeholder=""
            closeMenuOnSelect={false}
            focusBorderColor={'yellow.500'}
            chakraStyles={{
              control: (provided, state) => ({
                ...provided,
                borderColor: 'gray.500',
                boxShadow: 'none !important',
                cursor: 'pointer',
                ":hover": {
                  borderColor: `${focus ? 'yellow.500' : 'gray.500'}`,
                }
              }),
              multiValue: (provided, state) => ({
                ...provided,
                background: 'rgba(214,158,46,0.6)',
                color: useColorModeValue('gray.800', 'white')
              }),
              indicatorSeparator: (provided, state) => ({
                ...provided,
                borderColor: useColorModeValue('gray.400', 'gray.600')
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
        </FormControl>
      )}
    />
  )
}

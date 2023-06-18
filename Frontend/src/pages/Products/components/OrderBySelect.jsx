import { memo, useState } from 'react'
import { FormControl, FormLabel, useColorModeValue } from '@chakra-ui/react'
import { Select } from 'chakra-react-select'
import { useProductsStore, useURLQuery } from '@hooks'
import { orderByItems } from '@assets'

export const OrderBySelect = memo(() => {
  const [focus, setFocus] = useState(false)

  const { addQueryMultiParamsURL } = useURLQuery()
  const { orderBy, handleOrderBy, handleCurrentPage } = useProductsStore()

  const onChangeOrderBy = (option) => {
    handleOrderBy(option)
    handleCurrentPage(1)

    console.log('Ejecucion: Productos via OrderBy')

    const params = [
      { label: 'page', value: 1 },
      { label: 'orderBy', value: option.value }
    ]
    addQueryMultiParamsURL(params)
  }

  return (
    <FormControl w={{ base: '150px', sm: '210px' }} position='relative'>
      <FormLabel
        fontSize={{ base: 12, sm: 14 }}
        position='absolute'
        top={{ base: '-10px', sm: '-12px' }}
        left='8px'
        zIndex={2}
        bg={useColorModeValue('light.background.secondary', 'dark.background.secondary')}
        px={1}
        transition='color 200ms linear'
        color={(focus) ? useColorModeValue('light.text.active', 'dark.text.active') : useColorModeValue('light.component.border', 'dark.component.border')}
        fontWeight='regular'
      >
        Ordenar por
      </FormLabel>
      <Select
        value={orderByItems.find((item) => { return item.value === orderBy })}
        options={orderByItems}
        onChange={(option) => onChangeOrderBy(option)}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        closeMenuOnSelect
        focusBorderColor={useColorModeValue('light.component.active', 'dark.component.active')}
        blurInputOnSelect
        size={{ base: 'sm', sm: 'md' }}
        //* Estilos
        chakraStyles={{
          control: (provided, state) => ({
            ...provided,
            borderColor: useColorModeValue('light.component.border', 'dark.component.border'),
            boxShadow: 'none !important',
            cursor: 'pointer',
            borderRadius: '6px',
            ':hover': {
              borderColor: `${focus ? useColorModeValue('light.component.active', 'dark.component.active') : useColorModeValue('light.component.border', 'dark.component.border')}`
            }
          }),
          menuList: (provided, state) => ({
            ...provided,
            borderRadius: '6px'
          }),
          option: (provided, state) => ({
            ...provided,
            background: state.isSelected ? useColorModeValue('light.component.bg_active', 'dark.component.bg_active') : provided.background,
            color: state.isSelected ? useColorModeValue('light.text.main', 'dark.text.main') : provided.color,
            ':active': {
              background: state.isSelected ? useColorModeValue('light.component.bg_active', 'dark.component.bg_active') : provided.background
            }
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
  )
})

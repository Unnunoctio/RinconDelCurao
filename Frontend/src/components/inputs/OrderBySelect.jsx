import { FormControl, FormLabel, useColorModeValue } from '@chakra-ui/react'
import { Select } from 'chakra-react-select'
import { memo, useState } from 'react'
import { orderByItems } from '../../assets'
import { shallow } from 'zustand/shallow'
import { useProductsStore } from '../../store'
import { useQueryURL } from '../../hooks'

export const OrderBySelect = memo(() => {
  const [focus, setFocus] = useState(false)
  const { addQueryMultiParamsURL } = useQueryURL()

  const orderBy = useProductsStore((state) => state.orderBy)
  const [getStoreProducts, handleStoreOrderBy, handleStorePage] = useProductsStore(
    (state) => [state.getStoreProducts, state.handleStoreOrderBy, state.handleStorePage],
    shallow
  )

  const onChangeOrderBy = (option) => {
    handleStoreOrderBy(option)
    handleStorePage(1)
    getStoreProducts()
    console.log('Ejecucion: Productos via OrderBy')

    const params = [
      { label: 'page', value: 1 },
      { label: 'orderBy', value: option.value }
    ]

    addQueryMultiParamsURL(params)
  }

  return (
    <FormControl w='210px' position='relative'>
      <FormLabel
        fontSize={14}
        position='absolute'
        top='-12px'
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
        value={orderBy}
        options={orderByItems}
        onChange={(option) => onChangeOrderBy(option)}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        closeMenuOnSelect
        focusBorderColor={useColorModeValue('light.component.active', 'dark.component.active')}
        blurInputOnSelect
        //* Estilos
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
            // borderColor: useColorModeValue('gray.400', 'gray.600')
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

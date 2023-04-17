
import { Box, Flex, FormLabel, RangeSlider, RangeSliderFilledTrack, RangeSliderThumb, RangeSliderTrack, Text, useColorModeValue } from '@chakra-ui/react'
import { Controller } from 'react-hook-form'

export const SliderCustom = ({ control, label, name, minValue, maxValue, step = 1, startSymbol = undefined, endSymbol = undefined, format = (value) => { return value } }) => {

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <Box>
          <Flex justifyContent={'space-between'} alignItems={'baseline'} userSelect={'none'}>
            <FormLabel fontSize={18} mb={1}>{label}</FormLabel>
            <Text>
              {!!startSymbol ? startSymbol : ''}{format(field.value[0])}{!!endSymbol ? endSymbol : ''} - {!!startSymbol ? startSymbol : ''}{format(field.value[1])}{!!endSymbol ? endSymbol : ''}
            </Text>
          </Flex>
          <Flex justifyContent={'center'}>
            <RangeSlider w={'95%'} defaultValue={[minValue, maxValue]} min={minValue} max={maxValue} step={step} {...field}>
              <RangeSliderTrack bg={useColorModeValue('gray.300', 'gray.700')}>
                <RangeSliderFilledTrack bg={'yellow.500'} />
              </RangeSliderTrack>
              <RangeSliderThumb boxSize={3.5} index={0} zIndex={0} />
              <RangeSliderThumb boxSize={3.5} index={1} zIndex={0} />
            </RangeSlider>
          </Flex>
        </Box>
      )}
    />
  )
}

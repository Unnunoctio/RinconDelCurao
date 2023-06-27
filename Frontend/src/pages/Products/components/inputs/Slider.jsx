import { Box, Flex, FormLabel, RangeSlider, RangeSliderFilledTrack, RangeSliderThumb, RangeSliderTrack, Text, useColorModeValue } from '@chakra-ui/react'
import { memo } from 'react'
import { Controller } from 'react-hook-form'

export const Slider = memo(({ control, label, name, minValue, maxValue, step = 1, startSymbol = undefined, endSymbol = undefined, format = (value) => { return value } }) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <Box>
          <Flex justifyContent='space-between' alignItems='baseline' userSelect='none'>
            <FormLabel fontSize={18} mb={1}>{label}</FormLabel>
            <Text>
              {startSymbol || ''}{format(field.value[0])}{endSymbol || ''} - {startSymbol || ''}{format(field.value[1])}{endSymbol || ''}
            </Text>
          </Flex>
          <Flex justifyContent='center'>
            <RangeSlider aria-label={['min', 'max']} w='95%' min={minValue} max={maxValue} step={step} {...field}>
              <RangeSliderTrack bg={useColorModeValue('light.divider.main', 'dark.divider.main')}>
                <RangeSliderFilledTrack bg={useColorModeValue('light.component.active', 'dark.component.active')} />
              </RangeSliderTrack>
              <RangeSliderThumb boxSize={3.5} index={0} zIndex={0} />
              <RangeSliderThumb boxSize={3.5} index={1} zIndex={0} />
            </RangeSlider>
          </Flex>
        </Box>
      )}
    />
  )
})

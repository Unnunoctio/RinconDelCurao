import { Flex, Icon, useColorModeValue } from '@chakra-ui/react'
import { MdStar, MdStarBorder, MdStarHalf } from 'react-icons/md'

export const StarRating = ({ value, ...rest }) => {
  const stars = [1, 2, 3, 4, 5]

  return (
    <Flex
      pt='3px' pb='4px'
      alignItems='center'
      {...rest}
    >
      {
        stars.map((star, index) => (
          <Icon
            key={index}
            boxSize={4}
            as={
              (value >= star)
                ? MdStar
                : (value >= star - 0.5)
                    ? MdStarHalf
                    : MdStarBorder
            }
            color={
              (value >= star - 0.5)
                ? useColorModeValue('light.component.active', 'dark.component.active')
                : useColorModeValue('light.component.main', 'dark.component.main')
              }
          />
        ))
      }
    </Flex>
  )
}

import { Flex, Icon, useColorModeValue } from '@chakra-ui/react'
import { MdStar, MdStarBorder, MdStarHalf } from 'react-icons/md'

export const StarRating = ({ rating }) => {
  const stars = [1, 2, 3, 4, 5]

  return (
    <Flex
      // py={'1px'}
      pt={'3px'} pb={'4px'}
      alignItems={'center'}
    >
      {
        stars.map((star, index) => (
          <Icon key={index}
            boxSize={4}
            as={
              (rating >= star) ? MdStar :
              (rating >= star-0.5) ? MdStarHalf :
              MdStarBorder
            }
            color={
              (rating >= star-0.5) 
                ? useColorModeValue('light.component.active', 'dark.component.active')
                : useColorModeValue('light.component.main', 'dark.component.main')
            }
          />
        ))
      }
      {/* <Text pl={1} fontSize={14} color={'yellow.500'} fontWeight={'medium'} >{rating}/5</Text> */}
    </Flex>
  )
}

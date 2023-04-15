import { Flex, Icon, Text } from '@chakra-ui/react'
import { MdStar, MdStarBorder, MdStarHalf } from 'react-icons/md'

export const StarRating = ({ rating }) => {
  const stars = [1, 2, 3, 4, 5]

  return (
    <Flex
      // py={'1px'}
      pt={'4px'} pb={'3px'}
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
              (rating >= star-0.5) ? 'yellow.500' : 'gray.400'
            }
          />
        ))
      }
      {/* <Text pl={1} fontSize={14} color={'yellow.500'} fontWeight={'medium'} >{rating}/5</Text> */}
    </Flex>
  )
}

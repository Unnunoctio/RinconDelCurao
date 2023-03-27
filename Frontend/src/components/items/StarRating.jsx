import { Flex, Icon } from '@chakra-ui/react'
import { MdStar, MdStarBorder, MdStarHalf } from 'react-icons/md'

export const StarRating = ({ rating }) => {
  const stars = [1, 2, 3, 4, 5]

  return (
    <Flex>
      {
        stars.map((star, index) => (
          <Icon key={index}
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
    </Flex>
  )
}

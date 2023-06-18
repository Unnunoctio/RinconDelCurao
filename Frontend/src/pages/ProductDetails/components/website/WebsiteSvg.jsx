import { Icon } from '@chakra-ui/react'

const JumboIcon = (props) => (
  <Icon viewBox='0 0 192 192' {...props}>
    <g
      transform='translate(0.000000,192.000000) scale(0.100000,-0.100000)'
      fill='#00A117' stroke='none'
    >
      <path d='M751 1745 c-81 -69 -54 -207 47 -235 20 -5 135 -10 254 -10 183 0
        219 -2 232 -16 14 -13 16 -64 16 -398 0 -412 -4 -457 -54 -533 -33 -52 -93
        -107 -146 -135 -38 -19 -60 -23 -140 -23 -112 0 -163 20 -234 91 -56 55 -85
        116 -98 202 -13 90 -31 128 -70 152 -90 54 -198 -10 -198 -118 0 -57 26 -182
        50 -238 59 -137 174 -242 330 -299 62 -23 96 -28 201 -33 277 -11 448 76 548
        280 68 136 71 171 71 729 0 467 -1 492 -20 528 -11 22 -35 48 -53 60 -33 20
        -46 21 -370 21 l-335 0 -31 -25z'
      />
    </g>
  </Icon>
)

export const WebsiteSvg = ({ websiteName, ...rest }) => {
  if (websiteName.toLowerCase() === 'jumbo') return <JumboIcon {...rest} />

  return <Icon {...rest} />
}

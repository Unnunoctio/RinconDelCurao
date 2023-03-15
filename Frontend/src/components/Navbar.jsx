import { Center, Flex, Icon, IconButton, Link, Text, useColorModeValue, useDisclosure } from "@chakra-ui/react"
import { BsGear } from 'react-icons/bs'

const linkItems = [
  {
    name: 'Cervezas',
    url: '',
    categories: [
      { name: 'Cervezas Artesanales', url: '' },
      { name: 'Cervezas Tradicionales', url: '' },
      { name: 'Cervezas Importadas', url: '' },
      { name: 'Cervezas Sin Alcohol', url: '' }
    ]
  },
  {
    name: 'Vinos',
    url: '',
    categories: [
      { name: 'Vinos Tintos', url: '' },
      { name: 'Vinos Blancos', url: '' },
      { name: 'Vinos Rosé', url: '' },
      { name: 'Vinos Cero', url: '' }
    ]
  },
  {
    name: 'Destilados',
    url: '',
    categories: [
      { name: 'Whisky', url: '' },
      { name: 'Pisco', url: '' },
      { name: 'Ron', url: '' },
      { name: 'Tequila', url: '' }
    ]
  }
]

export const Navbar = ({ ...rest }) => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <Flex
      w={'full'}
      zIndex={2}
      pos={'fixed'}
      bg={useColorModeValue('white', 'gray.900')}
      borderBottomWidth={1}
      borderBottomColor={useColorModeValue('gray.200', 'gray.700')}
      justifyContent={'center'}
      userSelect={'none'}
      onMouseLeave={onClose}
      {...rest}
    >
      <Flex minW={'80%'} justifyContent={'space-between'}>
        <Center h={16}>
          <Text>LOGO</Text>
        </Center>

        <Flex>
          <Flex h={isOpen ? 'auto' : 16} alignItems={'flex-start'} overflow={'hidden'} gap={12} onMouseEnter={onOpen} >
            {
              linkItems.map((item, index) => (
                <NavItem key={index} item={item} />
              ))
            }
          </Flex>

          <Center h={16} ml={16}>
            <IconButton onClick={onClose}
              bg={'transparent'}
              icon={<Icon boxSize={6} as={BsGear} />}
              _hover={{
                color: 'yellow.500'
              }}
            />
          </Center>
        </Flex>
      </Flex>
    </Flex>
  )
}

const NavItem = ({ item, ...rest }) => {
  return (
    <Flex
      alignItems={'left'}
      flexDir={'column'}
      pb={8}
    >
      <Center h={16} justifyContent={'left'}>
        <Text fontSize={18} fontWeight={'medium'}>{item.name}</Text>
      </Center>
      {
        item.categories.map((category, index) => (
          <Link key={index}
            color={'gray.500'}
            mb={2}
          >
            {category.name}
          </Link>
        ))
      }
      <Link
        color={'yellow.500'}
      >
        Ver Todos
      </Link>
    </Flex>
  )
}
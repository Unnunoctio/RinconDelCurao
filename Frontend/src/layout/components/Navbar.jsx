import { Box, Center, Collapse, Drawer, DrawerContent, DrawerOverlay, Flex, HStack, Icon, IconButton, Link, Stack, Text, useColorModeValue, useDisclosure, VStack } from "@chakra-ui/react"
import { GiShatteredGlass } from 'react-icons/gi'
import { FiChevronDown, FiMenu, FiX } from 'react-icons/fi'
import { OptionsButton } from "./OptionsButton"
import { useNavigate } from "react-router-dom"

const navHeigth = '72px'

const linkItems = [
  {
    name: 'Cervezas',
    url: '/cervezas',
    categories: [
      { name: 'Cervezas Artesanales', url: '/cervezas-artesanales' },
      { name: 'Cervezas Tradicionales', url: '/cervezas-tradicionales' },
      { name: 'Cervezas Importadas', url: '/cervezas-importadas' },
      { name: 'Cervezas Sin Alcohol', url: '/cervezas-sin-alcohol' }
    ]
  },
  {
    name: 'Vinos',
    url: '/vinos',
    categories: [
      { name: 'Vinos Tintos', url: '/vinos-tintos' },
      { name: 'Vinos Blancos', url: '/vinos-blancos' },
      { name: 'Vinos Rosé', url: '/vinos-rose' },
      { name: 'Vinos Cero', url: '/vinos-cero' }
    ]
  },
  {
    name: 'Destilados',
    url: 'destilados',
    categories: [
      { name: 'Whisky', url: '/whisky' },
      { name: 'Pisco', url: '/pisco' },
      { name: 'Ron', url: '/ron' },
      { name: 'Tequila', url: '/tequila' }
    ]
  }
]

export const Navbar = () => {
  const { isOpen, onOpen, onClose } = useDisclosure() //Sidebar
  const { isOpen: isNavOpen, onOpen: onNavOpen, onClose: onNavClose } = useDisclosure()

  const onNavCloseDelay = () => {
    setTimeout(() => {
      onNavClose()
    }, 300)
  }

  return (
    <>
      {/* Navbar */}
      <Flex
        w={'full'}
        zIndex={2} pos={'fixed'}
        bg={useColorModeValue('white', 'gray.900')}
        borderBottom={'1px'} borderBottomColor={useColorModeValue('gray.200', 'gray.700')}
        justifyContent={'center'}
        userSelect={'none'}
        onMouseLeave={onNavClose}
      >
        <NavbarContent
          onOpen={onOpen}
          isNavOpen={isNavOpen}
          onNavOpen={onNavOpen}
          onNavClose={onNavClose}
        />
      </Flex>

      {/* Sidebar Para Mobile */}
      <Drawer
        autoFocus={false}
        isOpen={isOpen}
        placement={'left'}
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
      >
        <DrawerOverlay />
        <DrawerContent maxH={'100vh'}>
          <SidebarContent onClose={onClose} overflowY={'auto'} />
        </DrawerContent>
      </Drawer>
    </>
  )
}

const NavbarContent = ({ onOpen, isNavOpen, onNavOpen, onNavClose, ...rest }) => {
  const {isOpen: isOptionOpen, onOpen: onOptionOpen, onClose: onOptionClose} = useDisclosure()
  const navigate = useNavigate()
  
  const goHome = () => {
    navigate('', { replace: true })
  }

  return (
    <Flex minW={'75%'} maxW={'90%'} w={{ base: '90%', md: 'auto' }}
      justifyContent={'space-between'}
      {...rest}
    >
      {/* LOGO */}
      <Center onClick={goHome}
        h={navHeigth} mr={{ base: 0, md: 12 }} 
        color={'yellow.500'} cursor={'pointer'}
        transition={'transform 200ms ease-out'}
        _hover={{ transform: 'scale(1.03)' }}
      >
        <Icon boxSize={9} as={GiShatteredGlass} />
        <Box ml={2} fontFamily={'Finger Paint'}>
          <Text>Rincón</Text>
          <Text>Del Curao</Text>
        </Box>
      </Center>

      {/* Items and Buttons */}
      <Flex>
        {/* Items */}
        <Flex
          display={{ base: 'none', md: 'flex' }}
          // h={isNavOpen ? 'auto' : navHeigth}
          alignItems={'flex-start'}
          overflow={'hidden'}
          gap={6}
          onMouseEnter={onNavOpen}
        >
          <Collapse in={isNavOpen && !isOptionOpen} startingHeight={navHeigth}>
            <HStack spacing={8}>
              {
                linkItems.map((item, index) => (
                  <NavItem key={index} item={item} />
                ))
              }
            </HStack>
          </Collapse>
        </Flex>

        {/* Buttons */}
        <Flex
          h={navHeigth}
          ml={{ base: 0, md: 12 }}
          alignItems={'center'}
          gap={3}
        >
          {/* <IconButton onClick={onNavClose}
            bg={'transparent'}
            icon={<Icon boxSize={6} as={BsGear} />}
            _hover={{
              color: 'yellow.500'
            }}
          /> */}
          <OptionsButton funOnClick={onNavClose} onOptionOpen={onOptionOpen} onOptionClose={onOptionClose} />

          <IconButton onClick={onOpen}
            display={{ base: 'block', md: 'none' }}
            bg={'transparent'}
            icon={<Icon boxSize={6} as={FiMenu} />}
            _hover={{
              color: 'yellow.500'
            }}
          />
        </Flex>
      </Flex>
    </Flex>
  )
}

const NavItem = ({ item, ...rest }) => {
  const navigate = useNavigate()

  const goLinkCategory = (categoryUrl) => {
    navigate(`${item.url}${categoryUrl}`, { replace: true })
  }

  const goLinkAll = () => {
    navigate(`${item.url}`, { replace: true })
  }

  return (
    <Flex
      alignItems={'left'}
      flexDir={'column'}
      pb={8}
      {...rest}
    >
      <Center h={navHeigth} justifyContent={'left'}>
        <Text fontSize={18} fontWeight={'medium'}>{item.name}</Text>
      </Center>
      {
        item.categories.map((category, index) => (
          <Link key={index} onClick={() => goLinkCategory(category.url)}
            color={'gray.500'}
            mb={2}
          >
            {category.name}
          </Link>
        ))
      }
      <Link onClick={goLinkAll}
        color={'yellow.500'}
      >
        Ver Todos
      </Link>
    </Flex>
  )
}

const SidebarContent = ({ onClose, ...rest }) => {
  return (
    <Box
      bg={useColorModeValue('white', 'gray.900')}
      borderRight={'1px'} borderRightColor={useColorModeValue('gray.200', 'gray.700')}
      pos={'fixed'}
      h={'full'} w={'full'}
      p={4}
      userSelect={'none'}
      {...rest}
    >
      <Flex h={24} alignItems={'center'} justifyContent={'space-between'}>
        {/* LOGO */}
        <Center color={'yellow.500'}>
          <Icon boxSize={10} as={GiShatteredGlass} />
          <Box ml={2} fontFamily={'Finger Paint'} fontSize={18}>
            <Text>Rincón</Text>
            <Text>Del Curao</Text>
          </Box>
        </Center>

        {/* CloseButton */}
        <IconButton onClick={onClose}
          bg={'transparent'}
          aria-label={'close menu'}
          _hover={{ color: 'yellow.500' }}
          icon={<Icon boxSize={6} as={FiX} />}
        />
      </Flex>
      {
        linkItems.map((item, index) => (
          <SidebarItem key={index} item={item} />
        ))
      }
    </Box>
  )
}

const SidebarItem = ({ item, ...rest }) => {
  const { isOpen, onToggle, onOpen } = useDisclosure()

  //Detectar en que pagina estamos y abrir esas categorias 

  return (
    <Flex
      // alignItems={'left'}
      flexDir={'column'}
      onClick={item.categories && onToggle}
      cursor={'pointer'}
      {...rest}
    >
      <Flex py={3}
        justifyContent={'space-between'}
        alignItems={'center'}
      >
        <Text fontSize={18} fontWeight={'semibold'} >{item.name}</Text>
        {
          item.categories && (
            <Icon boxSize={6} as={FiChevronDown}
              transition={'all .25s ease-in-out'}
              transform={isOpen ? 'rotate(180deg)' : ''}
            />
          )
        }
      </Flex>
      <Collapse in={isOpen} animateOpacity style={{ marginTop: '0!important' }}>
        <Stack
          pl={4}
          borderLeft={'1px'}
          borderStyle={'solid'}
          borderLeftColor={useColorModeValue('gray.200', 'gray.700')}
        >
          {
            item.categories &&
            item.categories.map((category, index) => (
              <Link key={index}
                color={'gray.500'}
                py={1}
              >
                {category.name}
              </Link>
            ))
          }
          <Link
            color={'yellow.500'}
            py={1}
          >
            Ver Todos
          </Link>
        </Stack>
      </Collapse>
    </Flex>
  )
}


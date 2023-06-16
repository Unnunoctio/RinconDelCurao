import { Box, Center, Collapse, Drawer, DrawerContent, DrawerOverlay, Flex, HStack, Icon, IconButton, Stack, Text, VStack, useColorModeValue, useDisclosure } from '@chakra-ui/react'
import { GiShatteredGlass } from 'react-icons/gi'
import { FiChevronDown, FiMenu, FiX } from 'react-icons/fi'
import { OptionsButton } from './OptionsButton'
import { NavLink } from 'react-router-dom'

import { linkItems } from '../../assets/linkItems'

const navHeigth = '72px'

export const Navbar = () => {
  const { isOpen, onOpen, onClose } = useDisclosure() // Sidebar
  const { isOpen: isNavOpen, onOpen: onNavOpen, onClose: onNavClose } = useDisclosure()

  // const onNavCloseDelay = () => {
  //   setTimeout(() => {
  //     onNavClose()
  //   }, 300)
  // }

  return (
    <>
      {/* Navbar */}
      <Flex
        w='100%'
        zIndex={3} pos='fixed'
        bg={useColorModeValue('light.background.main', 'dark.background.main')}
        borderBottom='1px' borderBottomColor={useColorModeValue('light.divider.main', 'dark.divider.main')}
        justifyContent='center'
        userSelect='none'
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
        placement='left'
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
      >
        <DrawerOverlay />
        <DrawerContent maxH='100vh'>
          <SidebarContent onClose={onClose} overflowY='auto' />
        </DrawerContent>
      </Drawer>
    </>
  )
}

const NavbarContent = ({ onOpen, isNavOpen, onNavOpen, onNavClose, ...rest }) => {
  const { isOpen: isOptionOpen, onOpen: onOptionOpen, onClose: onOptionClose } = useDisclosure()

  return (
    <Flex
      flex={1}
      maxW={`${1850 * 0.75}px`}
      px={{ base: 2, sm: 4, md: 8 }}
      // minW={'75%'} maxW={'90%'} w={{ base: '90%', md: 'auto' }}
      justifyContent='space-between'
      {...rest}
    >
      {/* LOGO */}
      <NavLink to='/'>
        <Center
          h={navHeigth} mr={{ base: 0, md: 12 }}
          color={useColorModeValue('light.text.active', 'dark.text.active')} cursor='pointer'
          transition='transform 200ms ease-out'
          _hover={{ transform: 'scale(1.03)' }}
        >
          <Icon boxSize={9} as={GiShatteredGlass} />
          <Box ml={2} fontFamily='Finger Paint'>
            <Text>Rincón</Text>
            <Text>Del Curao</Text>
          </Box>
        </Center>
      </NavLink>

      {/* Items and Buttons */}
      <Flex>
        {/* Items */}
        <Flex
          display={{ base: 'none', md: 'flex' }}
          // h={isNavOpen ? 'auto' : navHeigth}
          alignItems='flex-start'
          overflow='hidden'
          gap={6}
          onMouseEnter={onNavOpen}
        >
          <Collapse in={isNavOpen && !isOptionOpen} startingHeight={navHeigth}>
            <HStack spacing={8} alignItems='flex-start'>
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
          alignItems='center'
          gap={3}
        >
          <OptionsButton funOnClick={onNavClose} onOptionOpen={onOptionOpen} onOptionClose={onOptionClose} />

          <IconButton
            onClick={onOpen}
            display={{ base: 'block', md: 'none' }}
            bg='transparent'
            color={useColorModeValue('light.text.main', 'dark.text.main')}
            icon={<Icon boxSize={6} as={FiMenu} />}
            _hover={{
              color: useColorModeValue('light.text.active', 'dark.text.active')
            }}
          />
        </Flex>
      </Flex>
    </Flex>
  )
}

const NavItem = ({ item, ...rest }) => {
  return (
    <Flex
      alignItems='left'
      flexDir='column'
      pb={8}
      {...rest}
    >
      <Center h={navHeigth} justifyContent='left'>
        <Text fontSize={18} fontWeight='medium' color={useColorModeValue('light.text.main', 'dark.text.main')}>{item.name}</Text>
      </Center>
      <VStack spacing={3} alignItems='flex-start'>
        {
          item.categories.map((category, index) => (
            <NavLink key={index} to={`${item.url}?category=${category.url}`}>
              <Text
                color={useColorModeValue('light.text.secondary', 'dark.text.secondary')}
                // mb={2}
                _hover={{ textDecoration: 'underline' }}
              >
                {category.name}
              </Text>
            </NavLink>
          ))
        }
        <NavLink to={`${item.url}`}>
          <Text
            color={useColorModeValue('light.text.active', 'dark.text.active')}
            _hover={{ textDecoration: 'underline' }}
          >
            Ver Todos
          </Text>
        </NavLink>
      </VStack>
    </Flex>
  )
}

const SidebarContent = ({ onClose, ...rest }) => {
  return (
    <Box
      bg={useColorModeValue('light.background.main', 'dark.background.main')}
      borderRight='1px' borderRightColor={useColorModeValue('light.divider.main', 'dark.divider.main')}
      pos='fixed'
      h='full' w='full'
      p={4}
      userSelect='none'
      {...rest}
    >
      <Flex h={24} alignItems='center' justifyContent='space-between'>
        {/* LOGO */}
        <NavLink to='/'>
          <Center color={useColorModeValue('light.text.active', 'dark.text.active')} cursor='pointer'>
            <Icon boxSize={10} as={GiShatteredGlass} />
            <Box ml={2} fontFamily='Finger Paint' fontSize={18}>
              <Text>Rincón</Text>
              <Text>Del Curao</Text>
            </Box>
          </Center>
        </NavLink>

        {/* CloseButton */}
        <IconButton
          onClick={onClose}
          bg='transparent'
          aria-label='close menu'
          _hover={{ color: useColorModeValue('light.text.active', 'dark.text.active') }}
          icon={<Icon boxSize={6} as={FiX} />}
        />
      </Flex>
      {
        linkItems.map((item, index) => (
          <SidebarItem key={index} item={item} onSidebarClose={onClose} />
        ))
      }
    </Box>
  )
}

const SidebarItem = ({ item, onSidebarClose, ...rest }) => {
  const { isOpen, onToggle } = useDisclosure()

  // TODO: Detectar en que pagina estamos y abrir esas categorias

  return (
    <Flex
      // alignItems={'left'}
      flexDir='column'
      onClick={item.categories && onToggle}
      cursor='pointer'
      {...rest}
    >
      <Flex
        py={4}
        justifyContent='space-between'
        alignItems='center'
        color={useColorModeValue('light.text.main', 'dark.text.main')}
      >
        <Text fontSize={18} fontWeight='medium'>{item.name}</Text>
        {
          item.categories && (
            <Icon
              boxSize={6} as={FiChevronDown}
              transition='all .25s ease-in-out'
              transform={isOpen ? 'rotate(180deg)' : ''}
            />
          )
        }
      </Flex>
      <Collapse in={isOpen} animateOpacity style={{ marginTop: '0!important' }}>
        <Stack
          pl={4}
          borderLeft='1px'
          borderStyle='solid'
          borderLeftColor={useColorModeValue('light.divider.main', 'dark.divider.main')}
        >
          {
            item.categories &&
            item.categories.map((category, index) => (
              <NavLink key={index} to={`${item.url}?category=${category.url}`} onClick={onSidebarClose}>
                <Text
                  color={useColorModeValue('light.text.secondary', 'dark.text.secondary')}
                  mb={2}
                  _hover={{ textDecoration: 'underline' }}
                >
                  {category.name}
                </Text>
              </NavLink>
            ))
          }
          <NavLink to={`${item.url}`} onClick={onSidebarClose}>
            <Text
              color={useColorModeValue('light.text.active', 'dark.text.active')}
              _hover={{ textDecoration: 'underline' }}
            >
              Ver Todos
            </Text>
          </NavLink>
        </Stack>
      </Collapse>
    </Flex>
  )
}

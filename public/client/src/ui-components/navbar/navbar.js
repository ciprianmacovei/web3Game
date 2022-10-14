import { useState, useEffect, useContext } from 'react';
import {
    Box,
    Flex,
    Avatar,
    Link,
    Button,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    MenuDivider,
    useDisclosure,
    useColorModeValue,
    Stack,
    useColorMode,
    Center,
    useToast
} from '@chakra-ui/react';
import { MoonIcon, SunIcon } from '@chakra-ui/icons';

import "./navbar.css";
import { userStore } from '../../store/store';

const NavLink = ({ children }) => (
    <Link
        px={2}
        py={1}
        rounded={'md'}
        _hover={{
            textDecoration: 'none',
            bg: useColorModeValue('gray.200', 'gray.700'),
        }}
        href={'#'}>
        {children}
    </Link>
);

export default function Nav() {
    const { colorMode, toggleColorMode } = useColorMode();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const user = userStore();

    const toast = useToast({
        position: 'top',
        title: 'Container style is updated',
        containerStyle: {
            width: '300px',
            maxWidth: '100%',
        },
    })

    useEffect(() => {
        getWalletConnect();
        const walletConnectSubscription = userStore.subscribe((state) => {
            if (state.errors && state.errors.wallet) {
                toast({
                    title: 'Wallet connected Error.',
                    description: `${state.errors.wallet}`,
                    status: 'error',
                    duration: 9000,
                    isClosable: true,
                })
            } else if (state.walletAddress) {
                const successToastId = 200;
                if (!toast.isActive(successToastId)) {
                    toast({
                        id: successToastId,
                        title: 'Wallet connected Successfully.',
                        description: "We've received your information.",
                        status: 'success',
                        duration: 9000,
                        isClosable: true,
                    })
                }
            }
        })

        return () => {
            walletConnectSubscription();
        }
    }, [])


    const connectToWallet = () => {
        user.connectToWallet();
    }

    const getWalletConnect = () => {
        user.getWalletAddress();
    }

    return (
        <div className="nav-bar-container">
            <Box bg={useColorModeValue('gray.100', 'gray.900')} px={4}>
                <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
                    <Box>Satoshi Runners</Box>

                    <Flex alignItems={'center'}>
                        <Stack direction={'row'} spacing={7}>
                            <Button onClick={toggleColorMode}>
                                {colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
                            </Button>
                            {
                                user.walletAddress ?
                                    <Menu>
                                        <MenuButton
                                            as={Button}
                                            rounded={'full'}
                                            variant={'link'}
                                            cursor={'pointer'}
                                            minW={0}>
                                            <Avatar
                                                size={'sm'}
                                                src={'https://avatars.dicebear.com/api/male/username.svg'}
                                            />
                                        </MenuButton>
                                        <MenuList alignItems={'center'}>
                                            <br />
                                            <Center>
                                                <Avatar
                                                    size={'2xl'}
                                                    src={'https://avatars.dicebear.com/api/male/username.svg'}
                                                />
                                            </Center>
                                            <br />
                                            <Center>
                                                <p>Username</p>
                                            </Center>
                                            <br />
                                            <MenuDivider />
                                            <MenuItem>Your Servers</MenuItem>
                                            <MenuItem>Account Settings</MenuItem>
                                            <MenuItem>Logout</MenuItem>
                                        </MenuList>
                                    </Menu> :
                                    <Button
                                        onClick={connectToWallet}
                                        colorScheme='orange'>
                                        Connect to wallet
                                    </Button>
                            }
                        </Stack>
                    </Flex>
                </Flex>
            </Box>
        </div>
    );
}

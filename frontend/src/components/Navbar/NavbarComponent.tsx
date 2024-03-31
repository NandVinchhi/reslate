"use client"

import {
    Box,
    Container,
    HStack,
    Button
  } from '@chakra-ui/react'
import { Logo } from '../Logo'
import { useRouter } from 'next/navigation'
import { logout } from '../SupabaseFunctions'

interface NavbarProps {
    showButtons: boolean
    isLoggedIn: boolean
    
}
export const NavbarComponent = (props: NavbarProps) => {
    const router =  useRouter()

    return (
        <Box borderBottomWidth="1px" py="4" px="4" bg="bg.surface">
            <HStack justify="space-between">
                <Logo height={8}/>
                { props.showButtons && (
                    <>
                        { props.isLoggedIn ? (
                            <HStack spacing={{ base: '2', md: '4' }}>
                                <Button colorScheme="brand" onClick={() => {logout(); router.push("/")}} variant="solid">Logout</Button>
                            </HStack>
                        ) : (
                            <HStack spacing={{ base: '2', md: '4' }}>
                                <Button colorScheme="brand" onClick={() => router.push("/signup")} variant="solid">Sign up</Button>
                                <Button colorScheme="brand" onClick={() => router.push("/login")} variant="outline">Log in</Button>
                            </HStack>
                        )}
                    </>
                ) }
            </HStack>
        </Box>
    )
}
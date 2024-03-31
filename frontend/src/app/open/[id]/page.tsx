'use client'

import {
    Box, HStack, Button, Text
  } from '@chakra-ui/react'
  
import { NavbarComponent  } from '@/components/Navbar/NavbarComponent'

import { useEffect } from 'react'
import { getSession } from '@/components/SupabaseFunctions'
import { useRouter } from 'next/navigation'

const Home = () => {
  const router = useRouter()
  useEffect(() => {
    getSession().then(result => {
        if (!result.data.session) {
            router.push("/login")
        }
    })
  }, [])
  return (
    <Box as="section" minH="md">
      <NavbarComponent showButtons={true} isLoggedIn={true}/>
      <Box borderBottomWidth="1px" py="4" px="4" bg="bg.surface">
            <HStack spacing="2">
                  <Text>App 1</Text>
                      <Button colorScheme="brand" onClick={() => {router.push("/")}} variant="solid">Logout</Button>
                  
            </HStack>
        </Box>
    </Box>
  )
}

export default Home
'use client'

import {
    Box
  } from '@chakra-ui/react'
  
import { NavbarComponent  } from '@/components/Navbar/NavbarComponent'
import { ForgotPasswordComponent } from '@/components/Auth/ForgotPasswordComponent'
import { useEffect } from 'react'
import { getSession } from '@/components/SupabaseFunctions'
import { useRouter } from 'next/navigation'

const Home = () => {

  const router = useRouter()
  useEffect(() => {
    getSession().then(result => {
        if (result.data.session) {
            router.push("/dashboard")
        }
    })
  }, [])
  return (
    <Box as="section" minH="md">
        <NavbarComponent isLoggedIn={false} showButtons={true}/>
        <ForgotPasswordComponent/>
    </Box>
  )

}

export default Home
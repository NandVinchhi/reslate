'use client'

import {
  Button,
  Container,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Link,
  Stack,
  Text,
  Center
} from '@chakra-ui/react'
import { useRouter } from 'next/navigation'

import { resetPassword } from '../SupabaseFunctions'
import { useState } from 'react'
  
export const ResetPasswordComponent = () => {
    const router = useRouter()
    const [password, setPassword] = useState("")
    const [confirm, setConfirm] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")


    return (
      <Container maxW="md" py={{ base: '16', md: '32' }}>
        <Stack spacing="8">
          <Stack spacing="6">
            <Stack spacing={{ base: '2', md: '3' }} textAlign="center">
              <Heading size={{ base: 'xs', md: 'sm' }}>Reset password</Heading>
              <Text color="fg.muted">Enter a new password for your account</Text>
            </Stack>
          </Stack>
          <Stack spacing="6">
            <Stack spacing="5">
              <FormControl>
                <FormLabel htmlFor="password">New password</FormLabel>
                <Input value={password} onChange={e => setPassword(e.target.value)} id="password" placeholder="********" type="password" />
              </FormControl>

              <FormControl>
                <FormLabel htmlFor="password">Confirm password</FormLabel>
                <Input value={confirm} onChange={e => setConfirm(e.target.value)} id="confirmpassword" placeholder="********" type="password" />
              </FormControl>
              
            </Stack>
            <Stack spacing="4">
              <Button onClick={async () => { 
              setLoading(true)
              setError("")
              const { data, error } = await resetPassword(password)
              if (data.user) {
                router.push("/dashboard")
              }
              else if (error) {
                setError(error.message)
              }
              setLoading(false) 
            }} isDisabled={password.length < 6 || confirm.length < 0 || password != confirm} isLoading={loading}>Reset</Button>
            </Stack>
          </Stack>
          <Text textStyle="sm" color="fg.muted">
            Don't have an account? <Link href="/signup"> Sign up</Link>
          </Text>
            <Center>
                <Text textStyle="sm" color="red">
                {error}
                </Text>
            </Center>
        </Stack>
      </Container>
    )
}
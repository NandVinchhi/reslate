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
import { sendResetEmail } from '../SupabaseFunctions'
import { useState } from 'react'
  
export const ForgotPasswordComponent = () => {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [success, setSuccess] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  return (
    <Container maxW="md" py={{ base: '16', md: '32' }}>
      <Stack spacing="8">
        <Stack spacing="6">
          <Stack spacing={{ base: '2', md: '3' }} textAlign="center">
            <Heading size={{ base: 'xs', md: 'sm' }}>Forgot password</Heading>
            <Text color="fg.muted">We'll send you a password reset link</Text>
          </Stack>
        </Stack>
        <Stack spacing="6">
          <Stack spacing="5">
            <FormControl>
              <FormLabel htmlFor="email">Email</FormLabel>
              <Input value={email} onChange={e => setEmail(e.target.value)} id="email" placeholder="Enter your email" type="email" />
            </FormControl>
            
          </Stack>
          <Stack spacing="4">
            <Button onClick={async () => {
              setLoading(true)
              setError("")
              setSuccess("")
              const {data, error} = await sendResetEmail(email)

              if (data) {
                setSuccess("Reset link sent successfully!")
              }
              else if (error) {
                setError(error.message)
              }
              setLoading(false)
            }} isLoading={loading} isDisabled={email.length == 0}>Confirm</Button>
          </Stack>
        </Stack>
        <Center>
          <Text textStyle="sm" color="fg.muted">
            Don't have an account? <Link href="/signup"> Sign up</Link>
          </Text>
        </Center>
        

        {error.length > 0 && (
           <Center>
            <Text textStyle="sm" color="red">
              {error}
            </Text>
          </Center>
        )}

        <Center>
          <Text textStyle="sm" color="green.600">
            {success}
          </Text>
        </Center>
      </Stack>
    </Container>
  )
}
'use client'

import {
  Button,
  Checkbox,
  Container,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Input,
  Link,
  Stack,
  Text,
  Center
} from '@chakra-ui/react'
import { GoogleIcon } from './ProviderIcons'
import { useRouter } from 'next/navigation'
import { googleButton, signIn } from '../SupabaseFunctions'
import { useState } from 'react'

export const LoginComponent = () => {
  const router = useRouter()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [rememberMe, setRememberMe] = useState(true)

  return (
    <Container maxW="md" py={{ base: '16', md: '32' }}>
      <Stack spacing="8">
        <Stack spacing="6">
          <Stack spacing={{ base: '2', md: '3' }} textAlign="center">
            <Heading size={{ base: 'xs', md: 'sm' }}>Log in to your account</Heading>
            <Text color="fg.muted">This is a login subtitle with some text</Text>
          </Stack>
        </Stack>
        <Stack spacing="6">
          <Stack spacing="5">
            <FormControl>
              <FormLabel htmlFor="email">Email</FormLabel>
              <Input value={email} onChange={e=> setEmail(e.target.value)} id="email" placeholder="Enter your email" type="email" />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="password">Password</FormLabel>
              <Input value={password} onChange={e=> setPassword(e.target.value)} id="password" placeholder="********" type="password" />
            </FormControl>
          </Stack>
          <HStack justify="space-between">
            <Checkbox isChecked={rememberMe} onChange={e => setRememberMe(e.target.checked)}>Remember me</Checkbox>
            <Button variant="text" size="sm" onClick={() => router.push("/forgotpassword")}>
              Forgot password
            </Button>
          </HStack>
          <Stack spacing="4">
            <Button onClick={async () => { 
              setLoading(true)
              setError("")
              const { data, error } = await signIn(email, password)
              if (data.session && data.user) {
                router.push("/dashboard")
              }
              else if (error) {
                setError(error.message)
              }
              setLoading(false) 
            }} isDisabled={email.length == 0 || password.length == 0} isLoading={loading}>Sign in</Button>
            <Button onClick ={() => googleButton()} variant="secondary" leftIcon={<GoogleIcon />}>
              Continue with Google
            </Button>
          </Stack>
        </Stack>
        <Center>
          <Text textStyle="sm" color="fg.muted">
            Don't have an account? <Link href="/signup"> Sign up</Link>
          </Text>
        </Center>
        <Center>
          <Text textStyle="sm" color="red">
            {error}
          </Text>
        </Center>
       
      </Stack>
    </Container>
  )
}
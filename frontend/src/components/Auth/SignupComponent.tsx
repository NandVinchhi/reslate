"use client";

import {
  Button,
  Container,
  FormControl,
  FormHelperText,
  FormLabel,
  Heading,
  Input,
  Link,
  Stack,
  Text,
  Center,
} from "@chakra-ui/react";
import { GoogleIcon } from "./ProviderIcons";
import { useRouter } from "next/navigation";
import { googleButton, signUp } from "../SupabaseFunctions";
import { useState } from "react";

export const SignupComponent = () => {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  return (
    <Container maxW="md" py={{ base: "16", md: "32" }}>
      <Stack spacing="8">
        <Stack spacing="6" align="center">
          <Stack spacing="3" textAlign="center">
            <Heading size={{ base: "xs", md: "sm" }}>Create an account</Heading>
            <Text color="fg.muted">
              This is a signup subtitle with some text
            </Text>
          </Stack>
        </Stack>
        <Stack spacing="6">
          <Stack spacing="5">
            <FormControl isRequired>
              <FormLabel htmlFor="email">Email</FormLabel>
              <Input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                id="email"
                type="email"
                placeholder="Enter your email"
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel htmlFor="password">Password</FormLabel>
              <Input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                id="password"
                type="password"
                placeholder="********"
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel htmlFor="password">Confirm password</FormLabel>
              <Input
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                id="confirmpassword"
                type="password"
                placeholder="********"
              />
              {password.length < 6 && (
                <FormHelperText color="fg.muted">
                  At least 6 characters long
                </FormHelperText>
              )}
              {password.length >= 6 && password != confirm && (
                <FormHelperText color="fg.muted">
                  Passwords must match
                </FormHelperText>
              )}
            </FormControl>
          </Stack>
          <Stack spacing="4">
            <Button
              onClick={async () => {
                setLoading(true);
                setError("");
                const { data, error } = await signUp(email, password);
                if (data.session && data.user) {
                  router.push("/dashboard");
                  console.log("User created");
                } else if (error) {
                  setError(error.message);
                  console.log(error);
                }
                setLoading(false);
              }}
              isDisabled={
                email.length == 0 ||
                password.length < 6 ||
                confirm.length < 0 ||
                password != confirm
              }
              isLoading={loading}
            >
              Create account
            </Button>
            <Button
              onClick={() => googleButton()}
              variant="secondary"
              leftIcon={<GoogleIcon />}
            >
              Continue with Google
            </Button>
          </Stack>
        </Stack>
        <Text textStyle="sm" color="fg.muted" textAlign="center">
          Already have an account? <Link href="/login">Log in</Link>
        </Text>
        <Center>
          <Text textStyle="sm" color="red">
            {error}
          </Text>
        </Center>
      </Stack>
    </Container>
  );
};

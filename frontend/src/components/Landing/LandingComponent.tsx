"use client";

import {
  Box,
  Button,
  Heading,
  Img,
  LightMode,
  Stack,
  Text,
  Center,
  useColorModeValue as mode,
} from "@chakra-ui/react";

import { useRouter } from "next/navigation";
import { Logo } from "../Logo";

export const LandingComponent = () => {
  const router = useRouter();

  return (
    <Box>
      <Box as="section" py="7.5rem">
        <Box
          maxW={{ base: "xl", md: "5xl" }}
          mx="auto"
          px={{ base: "6", md: "8" }}
        >
          <Box textAlign="center">
            <Center mb="8">
              <Logo height={28} />
            </Center>
            <Text fontSize="xl" mt="4" maxW="3xl" mx="auto">
              An immersive application that bridges language barriers in
              real-time for seamless cross-lingual communication.
            </Text>
          </Box>

          <Stack
            justify="center"
            direction={{ base: "column", md: "row" }}
            mt="10"
            mb="20"
            spacing="4"
          >
            <LightMode>
              <Button
                onClick={() => router.push("/signup")}
                size="lg"
                colorScheme="brand"
                px="8"
                fontWeight="bold"
                fontSize="md"
              >
                Sign up
              </Button>
              <Button
                onClick={() => router.push("/login")}
                size="lg"
                colorScheme="brand"
                px="8"
                fontWeight="bold"
                fontSize="md"
                variant="outline"
              >
                Log in
              </Button>
            </LightMode>
          </Stack>

          <Box
            className="group"
            cursor="pointer"
            position="relative"
            rounded="lg"
            overflow="hidden"
          >
            <Img
              alt="Screenshot of Onboarding section of Reslate"
              src="Landing.png"
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

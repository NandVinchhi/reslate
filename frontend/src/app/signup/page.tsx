"use client";

import { Box } from "@chakra-ui/react";

import { NavbarComponent } from "@/components/Navbar/NavbarComponent";
import { SignupComponent } from "@/components/Auth/SignupComponent";
import { useEffect } from "react";
import { getSession } from "@/components/SupabaseFunctions";
import { useRouter } from "next/navigation";

const Home = () => {
  const router = useRouter();
  useEffect(() => {
    getSession().then((result) => {
      if (result.data.session) {
        router.push("/dashboard");
      }
      console.log("result:", result);
    });
  }, []);
  return (
    <Box as="section" minH="md">
      <NavbarComponent isLoggedIn={false} showButtons={true} />
      <SignupComponent />
    </Box>
  );
};

export default Home;

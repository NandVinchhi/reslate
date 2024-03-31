"use client";

import { Box } from "@chakra-ui/react";

import { LandingComponent } from "@/components/Landing/LandingComponent";
import { getSession } from "@/components/SupabaseFunctions";
import { useEffect } from "react";
import { useRouter } from "next/navigation";


const Home = () => {
  const router = useRouter();
  useEffect(() => {
    getSession().then((result) => {
      if (result.data.session) {
        router.push("/dashboard");
      }
    });
  }, []);
  return (
    <Box as="section" minH="md">
      <LandingComponent />
    </Box>
  );
};

export default Home;

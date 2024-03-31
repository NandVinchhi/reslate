"use client";
import { AudioRecorder } from "../Input/AudioRecorder";
import { useRouter } from "next/navigation";
import {
  Center,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Heading,
  Image,
  Box,
  Container,
  Divider,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  Stack,
  Text,
  SimpleGrid,
  Spinner,
  Button,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  HStack,
} from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { FiSearch } from "react-icons/fi";
import { useState, useEffect } from "react";
import { useControllableProp, useControllableState } from "@chakra-ui/react";
import { getSession, onboardUser, apiUrl } from "../SupabaseFunctions";
import { METHODS, get } from "http";

// const trainingText: { [key: string]: string } = {
//   en: "In the heart of the city, a green-eyed cat reveals a secret garden at dusk, accessible only to those who believe in magic.",
//   de: "Im Herzen der Stadt offenbart eine grünäugige Katze bei Einbruch der Dämmerung einen geheimen Garten, zugänglich nur für diejenigen, die an Magie glauben.",
//   hi: "शहर के केंद्र में, एक हरी-आंखों वाली बिल्ली गोधूलि के समय एक गुप्त बगीचा प्रकट करती है, केवल उनके लिए जो जादू में विश्वास करते हैं।",
//   es: "En el corazón de la ciudad, un gato de ojos verdes revela un jardín secreto al anochecer, accesible solo para aquellos que creen en la magia.",
//   fr: "Au cœur de la ville, un chat aux yeux verts révèle un jardin secret au crépuscule, accessible uniquement à ceux qui croient en la magie.",
//   it: "Nel cuore della città, un gatto dagli occhi verdi rivela un giardino segreto al tramonto, accessibile solo a coloro che credono nella magia.",
//   ko: "도시의 중심에서, 초록 눈을 가진 고양이가 황혼 때 비밀 정원을 드러내며, 마법을 믿는 이들에게만 접근이 가능합니다.",
// };

const teksht = [
  [
    "en",
    "In the heart of the city, a green-eyed cat reveals a secret garden at dusk, accessible only to those who believe in magic.",
  ],
  [
    "de",
    "Im Herzen der Stadt offenbart eine grünäugige Katze bei Einbruch der Dämmerung einen geheimen Garten, zugänglich nur für diejenigen, die an Magie glauben.",
  ],
  [
    "hi",
    "शहर के केंद्र में, एक हरी-आंखों वाली बिल्ली गोधूलि के समय एक गुप्त बगीचा प्रकट करती है, केवल उनके लिए जो जादू में विश्वास करते हैं।",
  ],
  [
    "es",
    "En el corazón de la ciudad, un gato de ojos verdes revela un jardín secreto al anochecer, accesible solo para aquellos que creen en la magia.",
  ],
  [
    "fr",
    "Au cœur de la ville, un chat aux yeux verts révèle un jardin secret au crépuscule, accessible uniquement à ceux qui croient en la magie.",
  ],
  [
    "it",
    "Nel cuore della città, un gatto dagli occhi verdi rivela un giardino segreto al tramonto, accessibile solo a coloro che credono nella magia.",
  ],
  [
    "ko",
    "도시의 중심에서, 초록 눈을 가진 고양이가 황혼 때 비밀 정원을 드러내며, 마법을 믿는 이들에게만 접근이 가능합니다.",
  ],
];

export const DashboardComponent = () => {
  const router = useRouter();
  const entityName = "app";
  const [uuid, setUuid] = useState<string>("");
  const [recorded, setRecorded] = useState<boolean>(false);
  const [lang, setLang] = useState<string>("en");
  const [internalLang, setInternalLang] = useControllableState<string>({
    defaultValue: lang,
    onChange: setLang,
  });
  const [search, setSearch] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [audioURL, setAudioURL] = useState<string>("");

  const handleSearch = (newSearch: string) => {
    setSearch(newSearch);
  };

  useEffect(() => {
    getSession().then((result) => {
      setUuid(result.data.session.user.id);
    });
  }, []);

  const handleAudio = (k: any) => {
    setAudioURL(k);
  }

  return (
    
      <Center h="700px">
        <Card
          p={{ base: "6", md: "8" }}
          w="70%"
          overflow="hidden"
          variant="outline"
        >
          <Stack>
            <Heading size="md">Let's train your voice model</Heading>
            <Text py="2">Choose your desired language.</Text>
            <Menu>
              <MenuButton as={Button} variant="outline" fontSize="lg" rightIcon={<ChevronDownIcon />}>
                {lang ? lang : "Lang"}
              </MenuButton>
              <MenuList >
                <MenuItem onClick={() => setInternalLang("en")}>en</MenuItem>
                <MenuItem onClick={() => setInternalLang("de")}>de</MenuItem>
                <MenuItem onClick={() => setInternalLang("hi")}>hi</MenuItem>
                <MenuItem onClick={() => setInternalLang("es")}>es</MenuItem>
                <MenuItem onClick={() => setInternalLang("fr")}>fr</MenuItem>
                <MenuItem onClick={() => setInternalLang("it")}>it</MenuItem>
                <MenuItem onClick={() => setInternalLang("ko")}>ko</MenuItem>
              </MenuList>
            </Menu>

            <Text py="2">
              Hit the record button and read the text below. Make sure there's
              no background noise. You can also choose to upload a file.
            </Text>
            <Stack>
              <Text py="2" as="b" fontSize="2xl">
                {teksht.filter((set) => set[0] === internalLang)[0][1]}
              </Text>
              <AudioRecorder setRecorded={setRecorded} handleAudio={handleAudio} />
            </Stack>

            <Button
              variant="solid"
              colorScheme="blue"
              fontWeight="semibold"
              size="lg"
              mt="2"
              isDisabled={!recorded}
              onClick={() => {
                
                finishOnBoarding(
                  uuid,
                  lang,
                  audioURL
                );
                router.push("/video");
              }}
            >
              Finish
            </Button>
          </Stack>
        </Card>
      </Center>
  );
};

async function finishOnBoarding(uuid: string, lang: string, audioURL: string) {
  try {
    const response = await fetch(audioURL);
    const audioBlob = await response.blob();

    const formData = new FormData();
    formData.append('file', audioBlob, 'audio.mp3');

    const uploadResponse = await fetch(apiUrl + "/createvoice", {
      method: 'POST',
      body: formData
    });

    const data = await uploadResponse.json();
    console.log('Upload successful:', data);

    const onboardResponse = await onboardUser(uuid, lang, data.voice_id, data.prediction);
    console.log(onboardResponse);

    return;
  } catch (error) {
    console.error('Error during onboarding:', error);
    // Handle the error as needed
    throw error;
  }
}
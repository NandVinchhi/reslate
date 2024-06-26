"use client";
import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import "regenerator-runtime/runtime";
import Peer, { DataConnection } from "peerjs";
import { useEffect, useRef, useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Container,
  Image,
  Stack,
  Heading,
  Text,
  Button,
  VStack,
  HStack,
  Center,
  Input,
  InputGroup,
  InputLeftAddon,
  IconButton
} from "@chakra-ui/react";
import { CopyIcon } from "@chakra-ui/icons";
import { NavbarComponent } from "@/components/Navbar/NavbarComponent";
import { SpeechRecog }from "../../components/Dashboard/SpeechRecog.jsx";
import { getSession, getUserData, apiUrl } from "@/components/SupabaseFunctions";
import { BiSolidVideo, BiSolidPhone } from "react-icons/bi";

export default function Home() {
  const router = useRouter();
  const incomingPeerIdParams = useSearchParams();

  const [peerId, setPeerId] = useState<string>("");
  const [incomingPeerId, setIncomingPeerId] = useState<string>("");
  const [remotePeerIDValue, setRemotePeerIDValue] = useState<string>("");
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const currentUserVideoRef = useRef<HTMLVideoElement>(null);
  const peerInstance = useRef<Peer | null>(null);
  const myConn = useRef<DataConnection | null>(null);
  const [lang, setLang] = useState<string>("");

  const [sentence_id, set_sentence_id] = useState<string>("");

  const [copied, setCopied] = useState<boolean>(false);
  const [meetingStarted, setMeetingStarted] = useState<boolean>(false);

  const [uuid, setUuid] = useState<string>("");
  const [voiceId, setVoiceId] = useState<string>("");
  const [voiceClassif, setVoiceClassif] = useState<string>("");

  const [currentTranscription, setCurrentTranscription] = useState<string>("");

  function playAudioOnce(audioUrl: string) {
    // Create a new audio element
    const audio = new Audio(audioUrl);
  
    // Set up event listener to remove the audio element when playback ends
    audio.addEventListener('ended', () => {
      audio.remove();
      setCurrentTranscription("");
    });
  
    // Play the audio
    audio.play().catch(error => {
      console.error('Failed to play audio:', error);
    });

    
  }

  useEffect(() => {
    
    const peer = new Peer();
    peer.on("open", (id) => {
      setPeerId(id);
    });
    setIncomingPeerId(window.location.href.substring(35));
    setRemotePeerIDValue(window.location.href.substring(35));
    if (incomingPeerId) {
      setRemotePeerIDValue(incomingPeerId);
    }

    peer.on("connection", (conn) => {
      myConn.current = conn;
      
      conn.on("data", (data) => {
        console.log("Received data", data);
        handleData(data);
      });
    });

    peer.on("call", (call) => {
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: false })
        .then((stream) => {
          setMeetingStarted(true);
          setTimeout(() => {
            console.log("Stream: ", stream);
            if (currentUserVideoRef.current) {
              currentUserVideoRef.current.srcObject = stream;
              currentUserVideoRef.current.play();
            }
            call.answer(stream);
            call.on("stream", function (stream: any) {
              if (remoteVideoRef.current) {
                remoteVideoRef.current.srcObject = stream;
                remoteVideoRef.current.play();
              }
            });
          }, 500);
        })
        .catch((err) => {
          console.log("Failed to send local stream", err);
        });
    });

    peerInstance.current = peer;
  }, []);

  useEffect(() => {
    getSession().then((result) => {
      setUuid(result.data.session.user.id);
      getUserData(result.data.session.user.id).then(res1 => {
        console.log("WORKED", res1[0].lang);
        setLang(res1[0].lang);
        setVoiceId(res1[0].audio_id)
        setVoiceClassif(res1[0].classification)
      })
    });
  }, [])
  useEffect(() => {
    console.log("Meeting started: ", meetingStarted);
  }, [meetingStarted]);

  useEffect(() => {
    console.log(currentUserVideoRef.current, remoteVideoRef.current);
  }, [meetingStarted]);

  const handleData = (data: any) => {
    console.log("LANG", lang);
    let tempData = data;
    tempData.sentence_id = sentence_id;
    tempData.target_lang = lang;
    console.log(tempData);
    fetch(apiUrl + "/sendfull", {method: "POST", body: JSON.stringify(tempData)}).then(res => res.json()).then(result => {
      if (result.output_id) {
        setCurrentTranscription(result.translation);
        playAudioOnce(apiUrl + "/audio/" + result.output_id);
        set_sentence_id("");
        
      }
    })
  }

  const handlePartial = (data: any) => {
    console.log("LANG", lang);
    let tempData = data;
    tempData.target_lang = lang;
    console.log(tempData);
    fetch(apiUrl + "/sendpartial", {method: "POST", body: JSON.stringify(tempData)}).then(res => res.json()).then(result => {
      set_sentence_id(result.sentence_id)
    })
  }

  function call(otherPeerID: string) {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: false })
      .then((stream) => {
        console.log("Stream: ", stream);
        if (currentUserVideoRef.current) {
          currentUserVideoRef.current.srcObject = stream;
          currentUserVideoRef.current.play();
        }
        if (peerInstance.current) {
          const conn = peerInstance.current.connect(otherPeerID);
          myConn.current = conn;
          
          conn.on("data", (data: any) => {
            console.log("Received data", data);
            if (data.type == "sendpartial") {
              handlePartial(data);
            } else {
              handleData(data);
            }
          });
          const call = peerInstance.current.call(otherPeerID, stream);
          call.on("stream", function (stream: any) {
            if (remoteVideoRef.current) {
              remoteVideoRef.current.srcObject = stream;
              remoteVideoRef.current.play();
            }
            // setMeetingStarted(true);
          });
        }
      })
      .catch((err) => {
        console.log("Failed to get local stream", err);
      });
  }

  return (
    // <div>
    //   {!incomingPeerId && (
    //     <h1>Meeting link: {"http://localhost:3000/video?peerId=" + peerId}</h1>
    //   )}
    //   {!incomingPeerId && (
    //     <input
    //       type="text"
    //       value={remotePeerIDValue}
    //       onChange={(e) => setRemotePeerIDValue(e.target.value)}
    //     />
    //   )}
    //   <button onClick={() => call(remotePeerIDValue)}>Call</button>
    //   <div>
    //     <video ref={currentUserVideoRef} />
    //   </div>
    //   <div>
    //     <video ref={remoteVideoRef} />
    //   </div>
    // </div>
    <>
      {!meetingStarted && (
        <NavbarComponent showButtons={true} isLoggedIn={true} />
      )}
      <VStack h="700" align="center">
        {!incomingPeerId && !meetingStarted && (
          <>
            <Center>
              <Card
                w="110%"
                p={{ base: "6", md: "8" }}
                my={{ base: "48", sm: "60" }}
                direction={{ base: "column", sm: "row" }}
                overflow="hidden"
                variant="outline"
              >
                <Stack>
                  <CardBody>
                    <Heading size="md">Create your meeting room</Heading>
                    <VStack align="center">
                      <Text py="2" mt="3">
                        Share this link with others to join your meeting room
                      </Text>
                    </VStack>
                    <InputGroup>
                      <InputLeftAddon
                        onClick={async () => {
                          try {
                            await navigator.clipboard
                              .writeText(
                                "http://localhost:3000/video?peerId=" + peerId
                              )
                              .then(() => {
                                setCopied(true);
                              });
                            console.log("Content copied to clipboard");
                          } catch (err) {
                            console.error("Failed to copy: ", err);
                          }
                        }}
                      >
                        <CopyIcon />
                      </InputLeftAddon>
                      <Input
                        type="text"
                        placeholder={
                          "http://localhost:3000/video?peerId=" + peerId
                        }
                        isDisabled={true}
                      />
                    </InputGroup>
                    {/* <Text py="2">
                Your meeting link is{" "}
                <strong>
                  {"http://localhost:3000/video?peerId=" + peerId}
                </strong>
              </Text> */}
                    <Text pt="2" align="center" color="green.500">
                      {copied ? "Copied!" : ""}
                    </Text>
                  </CardBody>
                </Stack>
              </Card>
            </Center>
          </>
        )}
        {incomingPeerId && !meetingStarted && (
          
          <>
            <Center>
              <Card
                w="110%"
                p={{ base: "6", md: "8" }}
                my={{ base: "48", sm: "60" }}
                direction={{ base: "column", sm: "row" }}
                overflow="hidden"
                variant="outline"
              >
                <Stack>
                  <CardBody>
                    <Heading size="md">You are about to join a meeting</Heading>
                    <VStack align="center">
                      <Button
                        mt={{ base: "4", md: "6" }}
                        variant="solid"
                        onClick={() => {
                          call(remotePeerIDValue);
                          setMeetingStarted(true);
                        }}
                      >
                        Attend Meeting
                      </Button>
                    </VStack>
                  </CardBody>
                </Stack>
              </Card>
            </Center>
          </>
        )}
        {meetingStarted && (
          <VStack>
            
            <HStack mt="2" >
            <div style={{borderRadius: "16px", width: "800px", objectFit: "cover"}}>
              
              <video style={{zIndex: 0, borderRadius: "16px", minWidth: "100%", minHeight: "100%", objectFit: "cover"}} ref={currentUserVideoRef} />
            </div>
            <div style={{width: "800px", objectFit: "cover"}}>
              <video style={{borderRadius: "16px", minWidth: "100%", minHeight: "100%", objectFit: "cover"}} ref={remoteVideoRef} />
            </div>
            </HStack>
            
            <HStack mt="3">
              
            <SpeechRecog handleFinal = {(e: string) => {
              if (myConn.current) {
                myConn.current.send({"type": "sendfull", "words": e, "voice_id": voiceId, "voice_class": voiceClassif});
              }
            }} handlePartial = {(e: string) => {
              if (myConn.current) {
                myConn.current.send({"type": "sendpartial", "words": e, "voice_id": voiceId, "voice_class": voiceClassif});
              }
            }} lang={lang} />

<IconButton size="2xl" colorScheme='gray'
      aria-label='Search database'
      icon={<BiSolidVideo size={32}/>}></IconButton>

<IconButton size="2xl" colorScheme='red' onClick={() => {router.push("/video/");

setTimeout(() => window.location.reload(), 200)}}
      aria-label='Search database'
      icon={<BiSolidPhone size={32}/>}></IconButton>
            </HStack>
            
            <Text mt="4" fontSize={"xl"}>{currentTranscription}</Text>
          </VStack>
        )}
      </VStack>
    </>
  );
}

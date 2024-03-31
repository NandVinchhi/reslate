"use client";
import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import "regenerator-runtime/runtime";
import Peer from "peerjs";
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
} from "@chakra-ui/react";
import { CopyIcon } from "@chakra-ui/icons";
import { NavbarComponent } from "@/components/Navbar/NavbarComponent";

export default function Home() {
  const router = useRouter();
  const incomingPeerIdParams = useSearchParams();

  const [peerId, setPeerId] = useState<string>("");
  const [incomingPeerId, setIncomingPeerId] = useState<string>("");
  const [remotePeerIDValue, setRemotePeerIDValue] = useState<string>("");
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const currentUserVideoRef = useRef<HTMLVideoElement>(null);
  const peerInstance = useRef<Peer | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [meetingStarted, setMeetingStarted] = useState<boolean>(false);

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

    peer.on("call", (call) => {
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: false })
        .then((stream) => {
          setMeetingStarted(true);
          setTimeout(() => {
            console.log("Stream: ", stream);
            console.log("BREAKPOINT A", currentUserVideoRef.current);
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
    console.log("Meeting started: ", meetingStarted);
  }, [meetingStarted]);

  useEffect(() => {
    console.log(currentUserVideoRef.current, remoteVideoRef.current);
  }, [meetingStarted]);

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
                      <Text py="2">
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
          // <Container>
          //   <Button variant="solid" onClick={() => call(remotePeerIDValue)}>
          //     Call
          //   </Button>
          //   <div>
          //     <video ref={currentUserVideoRef} />
          //   </div>
          //   <div>
          //     <video ref={remoteVideoRef} />
          //   </div>
          // </Container>
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
          <div>
            <div>
              <video ref={currentUserVideoRef} />
            </div>
            <div>
              <video ref={remoteVideoRef} />
            </div>
          </div>
        )}
      </VStack>
    </>
  );
}

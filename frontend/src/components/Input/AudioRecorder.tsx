"use client";
import React, { useRef } from "react";
import {
  Box,
  Button,
  IconButton,
  HStack,
  Icon,
  Stack,
  Text,
  useToken,
} from "@chakra-ui/react";
import { FaPlay, FaPause, FaUpload } from "react-icons/fa";
import { AiOutlineClose } from "react-icons/ai";
import { PiWaveformBold } from "react-icons/pi";
import { useState, useEffect } from "react";
import WaveSurfer from "wavesurfer.js";

export const AudioRecorder = ({ setRecorded }: any) => {
  const [recording, setRecording] = useState(false);
  const [duration, setDuration] = useState(0);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const intervalRef = useRef<number | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const waveSurferRef = useRef<any>(null); // Reference to hold the WaveSurfer instance
  const waveformRef = useRef<HTMLDivElement | null>(null); // Reference to the container div
  const [brand500] = useToken("colors", ["brand.500"]);
  const [playing, setPlaying] = useState<boolean>(false);

  useEffect(() => {
    // Check if audioURL is present, then create a WaveSurfer instance
    if (audioURL) {
      waveSurferRef.current = WaveSurfer.create({
        container: waveformRef.current!,
        waveColor: "#CBD5E0",
        progressColor: brand500,
        // Set a bar width
        barWidth: 2,
        barHeight: 2,
        // Optionally, specify the spacing between bars
        barGap: 1,
        // And the bar radius
        barRadius: 2,
      });

      waveSurferRef.current.load(audioURL);
    }

    return () => {
      if (waveSurferRef.current) {
        waveSurferRef.current.destroy();
      }
    };
  }, [audioURL]);

  useEffect(() => {
    setRecorded(!!audioURL);
  }, [audioURL]);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
    });

    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorderRef.current = mediaRecorder;

    const audioChunks: Blob[] = [];
    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        audioChunks.push(event.data);
      }
    };

    mediaRecorder.onstop = () => {
      const audioBlob = new Blob(audioChunks);
      const audioUrl = URL.createObjectURL(audioBlob);
      setAudioURL(audioUrl);
      setPlaying(false);
    };

    mediaRecorder.start();

    intervalRef.current = window.setInterval(() => {
      setDuration((prev) => prev + 1);
    }, 1000);

    setRecording(true);
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      window.clearInterval(intervalRef.current!);
      setRecording(false);
      setRecorded(true);
    }
  };

  const handlePlayPause = () => {
    if (waveSurferRef.current) {
      if (waveSurferRef.current.isPlaying()) {
        waveSurferRef.current.pause();
        setPlaying(false);
      } else {
        waveSurferRef.current.play();
        setPlaying(true);
      }
    }
  };

  const handleFileChange = (event: any) => {
    const file = event.target.files[0];

    if (file) {
      const objectURL = URL.createObjectURL(file);

      setAudioURL(objectURL);

      const audio = new Audio();
      audio.src = objectURL;
      audio.onloadedmetadata = () => {
        setDuration(Math.round(audio.duration));
      };
    }
  };

  const reset = () => {
    setDuration(0);
    setAudioURL(null);
    setPlaying(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <Box
      borderWidth={{ base: "0", md: "1px" }}
      p={{ base: "0", md: "4" }}
      borderRadius="lg"
    >
      <div id="container"></div>
      {!audioURL ? (
        <>
          {recording ? (
            <HStack>
              <Button onClick={stopRecording} colorScheme="teal">
                Stop
              </Button>
              <Box ml="2" fontSize="sm">
                <Text color="emphasized" fontWeight="medium">
                  {formatTime(duration)}
                </Text>
              </Box>
            </HStack>
          ) : (
            <HStack spacing={2}>
              <input
                type="file"
                style={{ display: "none" }}
                accept="audio/*"
                ref={inputRef}
                onChange={handleFileChange}
              />
              <Button leftIcon={<PiWaveformBold />} onClick={startRecording}>
                Record
              </Button>

              <Button
                leftIcon={<FaUpload />}
                onClick={() => {
                  inputRef.current?.click();
                }}
                colorScheme="teal"
              >
                Upload
              </Button>
            </HStack>
          )}
        </>
      ) : (
        <div>
          <div ref={waveformRef} id="waveform"></div>
          <Stack justify="space-between" direction="row" spacing="5">
            <HStack spacing="3">
              <IconButton
                variant={"ghost"}
                aria-label="play"
                icon={playing ? <FaPause /> : <FaPlay />}
                onClick={handlePlayPause}
              />

              <Box fontSize="sm">
                <Text color="emphasized" fontWeight="medium">
                  {formatTime(duration)}
                </Text>
              </Box>
            </HStack>
            <IconButton
              color="gray"
              variant={"ghost"}
              onClick={reset}
              aria-label="play"
              icon={<AiOutlineClose />}
            />
          </Stack>
        </div>
      )}
    </Box>
  );
};

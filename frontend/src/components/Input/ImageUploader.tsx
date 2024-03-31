"use client";
import React, { useRef } from "react";
import {
    Box,
    Button,
    IconButton,
    HStack,
    Icon,
    Stack,
    Image,
    Text,
    useToken,
    Square
} from "@chakra-ui/react";
import { FaUpload } from "react-icons/fa";
import { AiOutlineClose } from "react-icons/ai";
import { FiImage } from "react-icons/fi";
import { useState, useEffect } from "react";
import WaveSurfer from "wavesurfer.js";

export const ImageUploader: React.FC = () => {
   
    const inputRef = useRef<HTMLInputElement | null>(null);
    const [imageURL, setImageURL] = useState<string | null>(null);
    const [name, setName] = useState<string | null>(null);
    const [size, setSize] = useState<number>(0);

    const bytesToSize = (bytes: number): string => {
        const sizes: string[] = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    
        if (bytes === 0) return '0 Byte';
        if (bytes < 0) return 'Invalid Size';  // Handle negative values if necessary
    
        const i: number = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)).toString(), 10);
        return Math.round(bytes / Math.pow(1024, i)).toString() + ' ' + sizes[i];
    }

    const handleFileChange = (event: any) => {
        const file = event.target.files[0];
        
        if (file) {
            const objectURL = URL.createObjectURL(file);
            setName(file.name);
            setSize(parseInt(file.size))
            setImageURL(objectURL);
        }
    };

    const reset = () => {
       setImageURL(null);
       setName(null)
       setSize(0)
    };


    return (
        <Box
            borderWidth={{ base: "0", md: "1px" }}
            p={{ base: "0", md: "4" }}
            borderRadius="lg"
        >
            <div id="container"></div>
            {!imageURL ? (
                <>
                    
                    <HStack spacing={2}>
                        <input 
                            type="file" 
                            style={{display: "none"}}
                            accept="image/*" 
                            ref={inputRef}
                            onChange={handleFileChange} 
                        />
                        
                        <Button
                            leftIcon={<FaUpload />}
                            onClick={() => {inputRef.current?.click()}}
                            colorScheme='teal'
                        >
                            Upload
                        </Button>
                    </HStack>
                </>
            ) : (
                <Stack justify="space-between" direction={{ base: 'column', md: 'row' }} spacing="5">
              <HStack spacing="3">
                <Image src={imageURL} height="10" borderRadius="lg">
                 
                </Image>
                <Box fontSize="sm">
                  <Text color="empahsized" fontWeight="medium">
                    {name}
                  </Text>
                  <Text color="fg.muted">{bytesToSize(size)}</Text>
                </Box>
              </HStack>
              <Stack spacing="3" direction={{ base: 'column-reverse', md: 'row' }}>
                <Button colorScheme="red" onClick={reset} size="sm">Remove</Button>
              </Stack>
            </Stack>
            )}
        </Box>
    );
};

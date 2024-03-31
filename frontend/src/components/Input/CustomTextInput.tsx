import React, { useState, useRef } from 'react';
import { Box, Button, HStack, VStack, Textarea } from '@chakra-ui/react';

interface CustomTextInputProps {
    attributes: string[]
}

export const CustomTextInput  = (props: CustomTextInputProps) => {

    const [text, setText] = useState<string>("")
    const handleChange = (e: any) => {
        const lastChar: string = e.target.value[e.target.value.length - 1]
        if (lastChar != "}" && lastChar != "{") {
            setText(e.target.value)
        } else if (e.target.value.length < text.length) {
            setText(e.target.value)
        }
    }

    const handleAttributeInsertion = (e: string) => {
        setText(text + "{" + e + "}")
    }

    return (
        <>
        <Textarea value={text} onChange={handleChange}>

        </Textarea>
            <HStack mt="2">
                {props.attributes.map((attr, index) => (
                    <Button size="xs" key={index} onClick={() => handleAttributeInsertion(attr)}>
                        {attr}
                    </Button>
                ))}
            </HStack>
        </>
    );
}
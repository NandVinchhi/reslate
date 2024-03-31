"use client";

import {
  Box,
  Center,
  Stack,
  Text,
  useToken,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  HStack,
  Input,
  Button,
  ModalCloseButton,
} from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import { useState, useEffect, useCallback } from "react";
import { createEntity } from "../SupabaseFunctions";

interface AddCardProps {
  addEntity(card: any): void;
}

export const AddCard = (props: AddCardProps) => {
  const [brand500] = useToken("colors", ["brand.500"]);

  const [createModal, setCreateModal] = useState<boolean>(false);
  const [createLoading, setCreateLoading] = useState<boolean>(false);
  const [name, setName] = useState<string>("");

  const onCreate = () => {
    setCreateLoading(true);
    createEntity(name)
      .then((res) => {
        if (res.data) {
          props.addEntity(res.data[0]);
        }
      })
      .catch((e) => {});
    setCreateLoading(false);
    setCreateModal(false);
    setName("");
  };
  return (
    <>
      <Modal
        isCentered
        size="sm"
        isOpen={createModal}
        onClose={() => {
          setCreateModal(false);
          setCreateLoading(false);
          setName("");
        }}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Let's get started</ModalHeader>

          <ModalBody mb={4}>
            <HStack w="full">
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                w="full"
                placeholder="Enter name"
              ></Input>
              <Button
                isLoading={createLoading}
                isDisabled={name.length == 0}
                colorScheme="brand"
                onClick={onCreate}
              >
                Create
              </Button>
            </HStack>
          </ModalBody>
        </ModalContent>
      </Modal>

      <Box
        onClick={() => setCreateModal(true)}
        h="106px"
        _hover={{
          color: "brand.500",
          border: "1px solid " + brand500,
          cursor: "pointer",
        }}
        color="fg.muted"
        border="1px solid #E2E8F0"
        bg="transparent"
        borderRadius="lg"
      >
        <Center>
          <Stack direction="column">
            <Center mt={7}>
              <AddIcon boxSize={5} />
            </Center>

            <Text textStyle="sm">Create new</Text>
          </Stack>
        </Center>
      </Box>
    </>
  );
};

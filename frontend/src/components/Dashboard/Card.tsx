import { Box, IconButton, Stack, Text, Tooltip, useToken, Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter, HStack, Input, Button } from '@chakra-ui/react'
import { FiEdit2, FiTrash2 } from 'react-icons/fi'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { deleteEntity, renameEntity } from '../SupabaseFunctions'

interface CardProps {
    id: number,
    title: string,
    createdDate: Date,
    deleteEntity(id: number): void,
    updateEntity(id: number, newName: string): void
}

export const Card = (props: CardProps) => {
    const [brand500] = useToken('colors', ['brand.500'])
    const months: string[] = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    const router = useRouter()

    const [deleteModal, setDeleteModal] = useState<boolean>(false)
    const [deleteLoading, setDeleteLoading] = useState<boolean>(false)
    const [confirmDelete, setConfirmDelete] = useState<string>("")
    const onDelete = async () => {
        setDeleteLoading(true)
        await deleteEntity(props.id)
        setDeleteLoading(false)
        setDeleteModal(false)
        setConfirmDelete("")
        props.deleteEntity(props.id)
    }

    const [renameModal, setRenameModal] = useState<boolean>(false)
    const [renameLoading, setRenameLoading] = useState<boolean>(false)
    const [newName, setNewName] = useState<string>("")
    const onRename = async () => {
        setRenameLoading(true)
        await renameEntity(props.id, newName);
        setRenameLoading(false)
        setRenameModal(false)
        setNewName("")
        props.updateEntity(props.id, newName)
    }

    return (
        <>
            <Modal isCentered size="sm" isOpen={renameModal} onClose={() => {
                setRenameModal(false)
                setRenameLoading(false)
                setNewName("")
            }}>
                <ModalOverlay />
                <ModalContent>
                <ModalHeader>Rename</ModalHeader>

                <ModalBody mb={4}>
                    <HStack w="full">
                        <Input value={newName} onChange={e => setNewName(e.target.value)} w="full" placeholder='Enter a new name'></Input>
                        <Button isLoading={renameLoading} isDisabled={newName.length == 0} colorScheme='brand' onClick={onRename}>
                            Confirm
                        </Button>
                    </HStack>
                    
                </ModalBody>
                </ModalContent>
            </Modal>

            <Modal isCentered size="sm" isOpen={deleteModal} onClose={() => {
                setDeleteModal(false)
                setDeleteLoading(false)
                setConfirmDelete("")
            }}>
                <ModalOverlay />
                <ModalContent>
                <ModalHeader>Confirm delete</ModalHeader>

                <ModalBody mb={4}>
                    <HStack w="full">
                        <Input value={confirmDelete} onChange={e => setConfirmDelete(e.target.value)} w="full" placeholder={"Enter '" + props.title + "'"}></Input>
                        <Button isLoading={renameLoading} isDisabled={props.title != confirmDelete} colorScheme='red' onClick={onDelete}>
                            Delete
                        </Button>
                    </HStack>
                    
                </ModalBody>
                </ModalContent>
            </Modal>
            <Box onClick={() => router.push("/open/" + props.id)} h="106px" _hover={{ border: "1px solid " + brand500, cursor: "pointer"}} border= "1px solid #EDF2F7" boxShadow="sm" bg="white" borderRadius="lg" p={{ base: '4', md: '6' }}>
                <Stack justify="space-between" direction="row" spacing="4">
                    <Stack spacing="1">
                        <Text textStyle="lg" fontWeight="medium">
                            {props.title.substring(0, 20) + (props.title.length > 20 ? "..." : "")}
                        </Text>
                        <Text textStyle="sm" color="fg.muted">
                            Created on {months[props.createdDate?.getMonth()]} {props.createdDate?.getDate()}, {props.createdDate?.getFullYear()}
                        </Text>
                    </Stack>
                    <Stack direction={{ base: 'column', sm: 'row' }} spacing={{ base: '0', sm: '1' }}>
                        <Tooltip label="Rename" aria-label='Rename'>
                            <div><IconButton onClick={e => {e.stopPropagation(); setRenameModal(true)}} icon={<FiEdit2 />} variant="tertiary" aria-label="Edit experience" /></div>
                        </Tooltip>
                        <Tooltip label="Delete" aria-label='Delete'>
                            <div><IconButton onClick={e => {e.stopPropagation(); setDeleteModal(true)}} icon={<FiTrash2 />} variant="tertiary" aria-label="Delete experience" /></div>
                        </Tooltip>
                    </Stack>
                </Stack>
            </Box>
        </>
    )
}
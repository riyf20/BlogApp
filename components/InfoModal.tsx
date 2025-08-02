import React from 'react'
import {ButtonText,
    Button,
    Text,
    Modal,
    CloseIcon,
    Icon,
    ModalBackdrop,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    Heading} 
from '@gluestack-ui/themed';

// Informational modal | to make sure users want to confirm certain actions 
const InfoModal = ({showModal, setShowModal, heading, body, buttonText, parent, confirmFunction}:InfoModal) => {
  return (
    <Modal
        isOpen={showModal}
        onClose={() => {
            setShowModal(false)
        }}
        size="lg"
    >
        <ModalBackdrop />

        <ModalContent>
            <ModalHeader>
                <Heading size="md" className="text-typography-950">
                    {heading}
                </Heading>
                
                <ModalCloseButton>
                    <Icon
                        as={CloseIcon}
                        size="md"
                        className="stroke-background-400 group-[:hover]/modal-close-button:stroke-background-700 
                        group-[:active]/modal-close-button:stroke-background-900 group-[:focus-visible]/modal-close-button:stroke-background-900"
                    />
                </ModalCloseButton>
            </ModalHeader>

            <ModalBody>
                <Text size="sm" className="text-typography-500">
                {body}
                </Text>
            </ModalBody>

            <ModalFooter className='gap-2'>
                <Button
                    variant={parent=='profile' ? "solid" : "outline"}
                    action={parent=='profile' ? "negative" : "secondary"}
                    onPress={() => {
                        setShowModal(false)
                    }}
                >
                    <ButtonText>Cancel</ButtonText>
                </Button>
                
                {parent=='signin' ?
                    <Button
                    onPress={confirmFunction}
                    variant="solid"
                    action="positive"
                    bg="#1C2B33"
                    >
                        <ButtonText>{buttonText}</ButtonText>
                    </Button>
                    :
                    <Button
                        onPress={confirmFunction}
                        variant="solid"
                        action="positive"
                    >
                        <ButtonText>{buttonText}</ButtonText>
                    </Button>
                }

            </ModalFooter>

        </ModalContent>
        
    </Modal>
  )
}

export default InfoModal
import React from 'react'
import { ActivityIndicator } from 'react-native';
import {ButtonText, Button, Text, Modal,
    CloseIcon, Icon, ModalBackdrop,
    ModalBody, ModalCloseButton, ModalContent,
    ModalFooter, ModalHeader, Heading} 
from '@gluestack-ui/themed';
import ImageCard from './ImageCard';
import { useHapticFeedback as haptic} from '@/components/HapticTab';



// Informational modal | to make sure users want to confirm certain actions 
const InfoModal = ({showModal, setShowModal, heading, body, buttonText, parent, confirmFunction, imgUri}:InfoModal) => {
  return (
    <Modal
        isOpen={showModal}
        onClose={() => {
            setShowModal(false)
        }}
        size="lg"
        // Disables close on create as it is posting the blog
        closeOnOverlayClick={parent==='create' ? false : true}
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

                {/* Will render image thumbnail if called from imageuploader */}
                {parent === 'image' && imgUri && (
                   
                    <ImageCard uri={imgUri} onPress={() => null} index={0} onLongPress={() => void 0} parent={'delete'}/>
                       
                )}

                {/* Will render a loading icon is called from create */}
                {parent==='create' &&
                <ActivityIndicator size={'large'} className='justify-center mt-6'/>
                }

            </ModalBody>

            <ModalFooter className='gap-2'>

                {/* Will render no buttons for create */}
                {parent!=='create' && 

                    <>
                        {/* Cancel button | Different color based on profile page or not */}
                        <Button
                            variant={parent=='profile' ? "solid" : "outline"}
                            action={parent=='profile' ? "negative" : "secondary"}
                            onPress={() => {
                                setShowModal(false)
                            }}
                        >
                            <ButtonText>Cancel</ButtonText>
                        </Button>
                        
                        {/* Primary button | Different based on component that called it */}
                        {parent=='signin' ?
                            <Button
                            onPress={confirmFunction}
                            onPressIn={haptic()}
                            variant="solid"
                            action="positive"
                            bg="#1C2B33"
                            >
                                <ButtonText>{buttonText}</ButtonText>
                            </Button>
                        : parent==='image' || parent==='post' || parent==='comment' || parent==='commentUnsaved' || parent==='commentReport'?
                            <Button
                            onPressIn={haptic()}
                            onPress={confirmFunction}
                            variant="solid"
                            action="negative"
                            >
                                <ButtonText>{buttonText}</ButtonText>
                            </Button>
                        :
                        <Button
                            onPress={confirmFunction}
                            variant="solid"
                            action="positive"
                            onPressIn={haptic()}
                        >
                            <ButtonText>{buttonText}</ButtonText>
                        </Button>
                        }
                    </>
                }
            </ModalFooter>

        </ModalContent>
        
    </Modal>
  )
}

export default InfoModal
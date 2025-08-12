import React, { useState, useRef } from 'react'
import { View, ScrollView } from 'react-native'
import {AlertCircleIcon, Button, DownloadIcon, 
  FormControl, FormControlError, Text, 
  FormControlErrorIcon, FormControlErrorText, 
} from '@gluestack-ui/themed';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { router } from 'expo-router';
import FormInput from '@/components/FormInput';
import Bottom from '@/components/Bottom';
import ImageCard from '@/components/ImageCard';
import InfoModal from '@/components/InfoModal';
import { useAuthStore } from '@/utils/authStore';
import { postBlog, postImage } from '@/services/auth';
import { useHapticFeedback as haptic } from '@/components/HapticTab';


const create = () => {

  // Persisted data
  const {token, username} = useAuthStore();

  // Valid state for the main parent form (FormControl)
  const [invalid, setInvalid] = useState(false);

  // Error message for parent form or input variables
  const [error, setError] = useState('');
  
  // Title variable | title valid state
  const [title, setTitle] = useState('');
  const [titleInvalid, setTitleInvalid] = useState(false);
  
  // Body variable | body valid state
  const [body, setBody] = useState('');
  const [bodyInvalid, setBodyInvalid] = useState(false);

  // Image array
  const [images, setImages] = useState<ImageItem[]>([])

  // Reference to use functions for the bottom sheet | sends function backwards
  const bottomRef = useRef<BottomSheetHandle>(null);

  // Modal to show that blog is submitting | loading phase
  const [submitModal, setSubmitModal] = useState(false)

  // Sends post to backend
  const handlePostBlog = async () => {

    // Logic checks
    const requiredFields = [
      { value: title, setInvalid: setTitleInvalid },
      { value: body, setInvalid: setBodyInvalid },
    ];

    let hasEmptyField = false;

    // Loops through all fields to check if empty --> show error if true
    requiredFields.forEach(({ value, setInvalid }) => {
      if (!value.trim()) {
          setInvalid(true);
          hasEmptyField = true;
      }
    });

    if (hasEmptyField) {
      setInvalid(true);
      setError("Missing fields must be filled in.");
      return;
    }

    // Shows loading modal
    setSubmitModal(true)

    // Attempts blog post
    try {

      // Sends blog information
      const blogResponse = await postBlog(username, token, title, body)

      // Stores new blog's id
      const newBlogId = blogResponse.blogId;

      // Will send images to backend if any | loops through the array
      if(images.length > 0) {
        try {
          await Promise.all(
            images.map(image => {

              // Removes 'data:image64' as the backend handles that
              let base64Data = image.base64;
              if (base64Data.startsWith("data:image")) {
                base64Data = base64Data.split(",")[1];
              }
              postImage(newBlogId, username, base64Data, token)

            })
        );
        } catch (err:any) {
          console.error("Error occured | Image posting: ", err.message)
        }
      }

      // Closes loading modal --> sends to homepage --> then to new blog
      setSubmitModal(false)
      router.back()
      router.replace('/');
      router.push(`/blog/${newBlogId}`)

    } catch (err:any) {
      console.error("Error occured | Blog posting: ", err.message)
    }
  }

  return (

    // Needed for bottom sheet
    <GestureHandlerRootView>
    <View className="flex-1 bg-dark-100">

      <View className="justify-center items-center flex-row mt-20 px-4 mb-4">
        <Text color='$white' size='2xl' className="self-center" bold={true} >Create New Blog</Text>
      </View>

      <View className='items-center bg-white border border-transparent rounded-xl flex-1'>
        <ScrollView 
        className='w-[90%]' 
        contentContainerStyle={{
            justifyContent:"center",
            alignItems:"center",
            paddingBottom: 200,
        }}
        showsVerticalScrollIndicator={false}
        >

          {/* Title and body input section */}
          <FormControl className="p-4 border border-transparent rounded-xl bg-dark-100 w-full gap-6 pb-8 mt-6" isInvalid={invalid} >

              <FormInput invalid={titleInvalid} placeholder={"Title"} value={title} parentInvalid={invalid} setValue={setTitle} setValueInvalid={setTitleInvalid} setParentInvalid={setInvalid} error={error}/>

              <FormInput invalid={bodyInvalid} placeholder={"Your Amazing story here..."} value={body} parentInvalid={invalid} setValue={setBody} setValueInvalid={setBodyInvalid} setParentInvalid={setInvalid} error={error} textarea={true}/>

            {invalid &&
                <FormControlError>
                    <FormControlErrorIcon as={AlertCircleIcon} />
                    <FormControlErrorText bold={true}>
                        {error}
                    </FormControlErrorText>
                </FormControlError>
            }
          </FormControl>

          {/* Image upload/manage section */}
          <FormControl className="p-4 border border-transparent rounded-xl bg-dark-100 w-full gap-6 pb-8 mt-6 justify-center items-center" >

            <Text color='white' size='xl'>Manage Images {images.length > 0 && `(${images.length})`}</Text>
            <Text color='gray' size='sm' className='-mt-[18px]'>Max Image size: 20mb</Text>
            
            {/* Shows thumbnail version of images entered | interacting will open bottomsheet for ability */}
            {images.length > 0 &&
              <ScrollView 
                horizontal={true}
                contentContainerStyle={{
                  paddingHorizontal: 8,
                  gap: 8,
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                }}
                showsHorizontalScrollIndicator={false}
              >
                
                {images.map((img, index) => (
                  <ImageCard key={index} uri={img.fileUri} index={index} onPress={() => {bottomRef.current?.open()}} onLongPress={() => {bottomRef.current?.open()}} parent="create"/>
                ))}
                
                </ScrollView>
            }

            {/* Button to open bottom sheet */}
            <Button className="relative self-center w-[50%]" bgColor="#008B8B" borderRadius={10}
            onPress={() => {bottomRef.current?.open()}}
            >
              <Text color='white' >Upload Images </Text>
              <DownloadIcon color="white" />
            </Button>

          </FormControl>

          {/* Button to post blog */}
          <Button className="self-center mt-[20px] w-[50%]" bgColor="#008B8B" borderRadius={10}
            onPressIn={haptic()} onPress={handlePostBlog}
          >
            <Text color='white' > Post Blog</Text>
          </Button>

          {/* Loading modal */}
          <InfoModal showModal={submitModal} setShowModal={setSubmitModal} heading={"Posting..."} body={"Please wait while blog is posting."} buttonText={"Remove"} parent={"create"} confirmFunction={() => {}}  />

        </ScrollView>
        
        {/* Bottom sheet component */}
        <Bottom ref={bottomRef} images={images} setImages={setImages} />
        
      </View>
      
    </View> 
    </GestureHandlerRootView>
    
  )
}

export default create
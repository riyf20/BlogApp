import React, { useState, useRef, useEffect } from 'react'
import { View, ScrollView } from 'react-native'
import {AlertCircleIcon, Button, DownloadIcon, 
  FormControl, FormControlError, Text, 
  FormControlErrorIcon, FormControlErrorText,
  ButtonIcon,
  ChevronLeftIcon, 
} from '@gluestack-ui/themed';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { router } from 'expo-router';
import FormInput from '@/components/FormInput';
import Bottom from '@/components/Bottom';
import ImageCard from '@/components/ImageCard';
import InfoModal from '@/components/InfoModal';
import { useAuthStore } from '@/utils/authStore';
import { blogImageDelete, postBlog, postImage, updateBlog } from '@/services/auth';
import { useHapticFeedback as haptic } from '@/components/HapticTab';
import { useLocalSearchParams } from "expo-router";


const create = () => {

  // Added params for dynamic editing 
  const { mode, editId, editBody, editTitle } = useLocalSearchParams();

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
  const [modalHeading, setModalHeading]= useState("")
  const [modalBody, setModalBody]= useState("")
  const [modalButtonText, setModalButtonText] = useState("")
  const [modalParent, setModalParent] = useState('')
  
  // Img arrary to hold previous img
  const [imgs, setImgs] = useState<ImageItem[]>([])

  // Calls backend for previous image
  const fetchImages = async () => {
    try {
      const res = await fetch(`${process.env.EXPO_PUBLIC_API_BASE_URL}/api/blogs/${editId}/images`); 
      const data = await res.json()
      
      // Set data in ImageItem type for data management
      const newImages: ImageItem[] = data.map((image:Picture) => ({
        fileUri: image.fileUrl,
        base64: image.image_blob,
        id: image.id
      }))

      // Set previous image data | this will hold original set which will be checked against when confirmed edits
      setImgs(newImages)

    } catch (err:any) {
      console.error(err.message)
    }
  }
  
  // If edit mode was detected will autofill previous data and images
  useEffect(() => {
    if(mode==='edit') {
      fetchImages();
      setTitle(editTitle.toString())
      setBody(editBody.toString())
    }
  }, [mode, editId, editBody, editTitle])

  // Will fill previous images if in edit mode and images were returned
  useEffect(() => {
    if(mode==='edit' && imgs.length > 0) {
      setImages(imgs)
    }
  }, [imgs])

  // Sends post to backend
  const handleBlogConfirm = async () => {
    
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
    
    // Shows updating text if on editing mode
    if(mode==='edit') {
      setModalHeading("Updating...")
      setModalBody("Please wait while edits upload.")
      setModalButtonText("Remove") 
      setModalParent("createEdit")  
    } else {
      // Shows posting text if posting
      setModalHeading("Posting...")
      setModalBody("Please wait while blog is posting.")
      setModalButtonText("Remove") 
      setModalParent("create") 
    }

    // Shows loading modal
    setSubmitModal(true)

    // Submits blog edits 
    if (mode==='edit'){
      
      // Updates title and body if changes were made
      if(title!==editTitle.toString() || body!==editBody.toString()) {
        
        try {
          const data = await updateBlog(token, title, body, (Number(editId)))
        } catch (err:any) {
          console.error("Error occured | Updating Blog Title/Body: ", err.message)
        }
      }

      // List of delete images | Filters out old images that are not in the new array | maps thier id for deletion
      const editedDeleteImages = imgs
        .filter(oldImage => !images.some(newImage => newImage.fileUri === oldImage.fileUri))
        .map(img => img.id);

      // List of new images | Filters out new images that are not in the old array 
      const editedNewImage = images.filter(
        newImage => !imgs.some(oldImage => oldImage.fileUri === newImage.fileUri )
      )

      // Checks deleted images
      if(editedDeleteImages.length > 0) {
        
        // Calls delete images
        try {
          const data = await blogImageDelete((Number(editId)), editedDeleteImages, token)
        } catch (err:any) {
          console.error("Error occured | Deleting Blog images: ", err.message)
        }
      }

      // Checks for new images
      if(editedNewImage.length > 0) {
        
        // Calls image upload
        try {
          await Promise.all(
            editedNewImage.map(newImage =>
              postImage(Number(editId), username, newImage.base64, token, newImage.fileUri)
            )
          );
        } catch (err:any) {
          console.error("Error occured | Uploading New Blog images: ", err.message);
        }
      }

      // Go back to blog page
      router.back();

    } else {
      
      // Submits new blog
      try {

        // Sends blog information
        const blogResponse = await postBlog(username, token, title, body)

        // Stores new blog's id
        const newBlogId = blogResponse.blogId;

        // Will send images to backend if any | loops through the array
        if(images.length > 0) {
          try {
            await Promise.all(
              
              images.map(({ base64, fileUri }) => {
                const cleanBase64 = base64.startsWith("data:image")
                  ? base64.split(",")[1]
                  : base64;
                  
                return postImage(newBlogId, username, cleanBase64, token, fileUri);
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
  }

  // Modal when users try to go back after making edits or entering information
  const handleBlogCancel = () => {
    if ( (mode!=='edit' && (title || body ||  images.length > 0 )) || ( mode==='edit' && ( (title!==editTitle) || (body!==editBody) || (images.length!==imgs.length)) )) {

      setModalHeading("Discard changes?")
      setModalBody("Are you sure you want to lose these changes?")
      setModalButtonText("Discard") 
      setModalParent("createUnsaved") 
      setSubmitModal(true)

    } else {
      router.back()
    }
  }

  return (

    // Needed for bottom sheet
    <GestureHandlerRootView>
    <View className="flex-1 bg-dark-100">

      <View className="justify-center items-center flex-row mt-20 px-4 mb-4">
        <Text color='$white' size='2xl' className="self-center" bold={true} >{mode==='edit' ? 'Edit Blog' : 'Create New Blog'}</Text>
      
        <Button size="lg" className="rounded-full p-3.5 w-[5%] absolute left-4" bg='#91A3B6' borderRadius={50} onPress={handleBlogCancel}>
          <ButtonIcon as={ChevronLeftIcon} size='xl' color='black' />
        </Button>
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

          <View className='w-full flex-row gap-2'>

            {mode==='edit' &&
              <Button className="self-center mt-[20px] flex-1" bgColor="gray" borderRadius={10}
              onPressIn={haptic()} onPress={handleBlogCancel}
              >
                <Text color='white' >Cancel</Text>
              </Button>
            }

            {/* Button to post blog */}
            <Button className="self-center mt-[20px] flex-1" bgColor="#008B8B" borderRadius={10}
              onPressIn={haptic()} onPress={handleBlogConfirm}
              >
              <Text color='white' >{mode==='edit' ? "Confirm Edits" : "Post Blog" }</Text>
            </Button>

          </View>

          {/* Loading modal */}
          <InfoModal showModal={submitModal} setShowModal={setSubmitModal} heading={modalHeading} body={modalBody} buttonText={modalButtonText} parent={modalParent} confirmFunction={() => router.back()}  />

        </ScrollView>
        
        {/* Bottom sheet component */}
        <Bottom ref={bottomRef} images={images} setImages={setImages} parent={'create'}/>
        
      </View>
      
    </View> 
    </GestureHandlerRootView>
    
  )
}

export default create
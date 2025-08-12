import React, { useEffect, useState } from 'react'
import { View, Text, ScrollView, FlatList, ActivityIndicator, Platform, Keyboard } from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router';
import { AlertCircleIcon, Button, ButtonIcon, ChevronLeftIcon, 
  Divider, FormControl, FormControlError, FormControlErrorIcon, 
  FormControlErrorText, Input, InputField } from '@gluestack-ui/themed';
import Animated, { Easing, FadeInUp, useAnimatedStyle, 
  useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import TextTicker from "react-native-text-ticker";
import useFetch from '@/services/useFetch';
import { fetchComments, sendComment } from '@/services/auth';
import PictureCard from '@/components/PictureCard';
import CommentSection from '@/components/CommentSection';
import { useAuthStore } from '@/utils/authStore';
import { useHapticFeedback } from '@/components/HapticTab';

const BlogDetails = () => {

  // For navigation
  const router = useRouter();

  // Persisted data
  const {token, username} = useAuthStore();

  // Grabs id --> changes type
  const {id} = useLocalSearchParams();
  const numId = Number(id);

  // Fetches blog details based on id 
  const {data: blog, isLoading, error} = useFetch<Blog>(`${process.env.EXPO_PUBLIC_API_BASE_URL}/api/blogs/` + id); 
  const {data: imgs, isLoading: imgsLoading, error:imgsError} = useFetch<Picture[]>(`${process.env.EXPO_PUBLIC_API_BASE_URL}/api/blogs/${id}/images`); 

  const [hasimages, setHasImages] = useState(false);  // Blog post => Images
  const [comments, setComments] = useState([]);  // Blog post loaded => Load Comments

  // Translation for comment field 
  const translateY = useSharedValue(0);
  
  // Animation values
  const animatedStyles = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value+10 }],
  }))

  // If user pressed into comment field
  const [enter, setEnter] = useState(false);

  // Comment field | validity state | error
  const [commentField, setCommentField] = useState('')
  const [commentInvalid, setCommentInvalid] = useState(false);
  const [commentError, setCommentError] = useState("")

  // Buttons haptics
  const haptic = useHapticFeedback();
  
  // Fetchs comments once blog is loaded
  useEffect(() => {
    if (blog) {
      fetchAllComments();
    }
  }, [blog, id, hasimages]);

  // Fetches all comments
  const fetchAllComments = async () => {
    setComments([])
    try {
      const data = await fetchComments(numId, token);

      setComments(data)
    } catch (err:any) {
      console.error("Error occured | Fetching Comments:", err.message)
    }
  }

  // Moves comment field based on keyboard 
  useEffect(() => {

    // Moves field up above keyboard
    const showSub = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      (e) => {
        translateY.value = withSpring(-e.endCoordinates.height, { damping: 30, stiffness: 200, overshootClamping: false });
        setEnter(true)
      }
    );

    // Moves field down (resets to original position)
    const hideSub = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => {
        translateY.value = withTiming(0, { duration: 600, easing: Easing.out(Easing.exp) });
        setEnter(false)
      }
    );

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);


  // Submit new comment to backend
  const handleComment = async () => {
    
    // Checks if field is empty
    if(!commentField.trim()) {
      setCommentInvalid(true)
      setCommentError("Comment cannot be empty.")
      return
    }

    // Closes keyboard
    Keyboard.dismiss();
    
    try {

      // Send comment to backend
      const data = await sendComment(commentField, username, numId, token)

      // Refetchs on success
      setCommentField("")
      fetchAllComments();

    } catch (err:any) {
      console.error("Error occured | Comment Failed:", err.message)
      
    }
  }

  return (

    // Acts as header and will show blog's title
    <View className='flex-1 bg-dark-100'>
      <View className="justify-center items-center self-center flex-row mt-20 mb- w-[80%] ml-14">

        {/* Moving title for lengthy titles */}
        <TextTicker
          className='w-auto'
          loop
          bounce={false}
          repeatSpacer={50}
          marqueeDelay={1000}     // Delay before starting
          duration={10000}        // Time to scroll across
        >
          <Text className="text-3xl text-light-100 font-bold" numberOfLines={1} >{isLoading ? 'Loading...' : blog?.title } </Text>
        </TextTicker>
      </View>
      
      <Button size="lg" className="rounded-full p-3.5 w-[5%] absolute top-[66px] left-4" bg='#91A3B6' borderRadius={50} onPress={() => router.back()}>
        <ButtonIcon as={ChevronLeftIcon} size='xl' color='black' />
      </Button>

      {/* Shows the blog details  */}
      <View className="mt-4 bg-white border border-transparent rounded-3xl h-full">

        {isLoading ? (
          <>
            <ActivityIndicator size="large" color="#008B8B" className="mt-52"/>
            <View className="justify-center items-center mt-12">
              <Text className="text-2xl text-secondary mb-3 px-5">
                Loading Blog Details
              </Text>
            </View>
          </>
        ) : error ? (
          <>
            <View className="justify-center items-center mt-12">
              <Text className="text-2xl text-red-600 mb-3 px-5">
                Sorry an error occured. Please try again
              </Text>
              <Text className="text-2xl text-red-600 mb-3 px-5">
                Error code: {error}
              </Text>
              
            </View>
          </>
        ) : (
          
          <>
            <Text className='m-4 mt-8 font-medium text-xl text-black'>
            {blog?.body}
          </Text>

          {/* Conditionally renders images if any */}
          { imgsLoading ? (
              <>
                <ActivityIndicator size="small" color="#008B8B" />
                <View className="justify-center items-center mt-4">
                  <Text className="text-sm text-secondary mb-3 px-5">
                    Loading images...
                  </Text>
                </View>
              </>
            ) : imgs && imgs.length > 0 ? (
              <View>
                <FlatList
                  data={imgs}
                  horizontal
                  renderItem={({ item }) => <PictureCard {...item} />}
                  keyExtractor={(item) => item.id.toString()}
                  showsHorizontalScrollIndicator={false}
                  ItemSeparatorComponent={() => <View style={{ width: 10 }} />}
                  style={{ height: 300, marginHorizontal: 16, marginBottom: -20 }}
                />
              </View>
            ) : null 
          }
          

          <View className='mt-[-20px]'>
            <Text className='m-4'>
              Written by: {blog?.author}
            </Text>
          </View>
          </>
        
        )}
        
        {/* Comment section */}
        <Divider height={8} width={'94%'} className='self-center' borderRadius={20} bgColor="#2F4858"/>
        <ScrollView >
          <View className='pb-[250px]'>
      
            <Text className='font-bold mt-4 ml-4 self-center text-xl'>Comments</Text>
            {comments && comments.length > 0 ? 
              
              <>
              {comments?.map((comment:usersComment, index) => (
                <CommentSection key={comment.id} {...comment} index={index}/>
              ))}
              </>
              :
              <Text className='font-semibold mt-4 ml-4'>Be the first to comment!</Text>
            }
          </View>
        </ScrollView>
        
 
      </View>

        {/* Comment field */}
        <Animated.View style={[animatedStyles]} className='absolute bottom-0 left-0 right-0 z-50'>

          {enter ? 
          // Moves comment field up above keyboard --> adds comment button to submit comment
          <>
            <View className="bg-dark-100 w-full p-4 border-t border-gray-700 pb-32 top-20 flex-row gap-2">
              <FormControl isInvalid={commentInvalid} className='w-[74%]'>
                <Input variant="rounded" isInvalid={commentInvalid}>
                  <InputField
                    type="text"
                    placeholder="Add comment..."
                    bg="gray"
                    placeholderTextColor="white"
                    color='white'
                    value={commentField}
                    onChangeText={(text) => {
                      setCommentField(text)
                      setCommentError('')
                      setCommentInvalid(false)
                    }}
                  />
                </Input>

                {/* Shows error for comment field */}
                <FormControlError>
                  <FormControlErrorIcon as={AlertCircleIcon} />
                  <FormControlErrorText>
                    {commentError}
                  </FormControlErrorText>
                </FormControlError>

              </FormControl>
            
              <Animated.View 
                entering={FadeInUp
                  .springify()
                  .damping(80)
                  .mass(0.8)
                  .stiffness(200)
                  .duration(800)
                  .delay(80)
                }
              >
                  <View>
                    <Button size="sm" variant="solid" action="positive" className="top-[1px]" borderRadius={100} onPressIn={haptic} onPress={handleComment}>
                      <Text className="font-bold text-lg text-white">Comment</Text>
                    </Button>
                  </View>
              </Animated.View>
            </View>
          </>
          :
          // Else basic comment field at the bottom
          <>
            <View className="bg-dark-100 w-full p-4 border-t border-gray-700 pb-32 top-20 flex-1">
              
              <FormControl isInvalid={commentInvalid}>
                <Input variant="rounded" isInvalid={commentInvalid}>
                  <InputField
                    type="text"
                    placeholder="Add comment..."
                    bg="gray"
                    placeholderTextColor="white"
                    color='white'
                    value={commentField}
                    onChangeText={(text) => {
                      setCommentField(text)
                      setCommentError('')
                      setCommentInvalid(false)
                    }}
                  />
                 
                </Input>

                {/* Shows error for comment field */}
                <FormControlError>
                  <FormControlErrorIcon as={AlertCircleIcon} />
                  <FormControlErrorText>
                    {commentError}
                  </FormControlErrorText>
                </FormControlError>

              </FormControl>
            </View>
          </>
          }
      </Animated.View>

    </View>
  )
}

export default BlogDetails

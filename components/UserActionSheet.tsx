import { View, Text, Pressable, Keyboard, Platform } from 'react-native'
import React, { useEffect, useState } from 'react'
import { FontAwesome5 } from '@expo/vector-icons'
import { Actionsheet, ActionsheetBackdrop, ActionsheetContent, 
  ActionsheetDragIndicatorWrapper, ActionsheetDragIndicator, 
  ActionsheetItem, ActionsheetIcon, ActionsheetItemText, FormControl, 
  Button, ButtonText} from '@gluestack-ui/themed';
import { EditIcon, TrashIcon, Flag  } from 'lucide-react-native';
import { useAuthStore } from '@/utils/authStore';
import FormInput from './FormInput';
import Animated, { Easing, useAnimatedStyle, 
  useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import { deleteBlog, deleteComment, reportBlog, reportComment, updateComment } from '@/services/auth';
import InfoModal from './InfoModal';
import ToastNotif from './ToastNotif';
import { router } from 'expo-router';
import { useHapticFeedback as haptic } from '@/components/HapticTab';


// Parent can either be blog or comment
const UserActionSheet = ({ body, author, id, postid, fetchComments, parent, title }: UserActionSheetProps) => {

  // Toggle for actionsheet (edit, delete, report)
  const [menuVisible, setMenuVisible] = useState(false);

  // Closes actionsheet
  const handleClose = () => {
    setMenuVisible(false)
    if(parent==='comment'){
      setEditComment(false)
    }
  };

  // Persisted data
  const {token, username, user} = useAuthStore();

  // Editing Comment field | visibility toggle | invalid state | error message
  const [editComment, setEditComment] = useState(false)
  const [comment, setComment] = useState(body)
  const [commentInvalid, setCommentInvalid] = useState(false)
  const [error, setError] = useState('')
  
  // Translation for comment field 
  const translateY = useSharedValue(0);
  
  // Animation values
  const animatedStyles = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value+20}],
  }))

  // Moves comment edit field based on keyboard 
  useEffect(() => {

    // Moves field and actionsheet up above keyboard
    const showSub = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      (e) => {
        translateY.value = withSpring((-e.endCoordinates.height+40), { damping: 30, stiffness: 200, overshootClamping: false });
      }
    );

    // Moves field and actionsheet down
    const hideSub = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => {
        translateY.value = withTiming(0, { duration: 600, easing: Easing.out(Easing.exp) });
      }
    );

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  // Functions confirm comment edits
  const handleEditConfirm = async () => {

    // Checks if comment was left empty
    if(!comment.trim()) {
      setCommentInvalid(true)
      setError("Comment cannot be empty.")
      Keyboard.dismiss();
      return;
    }

    // If no changes made no need to call backend
    if(comment===body) {
      setEditComment(false);
      setMenuVisible(false);
      return;
    }

    // Send changed comment to backend
    try {
      
      if(postid && id) {
        const data = await updateComment(postid, id, comment, token)
      }

      // Resets and closes actionsheet | Refreshes comments
      setEditComment(false);
      setMenuVisible(false);
      if(fetchComments) {
        fetchComments()
      }

    } catch (err:any) {
      console.error("Error occured | Comment Update Failed:", err.message)
    }
  }

  // Modal Components
  const [showModal, setShowModal] = useState(false)
  const [heading, setHeading] = useState('')
  const [modalBody, setModalBody] = useState('')
  const [buttonText, setButtonText] = useState('')
  const [modalParent, setModalParent] = useState('')

  // Delete function
  const handleDeleteFunction = async () => {

    if(parent==='blog') {

      // Deletes blog 
      if (modalParent==='blogDelete'){
        try {

          const data = await deleteBlog(id, token, username)
          
          // Closes modal | Closes actionsheet | Back to homepage
          setShowModal(false)
          setMenuVisible(false)
          router.dismissAll()

        } catch (error:any) {
          console.error("Error occured | Deleting blog", error.message)
        }
      }

    } else if (parent==='comment') {
        
      // Deletes comment 
      if (modalParent==='commentDelete'){
        try {

          if(postid && id) {
            const data = await deleteComment(username, postid, id, token)
          }

          // Closes modal | Closes actionsheet | Refreshes comments
          setShowModal(false)
          setMenuVisible(false)
          if(fetchComments) {
            fetchComments()
          }
        } catch (error:any) {
          console.error("Error occured | Deleting comment", error.message)
        }
      }
    }

  }

  // Toggle for toast
  const [reportToast, setReportToast] = useState(false);
  
  // Report function
  const handleReportFunction = async () => {

    if (parent==='blog') {

      // Reports blog
      if (modalParent==='blogReport') {
        try {
          const data = await reportBlog(user.id, username, id, token)

          // Shows toast | Closes modal | Closes actionsheet     
          setToastTitle('Blog reported')
          
          setReportToast(true);
          setShowModal(false)
          setMenuVisible(false)
              
        } catch (error:any) {
          console.error("Error occured | Reporting blog", error.message)
        }
      }        

    } else if(parent==='comment') {
      
      // Reports comment 
      if (modalParent==='commentReport'){
        try {

          if(postid && id) {
            const data = await reportComment(user.id, username, postid, id, token)
          }

          // Shows toast | Closes modal | Closes actionsheet 
          setToastTitle('Comment Reported')

          setReportToast(true);
          setShowModal(false)
          setMenuVisible(false)
            
        } catch (error:any) {
          console.error("Error occured | Reporting comment", error.message)
        }
      }
    }

  }

  // Unsaved edit changes function
  const handleUnsavedEdit = () => {
    // Closes modal | resets actionsheet | resets comment body
    setShowModal(false)
    setEditComment(false);
    setComment(body);
  }


  // Functions to dynamically change modal components based on type (argument sent)
  const setModal = (type:string) => {
    if (parent==='blog') {
      
      // Delete blog modal
      if(type==='delete') {
        setModalParent('blogDelete')
        setHeading("Delete Blog?")
        setModalBody("Are you sure you want to delete this blog? All images and comments will be removed.")
        setButtonText("Delete")
        setShowModal(true)
      } else if(type==='report') { // Report blog modal
        setModalParent('blogReport')
        setHeading("Report Blog?")
        setModalBody("Are you sure you want to report this blog? Reported blogs will be flagged and reviewed.")
        setButtonText("Report")
        setShowModal(true)
      }

    } else if (parent==='comment') {
      // Delete comment modal
      if(type==='delete') {
        setModalParent('commentDelete')
        setHeading("Delete Comment?")
        setModalBody("Are you sure you would like to delete this comment?")
        setButtonText("Delete")
        setShowModal(true)

      } else if (type==='unsaved') { // Unsaved comment edits modal
        
        if(comment===body) {
          // If no changes were made then no need to show modal
          setEditComment(false);
          setComment(body);
        } else {
          setModalParent('commentUnsaved')
          setHeading("Discard changes?")
          setModalBody("Are you sure you want to lose these changes?")
          setButtonText("Discard")
          setShowModal(true)
        }

      } else if(type==='report') { // Report comment modal
        setModalParent('commentReport')
        setHeading("Report Comment?")
        setModalBody("Are you sure you want to report this comment? Reported comments will be flagged and reviewed.")
        setButtonText("Report")
        setShowModal(true)
      }
        
    }
  }

  const [toastTitle, setToastTitle] = useState('')
  const [toastMessage, setToastMessage] = useState('Thank you for reporting.')

  // Edit function
  const setEditAction = () => {
    // Comment will open comment edit field
    if(parent==='comment') {
      setEditComment(true)
    } else if (parent==='blog') {
      // Blog will send to create with editing params
      setMenuVisible(false)
      router.push({
        pathname: '/blog/create',
        params: {mode: "edit", editId: id, editBody: body, editTitle: title}
      })
    }
  }
  
  return (
    <View
      className={parent==='blog' ? 'absolute right-[-20px]' : 'absolute right-0'}
    >
      <Pressable
        onPressIn={haptic()}
        onPress={() => setMenuVisible(!menuVisible)}
      >
        {({ pressed }) => (
          <Animated.View
            style={{
              backgroundColor: pressed ? '#e0e0e0' : 'transparent',
              borderRadius: 999,
              padding: 10,
              zIndex: 10,
              // transform: [{ scale: pressed ? 0.85 : 1 }], // maybe add later?
            }}
          >
            <FontAwesome5 name="ellipsis-v" size={parent==='blog' ? 24 : 18} color={parent==='blog' ? "white" : "black" }/>
          </Animated.View>
        )}
      </Pressable>

      {/* Actionsheet menu for edit, delete, and report */}
      <Actionsheet isOpen={menuVisible} onClose={handleClose} closeOnOverlayClick={true}>
        <ActionsheetBackdrop />

      <Animated.View style={[animatedStyles]} className=''>
        <ActionsheetContent
          style={{
            paddingBottom: 70,
          }}
        >

          <ActionsheetDragIndicatorWrapper>
            <ActionsheetDragIndicator />
            <View className='border-black border-2 my-4 p-2 rounded-2xl w-full'>

              {/* Shows comment to reinforce which comment is being handled */}
              <Text className='text-xl font-semibold self-center'>{parent==='comment' ? `Commented by ${author}` : `Written by ${author}`}  </Text>
              
              {!editComment ? 
                <Text className='mx-4 self-center' numberOfLines={4} >"{body}"</Text>
                :
                
                parent==='comment' &&
                
                (<View className='w-[96%] self-center pb-6'>
                  <FormControl isInvalid={commentInvalid}>
                    <FormInput invalid={commentInvalid} placeholder={''} value={comment} parentInvalid={commentInvalid} setValue={setComment} setValueInvalid={setCommentInvalid} setParentInvalid={setCommentInvalid} error={error} textarea={true} parent={'comment'}/>
                  </FormControl>
                  
                </View>)
                
              }
            </View>
            
          </ActionsheetDragIndicatorWrapper>

            {/* Normal actions */}
            {!editComment ? 
            <>
              {/* Will only show edit and delete if the comment was made by current user */}
              {username===author &&
              <>
                <ActionsheetItem onPress={setEditAction} isDisabled={editComment}>
                  <ActionsheetIcon className="stroke-background-700" as={EditIcon} size='lg'/>
                  <ActionsheetItemText bold>Edit</ActionsheetItemText>
                </ActionsheetItem>

                <ActionsheetItem onPress={() => setModal('delete')} isDisabled={editComment}>
                  <ActionsheetIcon className="stroke-background-700" as={TrashIcon} color={'red'} size='lg'/>
                  <ActionsheetItemText bold>Delete</ActionsheetItemText>
                </ActionsheetItem>
              </>
              }
              
              <ActionsheetItem onPress={() => setModal('report')} isDisabled={editComment}>
                <ActionsheetIcon className="stroke-background-700" as={Flag} color={'red'} size='lg'/>
                <ActionsheetItemText bold>Report</ActionsheetItemText>
              </ActionsheetItem>
            </> 
          
            :
              // Buttons when editing comment
            <View className='flex-row gap-4 justify-center pb-10 mb-[-26px]'>
              <Button className='w-[48%]' 
                bgColor='gray'
                onPress={() => {
                    setModal('unsaved')
                  }
                }
              >
                <ButtonText>Cancel</ButtonText>
              </Button>
              <Button className='w-[48%]' action='positive' onPress={handleEditConfirm} onPressIn={haptic()}>
                <ButtonText>Confirm</ButtonText>
              </Button>
            </View>
            }
        </ActionsheetContent>
        </Animated.View>
      </Actionsheet>
    
    {/* Modal component */}
    <InfoModal showModal={showModal} setShowModal={setShowModal} heading={heading} body={modalBody} buttonText={buttonText} parent={modalParent} 
    confirmFunction={
      modalParent==='commentDelete' || modalParent==='blogDelete' ? handleDeleteFunction 
        : modalParent==='blogReport' || modalParent==='commentReport' ? handleReportFunction 
        : handleUnsavedEdit
      }/>

    {/* Toast component */}
    <ToastNotif title={toastTitle} message={toastMessage} show={reportToast} setShow={setReportToast}/>

    </View>
  )
}

export default UserActionSheet
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
import { deleteComment, reportComment, updateComment } from '@/services/auth';
import InfoModal from './InfoModal';
import ToastNotif from './ToastNotif';

const CommentSection = ({ body, author, index, id, postid, fetchComments }: CommentSectionProps) => {

  // Toggle for actionsheet (edit, delete, report)
  const [menuVisible, setMenuVisible] = useState(false);

  // Closes actionsheet
  const handleClose = () => {
    setMenuVisible(false)
    setEditComment(false)
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
      
      const data = await updateComment(postid, id, comment, token)

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
  const [parent, setParent] = useState('')

  // Delete comment function
  const handleDeleteFunction = async () => {

    // Checks that modal's parent is comment 
    if (parent==='comment'){
      try {
        const data = await deleteComment(username, postid, id, token)

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

  // Toggle for toast
  const [reportToast, setReportToast] = useState(false);
  
  // Report comment function
  const handleReportFunction = async () => {

    // Checks that modal's parent is report 
    if (parent==='commentReport'){
      try {

        const data = await reportComment(user.id, username, postid, id, token)

        // Shows toast | Closes modal | Closes actionsheet 
        setReportToast(true);
        setShowModal(false)
        setMenuVisible(false)
        
      } catch (error:any) {
        console.error("Error occured | Reporting blog", error.message)
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
    // Delete modal
    if(type==='delete') {
      setParent('comment')
      setHeading("Delete Comment?")
      setModalBody("Are you sure you would like to delete this comment?")
      setButtonText("Delete")
      setShowModal(true)

    } else if (type==='unsaved') { // Unsaved edits modal
      if(comment===body) {
        // If no changes were made then no need to show modal
        setEditComment(false);
        setComment(body);
      } else {
        setParent('commentUnsaved')
        setHeading("Discard changes?")
        setModalBody("Are you sure you want to lose these changes?")
        setButtonText("Discard")
        setShowModal(true)
      }
    } else if(type==='report') { // Report comment modal
      setParent('commentReport')
      setHeading("Report Comment?")
      setModalBody("Are you sure you want to report this comment? Reported comments will be flagged and reviewed.")
      setButtonText("Report")
      setShowModal(true)
    }

  }

  
  return (
    <View
      className='mb-4 flex-row items-center'
      id={index.toString()}
    >
      <View className='flex-1 mr-2'>
        <Text className='text-xl font-semibold'>{author}</Text>
        <Text className='ml-4'>{body}</Text>
      </View>

      <Pressable
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
            <FontAwesome5 name="ellipsis-v" size={18} color="black" />
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
              <Text className='text-xl font-semibold self-center'>{author}</Text>
              
              {!editComment ? 
                <Text className='mx-4 self-center'>"{body}"</Text>
                :
                <View className='w-[96%] self-center pb-6'>
                  <FormControl isInvalid={commentInvalid}>
                    <FormInput invalid={commentInvalid} placeholder={''} value={comment} parentInvalid={commentInvalid} setValue={setComment} setValueInvalid={setCommentInvalid} setParentInvalid={setCommentInvalid} error={error} textarea={true} parent={'comment'}/>
                  </FormControl>
                  
                </View>
              }
            </View>
            
          </ActionsheetDragIndicatorWrapper>

            {/* Normal actions */}
            {!editComment ? 
            <>
              {/* Will only show edit and delete if the comment was made but current user */}
              {username===author &&
              <>
                <ActionsheetItem onPress={() => setEditComment(true)} isDisabled={editComment}>
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
              <Button className='w-[48%]' action='positive' onPress={handleEditConfirm}>
                <ButtonText>Confirm</ButtonText>
              </Button>
            </View>
            }
        </ActionsheetContent>
        </Animated.View>
      </Actionsheet>
    
    {/* Modal component */}
    <InfoModal showModal={showModal} setShowModal={setShowModal} heading={heading} body={modalBody} buttonText={buttonText} parent={parent} 
    confirmFunction={
      parent==='comment' ? handleDeleteFunction 
        : parent==='commentReport' ? handleReportFunction 
        : handleUnsavedEdit
      }/>

    {/* Toast component */}
    <ToastNotif title='Comment Reported' message='Thank you for reporting.' show={reportToast} setShow={setReportToast}/>

    </View>
  )
}

export default CommentSection
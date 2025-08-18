import React, { useEffect, useState } from 'react'
import { RefreshControl, ScrollView, View } from 'react-native'
import { router } from 'expo-router';
import {AddIcon, Button, ButtonIcon, Divider, EditIcon, Text } from '@gluestack-ui/themed';
import { useAuthStore } from '@/utils/authStore'
import { deleteBlog, deleteComment, userBlogData, userCommentData } from '@/services/auth';
import BlogCard from '@/components/BlogCard';
import CommentCard from '@/components/CommentCard';
import { useHapticFeedback as haptic } from '@/components/HapticTab';
import InfoModal from '@/components/InfoModal';

const posts = () => {

  // Persisted data
  const {token, user, username} = useAuthStore();
  const [error, setError] = useState('');
  
  // User's comment and blog data
  const [blogData, setBlogData] = useState<usersBlog[] | null>(null)
  const [commentData, setCommentData] = useState<usersComment[] | null>(null)

  // Refreshes page
  const [refreshing, setRefreshing] = useState(false);
  
  // Edit state for blogs and comments
  const [blogEdit, setBlogEdit] = useState(false);
  const [commentEdit, setCommentEdit] = useState(false);

  // Toggle for blog edits
  const toggleBlogEdit = () => {
    setBlogEdit(!blogEdit);
  }

  // Toggle for comment edits
  const toggleCommentEdit = () => {
    setCommentEdit(!commentEdit);
  }

  // Load state for blogs and comments
  const [blogsLoaded, setBlogsLoaded] = useState(false);
  const [commentsLoaded, setCommentsLoaded] = useState(false);
  
  // Passed to the blog/comment card --> if card deleted will change to true and trigger useEffect
  const [deletion, setDeletion] = useState(false);

  // Dynamic modal to confirm actions
  const [showModal, setShowModal] = useState(false);

  // Modal components
  const [heading, setHeading] = useState('');
  const [body, setBody] = useState('');
  const [buttonText, setButtonText] = useState('');
  const [parent, setParent] = useState('');

  // Index and type (blog/comment) of delete item
  const [deleteIndex, setDeleteIndex] = useState(-1);
  const [deleteType, setDeleteType] = useState('');

  // Will trigger modal --> will only change if user clicked delete
  useEffect(() => {
    if (deleteIndex!==-1 && deleteType) {
       setHeading('Delete ' + deleteType + '?')
      setBody("Are you sure you want to delete this " + deleteType + "?")
      setButtonText("Delete")
      setParent('post')
      setShowModal(true)
    }
   
  }, [deleteIndex, deleteType])

  useEffect(() => {
    if(!showModal) {
      setDeleteIndex(-1)
      setDeleteType('')
    }
  }, [showModal])

  // Delete based on index and type
  const handleDelete = async () => {

    // If its blog
    if(deleteType==='blog') {
      // Will get specific blog
      const selectedBlog = blogData?.at(deleteIndex)
      
      try {
        const data = await deleteBlog(selectedBlog!.id, token, username)
      } catch (error:any) {
        console.error("Error occured | Deleting blog", error.message)
      }
      setShowModal(false)
      setDeletion(true);

    } else if (deleteType==='comment') {
      // If its comment

      // Will get specific comment
      const selectedComment = commentData?.at(deleteIndex);

      try {
        const data = await deleteComment(username, selectedComment!.postid, selectedComment!.id, token)
      } catch (error:any) {
        console.error("Error occured | Deleting comment", error.message)
      }

      // Closes modal and refreshes data
      setShowModal(false)
      setDeletion(true);
    }
      
  }
  
  
  // Fetches Blog data from database  
  const fetchBlogs = async () => {
    try {
      const data = await userBlogData(username, token); 

      setBlogData(data);

    } catch (err: any) {
      console.error('Fetch error | Fetching Blogs:', err.message);
      setError('An unexpected error occurred');
    } finally {
      setBlogsLoaded(true);
    }
  }

  // Fetches Comment data from database  
  const fetchComments = async () => {
    try {
      const data = await userCommentData(username, token); 

      setCommentData(data);

    } catch (err: any) {
      console.error('Fetch error | Fetching Comments:', err.message);
      setError('An unexpected error occurred');
    }  finally {
      setCommentsLoaded(true);
    }
  }

  // Fetches all data 
  useEffect(() => {
    const fetchAll = async () => {
      await Promise.all([fetchBlogs(), fetchComments()]);
      setDeletion(false)
      setBlogEdit(false)
      setCommentEdit(false);
    };

    fetchAll();
  }, [user, refreshing, deletion]);

  return (

    <View className="flex-1 bg-dark-100">

      <View className="justify-center items-center flex-row mt-16 px-4 mb-4">
        <Text color='$white' size='2xl' className="self-center" bold={true}>Posts</Text>
      </View>

      <View>
        <ScrollView
          showsVerticalScrollIndicator={false} 
          contentContainerStyle={{
            minHeight: '100%',
          }}
          className='pb-[250px]'
          refreshControl={
            // Refresh ability  
            <RefreshControl refreshing={refreshing} onRefresh={() => {
              fetchBlogs();
              fetchComments();
            }}
            />
          }
          >
          <View className="mt-4 bg-white border border-transparent rounded-xl h-full pb-[250px]">

          {
            error ? (
              <>
                <View className="justify-center items-center mt-12">
                  <Text className="text-2xl mb-3 px-5" color='$red600'>
                    Error Occured!
                  </Text>
                  <Text className="text-2xl mb-3 px-5" color='$red600'>
                    Error: {error}
                  </Text>
                  
                </View>
              </>
            ) : (
              <>

                {/* Create new blog section */}
                <View className='self-center justify-center items-center border border-transparent rounded-xl bg-dark-100 w-[94%] mt-8 flex-row py-4'>

                  <Text className='relative right-20' size='xl' color='$white' bold={true} >Create New Post</Text>

                  <Button borderRadius={50} bgColor='#008B8B' className='relative left-20' onPressIn={haptic()} onPress={() => {router.push('/blog/create')}}>
                    <ButtonIcon as={AddIcon} />
                  </Button>

                </View>

                {/* User's blogs section */}
                <View className='self-center justify-center items-center border border-transparent rounded-xl bg-dark-100 w-[94%] mt-8 pb-8'>

                  <Text className='mt-5 ml-5 mb-4 self-start' size='2xl' color='$white' bold={true} >Your Blogs</Text>

                  {/* Edit/Delete blogs */}
                  <Button size="md" className="rounded-full p-3.5 self-end absolute top-3 right-4" bgColor={blogEdit ? '#228B22' : '#91A3B6'} borderRadius={500} onPressIn={haptic()} onPress={() => {toggleBlogEdit()}}>
                    <ButtonIcon as={EditIcon} />
                    <Text color='$white' size='sm'> Edit</Text>
                  </Button>
                  <Divider width={'90%'} className='self-center' height={2}/>

                    <View className='w-[94%]' >
                      
                      {blogsLoaded && (!blogData || blogData.length === 0) ? (
                        <Text className='ml-4 mt-4' size='md' color='$white'>
                          You have not posted a blog yet. 
                          Post now to share your ideas!
                        </Text>
                      ) : (
                        blogData?.map((item:Blog, index) => (
                          <BlogCard key={item.id} {...item} index={index} edit={blogEdit} setIndex={setDeleteIndex} type={setDeleteType}/>
                        ))
                      )}
                    </View>

                </View>
                
                {/* User's comment section */}
                <View className='self-center justify-center items-center border border-transparent rounded-xl bg-dark-100 w-[94%] mt-8 pb-8'>

                  <Text className='mt-5 ml-5 mb-4 self-start' size='2xl' color='$white' bold={true} >Your Comments</Text>

                  {/* Edit/Delete comments */}
                  <Button size="md" className="rounded-full p-3.5 self-end absolute top-3 right-4" bgColor={commentEdit ? '#228B22' : '#91A3B6'} borderRadius={500} onPressIn={haptic()} onPress={() => {toggleCommentEdit()}}>
                    <ButtonIcon as={EditIcon} />
                    <Text color='$white' size='sm'> Edit</Text>
                  </Button>
                  <Divider width={'90%'} className='self-center' height={2}/>

                    <View className='w-[94%]'>
                      {commentsLoaded &&(!commentData || commentData.length === 0) ? (
                        <Text className='ml-4 mt-4' size='md' color='$white'>
                          You have not commented yet. 
                          Check out other user's blogs and share your thoughts!
                        </Text>
                      ) : (
                        commentData?.map((comment: usersComment, index) => (
                          <CommentCard key={comment.id} {...comment} index={index} edit={commentEdit} setIndex={setDeleteIndex} type={setDeleteType}/>
                        ))
                      )}
                    </View>
                </View>
              </>
          )}

          </View>

        </ScrollView>
      </View>

      <InfoModal showModal={showModal} setShowModal={setShowModal} heading={heading} body={body} buttonText={buttonText} parent={parent} confirmFunction={handleDelete}/>
    
    </View>
  )
}

export default posts
import { RefreshControl, ScrollView, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useAuthStore } from '@/utils/authStore'
import {Button, ButtonIcon, Divider, EditIcon, Text } from '@gluestack-ui/themed';
import { userBlogData, userCommentData } from '@/services/auth';
import BlogCard from '@/components/BlogCard';
import CommentCard from '@/components/CommentCard';

const posts = () => {

  // Persisted data
  const {token, user, username} = useAuthStore();
  const [error, setError] = useState('');
  
  // User's comment and blog data
  const [blogData, setBlogData] = useState<usersBlog[] | null>(null)
  const [commentData, setCommentData] = useState<usersComment[] | null>(null)

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
  
  const [deletion, setDeletion] = useState(false);

  // Fetches Blog data from database  
  const fetchBlogs = async () => {
    try {
      const data = await userBlogData(username, token); 

      setBlogData(data);

    } catch (err: any) {
      console.error('Fetch error:', err.message);
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
      console.error('Fetch error:', err.message);
      setError('An unexpected error occurred');
    }  finally {
      setCommentsLoaded(true);
    }
  }

  useEffect(() => {
    const fetchAll = async () => {
      await Promise.all([fetchBlogs(), fetchComments()]);
      setDeletion(false)
      setBlogEdit(false)
      setCommentEdit(false);
      // console.log("fetched all!")
    };

    fetchAll();
  }, [user, refreshing, deletion]);
    
  return (

    <View className="flex-1 bg-dark-100">

      <View className="justify-center items-center flex-row mt-20 px-4 mb-4">
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
            <RefreshControl refreshing={refreshing} onRefresh={() => {
              // console.log("refreshed!")
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
                <View className='self-center justify-center items-center border border-transparent rounded-xl bg-dark-100 w-[94%] mt-8 pb-8'>

                  <Text className='mt-5 ml-5 mb-4 self-start' size='2xl' color='$white' bold={true} >Your Blogs</Text>
                  <Button size="md" className="rounded-full p-3.5 self-end absolute top-3 right-4" bgColor={blogEdit ? '#228B22' : '#91A3B6'} borderRadius={500} onPress={() => {toggleBlogEdit()}}>
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
                          <BlogCard key={item.id} {...item} index={index} edit={blogEdit} deletion={setDeletion}/>
                        ))
                      )}
                    </View>

                </View>
                
                <View className='self-center justify-center items-center border border-transparent rounded-xl bg-dark-100 w-[94%] mt-8 pb-8'>

                  <Text className='mt-5 ml-5 mb-4 self-start' size='2xl' color='$white' bold={true} >Your Comments</Text>
                  <Button size="md" className="rounded-full p-3.5 self-end absolute top-3 right-4" bgColor={commentEdit ? '#228B22' : '#91A3B6'} borderRadius={500} onPress={() => {toggleCommentEdit()}}>
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
                          <CommentCard key={comment.id} {...comment} index={index} edit={commentEdit} deletion={setDeletion}/>
                        ))
                      )}
                    </View>

                </View>
              </>
          )}

          </View>

        </ScrollView>
      </View>
    </View>
  )
}

export default posts
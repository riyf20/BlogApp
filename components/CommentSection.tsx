import { View, Text } from 'react-native'
import React from 'react'
import { useAuthStore } from '@/utils/authStore';
import UserActionSheet from './UserActionSheet';

const CommentSection = ({ body, author, index, id, postid, fetchComments }: CommentSectionProps) => {

  return (
    <View
      className='mb-4 flex-row items-center'
      id={index.toString()}
    >
      <View className='flex-1 mr-2'>
        <Text className='text-xl font-semibold'>{author}</Text>
        <Text className='ml-4'>{body}</Text>
      </View>

        <UserActionSheet author={author} body={body} id={id} postid={postid} parent={'comment'} fetchComments={fetchComments}/>
    </View>
  )
}

export default CommentSection
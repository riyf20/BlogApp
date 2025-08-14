import { View, Text } from 'react-native'
import React from 'react'

const CommentSection = ({body, author, index}:CommentSectionProps) => {
  return (
    <View className='mb-4 ml-2' id={index.toString()}>
      <Text className='text-xl font-semibold'>{author}</Text>
      <Text className='ml-4'>{body}</Text>
    </View>
  )
}

export default CommentSection
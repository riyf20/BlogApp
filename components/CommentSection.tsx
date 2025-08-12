import { View, Text } from 'react-native'
import React from 'react'

const CommentSection = ({body, author, index}:CommentSectionProps) => {
  return (
    <View className='ml-4' id={index.toString()}>
      <Text className='text-lg font-semibold'>{author}</Text>
      <Text className='ml-2 mb-2'>{body}</Text>
    </View>
  )
}

export default CommentSection
import { View, Text, Button } from 'react-native'
import React from 'react'
import { useAuthStore } from '@/utils/authStore';



const profile = () => {
  
  const {logOut} = useAuthStore();
  return (
    <View className='justify-center items-center flex-1'>
      <Text>profile</Text>

      <Button title="Sign out" onPress={logOut}/>
    </View>
  )
}

export default profile
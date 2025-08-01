import { View,  } from 'react-native'
import React from 'react'
import { useAuthStore } from '@/utils/authStore';
import { Button, Text } from '@gluestack-ui/themed';



const profile = () => {
  
  const {logOut, token, user, username} = useAuthStore();
  return (
    <View className='justify-center items-center flex-1'>
      <Text className='my-8' >Profile Page</Text>
      <Text className='my-8' >Hello {user.username}</Text>

      <Button 
          size="md" variant="solid" action="primary" onPress={logOut} 
      >
          <Text className="font-bold text-xl" color='$white' size='lg'>Log out</Text>
      </Button>

    </View>
  )
}

export default profile
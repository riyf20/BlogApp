import { Pressable, View } from 'react-native'
import React, { useState } from 'react'
import { useAuthStore } from '@/utils/authStore'
import { Link, router } from 'expo-router';
import { Button, Input, InputField, Card, Heading, Text, FormControl, InputSlot, EyeIcon, EyeOffIcon, InputIcon } from '@gluestack-ui/themed';


const signIn = () => {
    
    const {logIn} = useAuthStore();
    const [text, setText] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const handleState = () => {
        setShowPassword((showState) => {
        return !showState
        })
    }

    return (

        <View className='flex-1 justify-center items-center bg-dark-100'>

            <FormControl className="p-4 border border-transparent rounded-xl bg-secondaryLight w-[80%] gap-6 pb-10">
                <Heading className="text-typography-900 self-center" color='$white' size="2xl" >
                    Login
                </Heading>

                <Input>
                    <InputField type="text" placeholder='Username'/>
                </Input>
                <Input className="text-center">
                    <InputField type={showPassword ? "text" : "password"} placeholder='Password'/>
                    <InputSlot className="pr-3" onPress={handleState}>
                    <InputIcon as={showPassword ? EyeIcon : EyeOffIcon} />
                    </InputSlot>
                </Input>

                <Button 
                    size="md" variant="solid" action="primary" onPress={logIn} 
                >
                    <Text className="font-bold text-xl" color='$white' size='lg'>Sign in</Text>
                </Button>

                <View className='pt-4 self-center'>
                    <Pressable onPress={() => router.push('/sign-up')}>
                        <Text color='$white'>Don't have an account? <Text color='$white' underline={true}>Sign up</Text></Text>
                    </Pressable>
                </View>
                
            </FormControl>

            
        </View>

    )
}

export default signIn
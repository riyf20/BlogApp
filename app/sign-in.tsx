import { Pressable, View } from 'react-native'
import React, { useState } from 'react'
import { useAuthStore } from '@/utils/authStore'
import { router } from 'expo-router';
import { Button, Heading, Text, FormControl, 
    FormControlErrorText, FormControlErrorIcon, 
    AlertCircleIcon, FormControlError, Divider,
    ButtonText,
} from '@gluestack-ui/themed';
import { loginGuestUser, loginUser } from '@/services/auth';
import FormInput from '@/components/FormInput';
import InfoModal from '@/components/InfoModal';
import { scheduleTokenRefresh } from '@/utils/authUtils';

const signIn = () => {
    
    const {logIn} = useAuthStore();

    // Username variable | username valid state 
    const [username, setUsername] = useState('');
    const [userInvalid, setUserInvalid] = useState(false);
    
    // Password variable | password valid state 
    const [password, setPassword] = useState('');
    const [passInvalid, setPassInvalid] = useState(false);

    // Valid state for the parent form
    const [invalid, setInvalid] = useState(false);

    // Error message for parent form or username/password
    const [error, setError] = useState('');

    // Dynamic modal to confirm actions
    const [showModal, setShowModal] = useState(false);

    const handleLogin = async () => {

        const requiredFields = [
            { value: username, setInvalid: setUserInvalid },
            { value: password, setInvalid: setPassInvalid },
        ];

        let hasEmptyField = false;

        // Loops through all fields to check if empty --> show error if true
        requiredFields.forEach(({ value, setInvalid }) => {
            if (!value.trim()) {
                setInvalid(true);
                hasEmptyField = true;
            }
        });

        if (hasEmptyField) {
            setInvalid(true);
            setError("Username and Password is required.");
            return;
        }

        // Attempts to login if no errors found
        try {
            const data = await loginUser(username, password);

            // Saves data to the backend Auth for persistant state
            logIn({
                token: data.token,
                user: data.user,
                username: data.username, 
                refreshToken: data.refreshToken,
            });
            // Sets timeout on log in
            scheduleTokenRefresh(data.token); 

        } catch (err: any) {
            // Catches messages from backend and any other errors
            if (err.message === 'User not found') {
                setUserInvalid(true);
                setError('User not found');
            } else if (err.message === 'Incorrect password') {
                setPassInvalid(true);
                setError('Incorrect password');
            } else {
                setError('An unexpected error occurred');
            }
        }
    };

    const handleGuestMode = async () => {

        // Attempts to guest login 
        try {
            const data = await loginGuestUser();

            // Saves data to the backend Auth for persistant state
            logIn({
                token: data.token,
                user: data.user,
                username: 'guest', 
                refreshToken: data.refreshToken,
            });

        } catch (err: any) {
            // Catches messages from backend and any other errors
            setError('An unexpected error occurred');
        }
    }

    return (

        <View className='flex-1 justify-center items-center bg-dark-200'>

            <FormControl className="p-4 border border-transparent rounded-xl bg-secondaryLight w-[80%] gap-6 pb-10"
                isInvalid={invalid}
            >
                <Heading className="text-typography-900 self-center" color='$white' size="2xl" >
                    Login
                </Heading>

                {/* Reuseable input component | username */}
                <FormInput invalid={userInvalid} placeholder={"Username"} value={username} parentInvalid={invalid} setValue={setUsername} setValueInvalid={setUserInvalid} setParentInvalid={setInvalid} error={error} />

                {/* Reuseable input component | password */}
                <FormInput invalid={passInvalid} placeholder={"Password"} value={password} parentInvalid={invalid} setValue={setPassword} setValueInvalid={setPassInvalid} setParentInvalid={setInvalid} error={error} /> 

                {/* Error message for the parent form (the FormControl above) */}
                {invalid &&
                    <FormControlError>
                        <FormControlErrorIcon as={AlertCircleIcon} />
                        <FormControlErrorText>
                            {error}
                        </FormControlErrorText>
                    </FormControlError>
                }

                <Button 
                    size="md" variant="solid" bg='#47a7a7' onPress={handleLogin}
                >
                    <Text className="font-bold text-xl" color='$white' size='lg'>Sign in</Text>
                </Button>

                <View className="self-center w-[75%]">
                    <Divider />
                </View>

                <View className='pt-4 self-center'>
                    <Pressable onPress={() => router.push('/sign-up')}>
                        <Text color='$white'>Don't have an account? <Text color='$white' underline={true}>Sign up</Text></Text>
                    </Pressable>
                </View>
                
            </FormControl>

            {/* Guest mode block */}
            <View className='p-4 border border-transparent rounded-xl bg-secondaryLight w-[80%] gap-2 mt-10 items-center'>
                <Text color='$white' bold={true} >Try the new Guest mode!</Text>
                <Button onPress={() => setShowModal(true)} bg='#1C2B33'>
                    <ButtonText>Guest Mode</ButtonText>
                </Button>
                
                <InfoModal showModal={showModal} setShowModal={setShowModal} heading={'Guest Mode'} body={"Don't want to make an account yet? Guest mode allows you toexperience what the app has to offer without a commitment."} buttonText={'Enter'} parent='signin' confirmFunction={handleGuestMode}/>

            </View>
        </View>

    )
}

export default signIn
import { Pressable, View } from 'react-native'
import React, { useState } from 'react'
import { AlertCircleIcon, Button, Divider, 
  FormControl, FormControlError, FormControlErrorIcon, 
  FormControlErrorText, Heading,Text } from '@gluestack-ui/themed'
import { useRouter } from 'expo-router';
import { loginUser, signupUser } from '@/services/auth';
import { useAuthStore } from '@/utils/authStore'
import { scheduleTokenRefresh } from '@/utils/authUtils';
import FormInput from '@/components/FormInput';
import { useHapticFeedback as haptic} from '@/components/HapticTab';



const signUp = () => {

  // For navigation
  const router = useRouter();

  // Persisted Data
  const {logIn} = useAuthStore();
  
  // Valid state for the main parent form (FormControl)
  const [invalid, setInvalid] = useState(false);

  // Username variable | username valid state 
  const [username, setUsername] = useState("");
  const [userInvalid, setUserInvalid] = useState(false);
  
  // Username variable | username valid state 
  const [password, setPassword] = useState("");
  const [passInvalid, setPassInvalid] = useState(false);
  
  // Username variable | username valid state 
  const [firstName, setFirstName] = useState("");
  const [firstNameInvalid, setFirstNameInvalid] = useState(false);
  
  // Username variable | username valid state 
  const [lastName, setLastName] = useState("");
  const [lastNameInvalid, setLastNameInvalid] = useState(false);
  
  // Username variable | username valid state 
  const [email, setEmail] = useState("");
  const [emailInvalid, setEmailInvalid] = useState(false);

  // Error message for parent form or input variables
  const [error, setError] = useState('');
  
  const handleSignUp = async () => {

    // Logic Checks
    const requiredFields = [
      { value: username, setInvalid: setUserInvalid },
      { value: password, setInvalid: setPassInvalid },
      { value: firstName, setInvalid: setFirstNameInvalid },
      { value: lastName, setInvalid: setLastNameInvalid },
      { value: email, setInvalid: setEmailInvalid },
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
      setError("Please fill missing fields.");
      return;
    }

    // Prevents users to use guest as it is reserved to interal processes
    if(username=='guest') {
      setUserInvalid(true);
      setError("Sorry that username is reserved.")
      return;
    }

      // Attempts sign up
      try {

        // Sends all info to api
        const signup = await signupUser(username, password, email, firstName, lastName);

        // On success it will login with the information entered
        try {

          // Attempts login
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

          // Throws error if the sign in (after initial signup) has failed
          setError(err.message);
        }

      } catch (error:any) { 

        // Throws error if signup failed
        setError(error.message)
      }

  }

  return (
      
    <View className='flex-1 justify-center items-center bg-dark-100'>

      <FormControl className="p-4 border border-transparent rounded-xl bg-secondaryLight w-[80%] gap-6 pb-10"
        isInvalid={invalid}
      >
        
        <Heading className="text-typography-900 self-center" color='$white' size="2xl">
          Sign Up
        </Heading>
          
        {/* Reuseable input component | username */}
        <FormInput invalid={userInvalid} placeholder={"Username"} value={username} parentInvalid={invalid} setValue={setUsername} setValueInvalid={setUserInvalid} setParentInvalid={setInvalid} error={error} />
        
        {/* Reuseable input component | password */}
        <FormInput invalid={passInvalid} placeholder={"Password "} value={password} parentInvalid={invalid} setValue={setPassword} setValueInvalid={setPassInvalid} setParentInvalid={setInvalid} error={error} />
      
        {/* Reuseable input component | first name */}
        <FormInput invalid={firstNameInvalid} placeholder={"First Name"} value={firstName} parentInvalid={invalid} setValue={setFirstName} setValueInvalid={setFirstNameInvalid} setParentInvalid={setInvalid} error={error} />
      
        {/* Reuseable input component | last name */}
        <FormInput invalid={lastNameInvalid} placeholder={"Last Name"} value={lastName} parentInvalid={invalid} setValue={setLastName} setValueInvalid={setLastNameInvalid} setParentInvalid={setInvalid} error={error} />
      
        {/* Reuseable input component | email */}
        <FormInput invalid={emailInvalid} placeholder={"Email"} value={email} parentInvalid={invalid} setValue={setEmail} setValueInvalid={setEmailInvalid} setParentInvalid={setInvalid} error={error} />

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
            size="md" variant="solid" bg='#47a7a7' onPress={handleSignUp} onPressIn={haptic()}
        >
          <Text className="font-bold text-xl" color='$white' size='lg'>Sign Up</Text>
        </Button>

        <View className="self-center w-[75%]">
          <Divider />
        </View>

        <View className='self-center'>
            <Pressable onPress={() => router.back()}> 
                <Text color='$white'>Already have an account? <Text color='$white' underline={true}>Log in</Text></Text>
            </Pressable>
        </View>
      </FormControl>

    </View>
  )
}

export default signUp
import { ScrollView, View,  } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useAuthStore } from '@/utils/authStore';
import {Button, ButtonIcon, Divider, EditIcon, 
  FormControl, Text } from '@gluestack-ui/themed';
import { clearRefreshToken, refreshExpiredToken, updateUserData, userData } from '@/services/auth';
import ProfileInput from '@/components/ProfileInput';
import InfoModal from '@/components/InfoModal';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { clearRefreshTimeout } from '@/utils/authUtils';


const profile = () => {
  
  const {token, user, username, refreshToken, logOut, setUsername, changeToken} = useAuthStore();
  
  const [error, setError] = useState('');

  // Store profile data from database
  const [profileData, setProfileData] = useState<UserProfile | null>(null);

  // Input fields for all data | show the previous values from database as default
  const [userInput, setUserInput] = useState('');
  const [passInput, setPassInput] = useState('');
  const [firstInput, setFirstInput] = useState('');
  const [lastInput, setLastInput] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [userID, setUserID] = useState(-1);

  // Input field's validity
  const [userInvalid, setUserInvalid] = useState(false);
  const [passInvalid, setPassInvalid] = useState(false);
  const [firstInvalid, setFirstInvalid] = useState(false);
  const [lastInvalid, setLastInvalid] = useState(false);
  const [emailInvalid, setEmailInvalid] = useState(false);
  
  // Disables input fields unless edit is toggled
  const [disabled, setDisabled] = useState(true);
  
  // Dynamic modal to confirm actions
  const [showModal, setShowModal] = useState(false);

  // Modal components
  const [heading, setHeading] = useState('');
  const [body, setBody] = useState('');
  const [buttonText, setButtonText] = useState('');
  const [parent, setParent] = useState('');

  // If any input fields were altered
  const [altered, setAltered] = useState(false);
  
  // Fetches profile data from database
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await userData(username, token); 

        setProfileData(data);

      } catch (err: any) {
        console.error('Fetch error:', err.message);
        setError('An unexpected error occurred');
      }
    }
    fetchProfile();
  }, [user, username, altered]);
  
  // Sets fetched data into fields | resets value back if user cancels edit mode
  useEffect(() => {
    if (profileData) {
      setUserInput(profileData.username || '');
      setPassInput(profileData.password_txt || '');
      setFirstInput(profileData.first_name || '');
      setLastInput(profileData.last_name || '');
      setEmailInput(profileData.email || '');
      setUserID(profileData.id || -1)
    }
    setUserInvalid(false);
    setPassInvalid(false);
    setFirstInvalid(false);
    setLastInvalid(false);
    setEmailInvalid(false);
    setAltered(false)
  }, [profileData, !disabled]);

  // Edit button toggle
  const toggleEdit = () => {
    setDisabled(!disabled);
  }

  // Checks to see if any changes were made | prevents redundant backend calls
  const checkChanges = () => {
    if (userInput===profileData?.username
      && passInput===profileData.password_txt
      && firstInput===profileData.first_name
      && lastInput===profileData.last_name
      && emailInput===profileData.email
    ) {
      // no fields have change
      return false;
    } else {
      // some fields have changed
      return true;
    }
  }
  
  // Saves changes to database
  const handleSaveChanges = async () => {

    // Logic Checks
    const requiredFields = [
      { value: userInput, setInvalid: setUserInvalid },
      { value: passInput, setInvalid: setPassInvalid },
      { value: firstInput, setInvalid: setFirstInvalid },
      { value: lastInput, setInvalid: setLastInvalid },
      { value: emailInput, setInvalid: setEmailInvalid },
    ];

    let hasEmptyField = false;

    // Loops through all fields to check if empty --> show error if true
    requiredFields.forEach(({ value, setInvalid }) => {
      if (!value.trim()) {
        setInvalid(true);
        hasEmptyField = true;
      }
    });

    setShowModal(false);

    if (hasEmptyField) {
      setError("Please fill the missing field.");
      return;
    }

    // Restricted username check
    if (userInput==='guest' || userInput==='Guest') {
      setUserInvalid(true);
      setError("Sorry that username is reserved.")
      return;
    }

    // Check for field changes
    const changes = checkChanges();
    if (!changes) {
      toggleEdit();
      return
    }

    // Formats data to be sent to backend
    const newdata = {fName:firstInput, lName:lastInput, userName:userInput, email:emailInput, password:passInput}

    try {
      const data = await updateUserData(username, userID, token, newdata); 

      // Stores new username if there was any changes made to it
      if (userInput !== profileData?.username) {
        setUsername(userInput); 
      }

      // Will trigger a data fetch with new information
      // Profile data null removes previous data | altered will trigger useEffect
      setProfileData(null);
      setAltered(true);

      // Disables fields
      setDisabled(true);

    } catch (err: any) {
      setError(`An unexpected error occurred: ${err.message}`);      
    }

  }
  
  // Changes modal information based on where its called 
  const modalConfirm = (type:string) => {

    // Called from the profile section
    if (type=='profile') {
      setHeading("Save changes?");
      setBody("Are you sure you want to save these changes? You will still be logged in after these changes.")
      setButtonText("Confirm")
      setParent("profile")
    } 
    // Called from logout button
    else if (type=='logout') {          
      setHeading("Log Out?");
      setBody("Are you sure you want to log out?")
      setButtonText("Log out")
      setParent("logout")
    }
    setShowModal(true)
  }

  // Does clean up on logout
  // Clears timer --> Removes Refresh token from database --> logouts
  const handleLogOut = () => {
    clearRefreshTimeout();
    clearRefreshToken(refreshToken, userID, token);
    logOut();
  }

  return (

    // Acts like a header for the page
    <View className="flex-1 bg-dark-100">

      <View className="justify-center items-center flex-row mt-20 px-4 mb-4">
        <Text color='$white' size='2xl' className="self-center" bold={true} >Hello {username}</Text>
      </View>

      <View className='items-center bg-white border border-transparent rounded-xl flex-1'>

        <ScrollView 
          className='w-[90%]' 
          contentContainerStyle={{
            justifyContent:"center",
            alignItems:"center",
            paddingBottom: 200,
          }}
          showsVerticalScrollIndicator={false}
          >

          {/* Profile / Account credentials section */}
          <Text className='mt-6 mb-2' size='2xl' bold={true} >Profile Settings</Text>
          <FormControl className="p-4 border border-transparent rounded-xl bg-dark-100 w-full gap-6 pb-8" >

            <Text color='$white' className='absolute top-6 left-4' size='xl' bold={true} >Account Information</Text>

            {/* Toggle Edit button */}
            <Button size="md" className="rounded-full p-3.5 self-end" bgColor={disabled ?  '#91A3B6' : '#228B22'} borderRadius={500} onPress={() => {toggleEdit()}}>
              <ButtonIcon as={EditIcon} />
              <Text color='$white' size='sm'> Edit</Text>
            </Button>
            
            <Divider/>

            {/* Reusable dynamic profile input components */}
            <ProfileInput title={"Username"} disabled={disabled} userInput={userInput} setInput={setUserInput} valid={userInvalid} setValid={setUserInvalid} error={error}/>
            
            <ProfileInput title={"Password"} disabled={disabled} userInput={passInput} setInput={setPassInput} valid={passInvalid} setValid={setPassInvalid} error={error}/>
            
            <ProfileInput title={"First Name"} disabled={disabled} userInput={firstInput} setInput={setFirstInput} valid={firstInvalid} setValid={setFirstInvalid} error={error}/>
            
            <ProfileInput title={"Last Name"} disabled={disabled} userInput={lastInput} setInput={setLastInput} valid={lastInvalid} setValid={setLastInvalid} error={error}/>
            
            <ProfileInput title={"Email"} disabled={disabled} userInput={emailInput} setInput={setEmailInput} valid={emailInvalid} setValid={setEmailInvalid} error={error}/>

            {/* Dynmaic buttons to save or cancel edits */}
            {!disabled && 
              <Animated.View 
                entering={FadeInDown
                  .springify()
                  .damping(100)
                  .mass(5)
                  .stiffness(500)
                  .duration(800)
                }
            >
              <View className='flex flex-row gap-2 mr-2'>
                <Button  size="md" variant="solid" action='negative' className='w-[50%]' onPress={toggleEdit}>
                  <Text className="font-bold text-xl" color='$white' size='md'>Cancel</Text>
                </Button>
                <Button  size="md" variant="solid" bg='#47a7a7' className='w-[50%]' onPress={() => {modalConfirm('profile')}}>
                  <Text className="font-bold text-xl" color='$white' size='md'>Save Changes</Text>
                </Button>
              </View>
            </Animated.View>
            }
            
            {/* Modal component */}
            <InfoModal showModal={showModal} setShowModal={setShowModal} heading={heading} body={body} buttonText={buttonText} parent={'profile'} confirmFunction={parent=='profile' ? handleSaveChanges : handleLogOut}/>

          </FormControl>

          
          {/* App Settings section */}
          <Text className='mt-6 mb-2' size='2xl' bold={true}>App Settings</Text>
          <View className="p-4 border border-transparent rounded-xl bg-dark-100 w-full gap-6 pb-6">
              <Button 
              size="md" variant="solid" action="negative" onPress={() => {modalConfirm('logout')}} 
            >
              <Text className="font-bold text-xl" color='$white' size='lg'>Log out</Text>
            </Button>
          </View>
          
        </ScrollView>
      </View>
    </View>    
  )
}

export default profile
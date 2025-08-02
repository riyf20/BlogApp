import { ScrollView, View,  } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useAuthStore } from '@/utils/authStore';
import { Button, ButtonIcon, Divider, EditIcon, 
  FormControl, Text } from '@gluestack-ui/themed';
import { userData } from '@/services/auth';
import ProfileInput from '@/components/ProfileInput';
import InfoModal from '@/components/InfoModal';



const profile = () => {
  
  const {logOut, token, user, username} = useAuthStore();
  
  const [error, setError] = useState('');

  // Store profile data from database
  const [profileData, setProfileData] = useState<UserProfile | null>(null);

  // Input fields for all data | show the previous values from database as default
  const [userInput, setUserInput] = useState(user.username);
  const [passInput, setPassInput] = useState(user.username);
  const [firstInput, setFirstInput] = useState(user.username);
  const [lastInput, setLastInput] = useState(user.username);
  const [emailInput, setEmailInput] = useState(user.username);
  
  // Disables input fields unless edit is toggled
  const [disabled, setDisabled] = useState(true);
  
  // Dynamic modal to confirm actions
  const [showModal, setShowModal] = useState(false);

  // Modal components
  const [heading, setHeading] = useState('');
  const [body, setBody] = useState('');
  const [buttonText, setButtonText] = useState('');
  const [parent, setParent] = useState('');
  
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
  }, [user]);
  
  // Sets fetched data into fields | resets value back if user cancels edit mode
  useEffect(() => {
    if (profileData) {
      setUserInput(profileData.username || '');
      setPassInput(profileData.password_txt || '');
      setFirstInput(profileData.first_name || '');
      setLastInput(profileData.last_name || '');
      setEmailInput(profileData.email || '');
    }
  }, [profileData, !disabled]);

  // Edit button toggle
  const toggleEdit = () => {
    setDisabled(!disabled);
  }
  
  // [TO-DO]: Saves any changes to the database
  const handleSaveChanges = () => {
    console.log("finish implementation")
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
          <Text className='mt-6 mb-2' size='2xl' bold={true} >Your Profile</Text>
          <FormControl className="p-4 border border-transparent rounded-xl bg-dark-100 w-full gap-6 pb-8">

            <Text color='$white' className='absolute top-6 left-4' size='lg' bold={true} >Account Information</Text>

            {/* Toggle Edit button */}
            <Button size="sm" className="rounded-full p-3.5 w-0 self-end" bgColor='#91A3B6' borderRadius={500} onPress={() => {toggleEdit()}}>
              <ButtonIcon as={EditIcon} />
            </Button>
            
            <Divider/>

            {/* Reusable dynamic profile input components */}
            <ProfileInput title={"Username"} disabled={disabled} userInput={userInput} setInput={setUserInput} />
            
            <ProfileInput title={"Password"} disabled={disabled} userInput={passInput} setInput={setPassInput} />
            
            <ProfileInput title={"First Name"} disabled={disabled} userInput={firstInput} setInput={setFirstInput} />
            
            <ProfileInput title={"Last Name"} disabled={disabled} userInput={lastInput} setInput={setLastInput} />
            
            <ProfileInput title={"Email"} disabled={disabled} userInput={emailInput} setInput={setEmailInput} />
            
            {/* Dynmaic buttons to save or cancel edits */}
            {!disabled && 
              <View className='flex flex-row gap-2 mr-2'>
                <Button  size="md" variant="solid" action='negative' className='w-[50%]' onPress={toggleEdit}>
                  <Text className="font-bold text-xl" color='$white' size='md'>Cancel</Text>
                </Button>
                <Button  size="md" variant="solid" bg='#47a7a7' className='w-[50%]' onPress={() => {modalConfirm('profile')}}>
                  <Text className="font-bold text-xl" color='$white' size='md'>Save Changes</Text>
                </Button>
              </View>
            }

            {/* Modal component */}
            <InfoModal showModal={showModal} setShowModal={setShowModal} heading={heading} body={body} buttonText={buttonText} parent={'profile'} confirmFunction={parent=='profile' ? handleSaveChanges : logOut}/>

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
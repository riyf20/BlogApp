import { View, Text } from 'react-native'
import React from 'react'
import { FormControlLabelText, Input, InputField } from '@gluestack-ui/themed';

// Custom/altered input fields for the profile page
const ProfileInput = ({title, disabled, userInput, setInput}: ProfileInputProps) => {
  return (
    <View>
        <FormControlLabelText color='$white' className='mb-2'>{title}</FormControlLabelText>
        <Input isDisabled={disabled}>
        <InputField type='text' value={userInput} className='bg-slate-50'
            onChangeText={(text) => {
                setInput(text);
            }}
        />
        </Input>
    </View>
  )
}

export default ProfileInput
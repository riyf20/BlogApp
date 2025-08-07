import { View, Text } from 'react-native'
import React from 'react'
import { AlertCircleIcon, FormControl, FormControlError, FormControlErrorIcon, FormControlErrorText, FormControlLabelText, Input, InputField } from '@gluestack-ui/themed';

// Custom/altered input fields for the profile page
const ProfileInput = ({title, disabled, userInput, setInput, valid, setValid, error}: ProfileInputProps) => {
  return (
    <View>
      <FormControl isInvalid={valid}>
          <FormControlLabelText color='$white' className='mb-2'>{title}</FormControlLabelText>
          <Input isDisabled={disabled}>
          <InputField type='text' value={userInput} className='bg-slate-50'
              onChangeText={(text) => {
                  setInput(text);
                  setValid(false);
              }}
          />
          </Input>
          {valid &&
            <FormControlError>
                <FormControlErrorIcon as={AlertCircleIcon} />
                <FormControlErrorText>
                  {error}
                </FormControlErrorText>
            </FormControlError>
          }
      </FormControl>
    </View>
  )
}

export default ProfileInput
import React, { useState } from 'react'
import { FormControl, Input, InputField, 
    FormControlError, FormControlErrorIcon, 
    AlertCircleIcon, FormControlErrorText, 
    InputSlot, InputIcon, EyeIcon, EyeOffIcon, 
    Textarea,
    TextareaInput
} from '@gluestack-ui/themed';

// This is a custom reusable input component that can render each input as well as its error states

// Definition of all props that will be entered
// FormInputProps = { 
//     invalid:boolean,                                    // The form's valid state | will help to indicate errors for users
//     placeholder:string,                                 // Text inside the input
//     value:string,                                       // Value of the input
//     parentInvalid:boolean,                              // Valid state of the parent form (from the page that is calling this component) 
//     setValue: (arg0: string) => void,                   // Changes the value of input on typing
//     setValueInvalid: (arg0: boolean) => void,           // Function to change the input's valid state
//     setParentInvalid: (arg0: boolean) => void,          // Function to change the parent component's valid state
//     error:string                                        // Any error message
//     textarea?:boolean                                   // Optional: textarea input
// };


const FormInput = ({invalid, placeholder, value, parentInvalid, setValue, setValueInvalid, setParentInvalid, error, textarea}: FormInputProps) => {

    // Used for password inputs
    const [showPassword, setShowPassword] = useState(false);

    // Changes visibility if icon was clicked
    const handleState = () => {
        setShowPassword(!showPassword);
    }

  return (
    <FormControl isInvalid={invalid} isRequired={true}>

        {/* Shows textarea  */}
        {textarea ? 
            <>
                <Textarea className='bg-slate-50'>
                    <TextareaInput 
                        type='text'
                        placeholder={placeholder} 
                        value={value} 
                        onChangeText={(text) => {
                            setValue(text);
                            setValueInvalid(false);
                            setParentInvalid(false); 
                        }}
                    />   
                </Textarea>            
            </>
        :
            <>
                {/* Regular input field */}
                <Input>
                    <InputField type={placeholder=='Password' && !showPassword ? 'password' : 'text'} placeholder={placeholder} value={value} className='bg-slate-50'
                        onChangeText={(text) => {
                            setValue(text);
                            setValueInvalid(false);
                            setParentInvalid(false); 
                        }}
                    />

                    {/* Shows visibility icon if input is password */}
                    {placeholder=='Password' && 
                        <InputSlot className="pr-3 bg-slate-50" onPress={handleState}> 
                            <InputIcon as={showPassword ? EyeIcon : EyeOffIcon} />
                        </InputSlot> 
                    }

                </Input>

                {/* Will show error if invalid states are true */}
                {invalid && !parentInvalid &&
                    <FormControlError>
                        <FormControlErrorIcon as={AlertCircleIcon} />
                        <FormControlErrorText>
                            {error}
                        </FormControlErrorText>
                    </FormControlError>
                }
            </>
        }
    </FormControl>
  )
}

export default FormInput
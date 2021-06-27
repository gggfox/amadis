import React, { InputHTMLAttributes } from 'react'
import { useField } from "formik";
import { FormControl, FormLabel, FormErrorMessage, NumberInputField, NumberInput, NumberInputStepper, NumberIncrementStepper, NumberDecrementStepper } from "@chakra-ui/react";

type NumInputFieldProps = InputHTMLAttributes<HTMLInputElement> & {
    label: string;
    name: string;
    defaultValue?: number;
    max?: number;
    min?: number;
    step?: number;
};

export const NumInputField: React.FC<NumInputFieldProps> = ({label,   size: _, ...props}) => {
    const [field, meta, helpers] = useField(props);
    //const { value } = meta;
    const { setValue } = helpers;
    const handleChange =  (event:any) => {

        setValue(parseInt(event?.target.value))
    }
        return (    
            <FormControl isInvalid={!!meta.error} h="100%">
                <FormLabel color="wl" htmlFor={field.name}>{label}</FormLabel>
                <NumberInput color="wl" id={field.name} {...field} >
                    <NumberInputField onChange={handleChange}/>
                    <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                    </NumberInputStepper>
                </NumberInput>
                {meta.error ? <FormErrorMessage>{meta.error}</FormErrorMessage> : null}
            </FormControl>
        ); 


}
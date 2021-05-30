import React, { InputHTMLAttributes } from 'react'
import { useField } from "formik";
import { FormControl, FormLabel, Input, FormErrorMessage } from "@chakra-ui/react";

type InputFieldProps = InputHTMLAttributes<HTMLInputElement> & {
    label: string;
    name: string;
};

export const InputField: React.FC<InputFieldProps> = ({label, size: _, ...props}) => {
    const [field, {error}] = useField(props);
    return (    
        <FormControl isInvalid={!!error} h="100%">
            <FormLabel color="snowStorm.0" htmlFor={field.name}>{label}</FormLabel>
            <Input color="snowStorm.0" {...field} {...props} id={field.name} />
            {error ? <FormErrorMessage>{error}</FormErrorMessage> : null}
        </FormControl>
    );
}
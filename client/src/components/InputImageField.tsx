import React, { InputHTMLAttributes } from 'react'
import { useField } from "formik";
import { FormControl, FormLabel, Input, FormErrorMessage } from "@chakra-ui/react";

type InputImageFieldProps = InputHTMLAttributes<HTMLInputElement> & {
    label: string;
    name: string;
};

export const InputImageField: React.FC<InputImageFieldProps> = ({label, size: _, ...props}) => {
    const [field, {error}] = useField(props);
    return (    
        <FormControl isInvalid={!!error} h="100%">
            <FormLabel color="snowStorm.0" htmlFor={field.name} mt={4}>{label}</FormLabel>
            <Input color="snowStorm.0" {...field} {...props} id={field.name} border="none" p={0}/>
            {error ? <FormErrorMessage>{error}</FormErrorMessage> : null}
        </FormControl>
    );
}
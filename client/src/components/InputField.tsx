import React, { InputHTMLAttributes } from 'react'
import { useField } from "formik";
import { FormControl, FormLabel, Input, FormErrorMessage, Textarea } from "@chakra-ui/react";

type InputFieldProps = InputHTMLAttributes<HTMLInputElement> & {
    textarea: boolean;
    label: string;
    name: string;
};

export const InputField: React.FC<InputFieldProps> = ({textarea,label, size: _, ...props}) => {
    const [field, {error}] = useField(props);
    if(textarea){
        return (    
            <FormControl isInvalid={!!error} h="100%">
                <FormLabel color="snowStorm.0" htmlFor={field.name}>{label}</FormLabel>
                <Textarea color="snowStorm.0" {...field}  id={field.name} placeholder="texto..." size="md" resize="vertical" rows={4} wrap="none" textLength="5" cols={4}/>
                {error ? <FormErrorMessage>{error}</FormErrorMessage> : null}
            </FormControl>
        ); 
    }else{
        return (    
            <FormControl isInvalid={!!error} h="100%">
                <FormLabel color="snowStorm.0" htmlFor={field.name}>{label}</FormLabel>
                <Input color="snowStorm.0" {...field} {...props} id={field.name} />
                {error ? <FormErrorMessage>{error}</FormErrorMessage> : null}
            </FormControl>
        );
    }

}
import React, { ChangeEvent, InputHTMLAttributes } from 'react'
import { useField } from "formik";
import { FormControl, FormLabel, Input, FormErrorMessage, Textarea } from "@chakra-ui/react";

type InputFieldProps = InputHTMLAttributes<HTMLInputElement> & {
    textarea: boolean;
    label: string;
    name: string;
    char_limit?:number;
    hide_label?:boolean;
};

export const InputField: React.FC<InputFieldProps> = ({textarea,label, size: _, char_limit=100, hide_label=false, ...props}) => {
    const [field, meta, helpers ] = useField(props);
    const { value } = meta;
    const { setValue } = helpers;

    const handleChange =  (event:(ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement> | void)) => {
        if(!event || event?.target?.value.length > char_limit){
            return;
        } 
        setValue(event?.target.value)
    }


    if(textarea){
        return (    
            <FormControl isInvalid={!!meta.error} h="100%">
                <FormLabel 
                  color="wl" 
                  htmlFor={field.name}
                >
                   
                     {label}{hide_label ? (null):`(${char_limit - value.length})`} 
                </FormLabel>
                <Textarea 
                  id={field.name}
                  color="wl" 
                  {...field}   
                  placeholder="texto..." 
                  size="md" 
                  resize="vertical" 
                  rows={4} 
                  wrap="none" 
                  textLength="5" 
                  cols={4} 
                  onChange={handleChange}
                />
                {meta.error 
                  ? <FormErrorMessage>{meta.error}</FormErrorMessage> 
                  : null
                }
            </FormControl>
        ); 
    }else{
        return (    
            <FormControl isInvalid={!!meta.error} h="100%">
                <FormLabel 
                  color="wl" 
                  htmlFor={field.name}
                >
                                    
                {label}{hide_label ? (null):`(${char_limit - value.length})`} 
                </FormLabel>
                <Input 
                  id={field.name}
                  color="wl" 
                  {...field} 
                  {...props}  
                  onChange={handleChange}
                />
                {meta.error 
                  ? <FormErrorMessage>{meta.error}</FormErrorMessage> 
                  : null
                }
            </FormControl>
        );
    }

}
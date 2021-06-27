import React from 'react'
import {Box, Link } from "@chakra-ui/react";

type CategoryFieldProps = {
    name:string;
};

export const Category: React.FC<CategoryFieldProps> = ({name}) => {
    return(
            <Box 
            id={name}
            color= "pd"
            width="fit-content" 
            border="2px" 
            mr={2}
            mt={2} 
            p={2} 
            borderRadius={20}
            _hover={{ bg: "bd" }}
            >
                {"#"+name}  
            </Box>      
    )
}
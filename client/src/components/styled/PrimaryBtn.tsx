import { Box, Button } from '@chakra-ui/react';
import React from 'react'

interface PrimaryBtnProps {
    text: string,
}

export const PrimaryBtn: React.FC<PrimaryBtnProps> = ({text, ...props}) => {

    return (
        <Button 
          my={4} 
          bg="pd"
          w="100%"
          borderWidth={2}
          borderColor="pd"
          color="wl"
          borderRadius={10}
          _hover={{color:"wl",borderColor:"wl"}}
          {...props}
        > 
            {text} 
        </Button>
    );
};
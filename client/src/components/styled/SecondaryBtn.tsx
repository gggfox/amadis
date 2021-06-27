import { Box, Button } from '@chakra-ui/react';
import React from 'react'

interface SecondaryBtnProps {
    text: string,
}

export const SecondaryBtn: React.FC<SecondaryBtnProps> = ({text}) => {

    return (
        <Button 
        aria-label={text} 
        bg="bl"
        borderWidth={2}
        borderColor="pd"
        borderRadius={10}
        w="100%"
        color="pd"
        _hover={{color:"wl",borderColor:"wl"}}
        > 
            {text} 
        </Button>
    );
};
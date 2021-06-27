import React from 'react'
import { Box } from "@chakra-ui/react"

interface WrapperProps {
    variant?: 'small' | 'regular';
    bg?: 'bd' | 'bl';
}

export const Wrapper: React.FC<WrapperProps> = ({children, variant='regular', bg='bl'}) => {
        return (
            <Box 
              mt={6} 
              maxW={variant === 'regular' ? '800px' : '400px'} 
              w='100%' 
              bg={bg}
              p={5}
              borderRadius={20}
              boxShadow={bg === 'bl' ? 'lg' : 'none'}
            >
                {children}
            </Box>
        );
}
import { Box, Flex } from '@chakra-ui/react';
import React from 'react'
import { NavBar } from './NavBar'
import { Title } from './Title';

export type WrapperVariant = "small" | "regular";

interface LayoutProps {
    variant?: WrapperVariant;
}

export const Layout: React.FC<LayoutProps> = ({children, variant}:any) => {
        return (
            <Box h="100%" w="100%">
                <Flex
                h="100%"
                w="100%"
                alignItems="center"
                flexDirection="column">
                <Flex mb="auto" flexGrow={1} w="100%" flexDirection="column" alignItems="center">
                    <Title variant={variant}/>
                    {children}
                </Flex>

                <Box 
                  w="100%" 
                  position="fixed" 
                  bottom={0}
                >
                    <NavBar/>
                </Box>
                </Flex>
                <Box mb={200}></Box>
            </Box>
            );
}
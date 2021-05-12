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
            <Box h="100%">
                <div id="fb-root"></div>
                <script async defer crossOrigin="anonymous" 
                    src="https://connect.facebook.net/es_LA/sdk.js#xfbml=1&version=v10.0&appId=125098359587197&autoLogAppEvents=1" 
                    nonce="cQiNFQyf">
                </script>
                <Flex
                h="100%"
                flexDirection="column">
                <Box mb="auto" flexGrow={1}>
                <Title variant={variant}/>
                    {children}
                </Box>
                <Box w="100%" position="fixed" bottom={0}>
                    <NavBar/>
                </Box>
                </Flex>
            </Box>
            );
}
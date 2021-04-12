import React from 'react'
import { Box, Button, Flex, Icon, Link } from '@chakra-ui/react';
import NextLink from 'next/link';
import { useLogoutMutation, useMeQuery } from '../generated/graphql';
import { isServer } from '../utils/isServer';
import {MdShoppingCart} from 'react-icons/md';
import {BsFillHouseDoorFill} from 'react-icons/bs'
import { useApolloClient } from '@apollo/client';

interface NavBarProps {

}

export const NavBar: React.FC<NavBarProps> = ({}) => {
    const [logout,{loading: logoutFetching}] = useLogoutMutation();
    const apolloClient = useApolloClient();
    const {data, loading} = useMeQuery({
        skip: isServer(), //
    });

    let basic = (
        <>
    
    <NextLink href="/">
        <Link color="white"><Icon as={BsFillHouseDoorFill} boxSize={8}/></Link>
    </NextLink>
    <Icon as={MdShoppingCart}/></>)
    let body = basic;

    if(loading) {//data is loading
        body = basic;
    }
    
    if(!data?.me) {
        // user isnt logged in
        
        body = 
        (<>
            {basic}
            <NextLink href='/login'>
                <Link color="white" mr={2}>login</Link>
            </NextLink>
            <NextLink href='/register'>
                <Link color="white">registrate</Link>
            </NextLink>
        </>);
    }else{
        //is logged in
        body = (
            <Flex>
                {basic}
                <Box ml={2} mr={2}>
                    {data.me.username}[{data.me.userType}]
                </Box>
                <Button 
                    onClick={async() => {
                        await logout();
                        await apolloClient.resetStore();
                    }} 
                    isLoading={logoutFetching}
                    variant="link">
                        logout
                </Button>
            </Flex>)
    }

    return (
        <Flex 
          zIndex={1} 
          bg="polarNight.1" 
          p={4}
          justifyContent="center"
        >
            <Box>
                {body}
            </Box>
        </Flex>
    );
}
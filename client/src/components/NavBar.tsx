import React from 'react'
import { Box, Button, Flex, Icon, Link } from '@chakra-ui/react';
import NextLink from 'next/link';
import { useLogoutMutation, useMeQuery } from '../generated/graphql';
import { isServer } from '../utils/isServer';
import {BsFillHouseDoorFill,BsFillPersonFill,BsFillHeartFill,BsSearch} from 'react-icons/bs'
import { useApolloClient } from '@apollo/client';

interface NavBarProps {

}

export const NavBar: React.FC<NavBarProps> = ({}) => {
    const [logout,{loading: logoutFetching}] = useLogoutMutation();
    const apolloClient = useApolloClient();
    const {data, loading} = useMeQuery({
        skip: isServer(), //
    });

   
 
    const personLink = (!data?.me)?(
        <NextLink href="/login">
            <Link color="frost.1">
                <Icon as={BsFillPersonFill} boxSize={8}></Icon>
            </Link>
        </NextLink> 
    ):(
        <Flex>
        <NextLink href="/user/[id]" as={`/user/${data?.me?.id}`}>
            <Link color="frost.1">
                <Icon as={BsFillPersonFill} boxSize={8}></Icon>
            </Link>
        </NextLink>
        <Box ml={2} mr={2}>
            {data?.me?.username}[{data?.me?.userType}]
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
        </Flex>
    );
    

    const basic = (
        <Flex>
        <NextLink href="/">
            <Link color="frost.1">
                <Icon as={BsFillHouseDoorFill} boxSize={8} mr={4}/>
            </Link>
        </NextLink>
        <NextLink href="/categories">
            <Link color="frost.1">
                <Icon as={BsSearch} boxSize={8} mr={4}/>
            </Link>
        </NextLink>
        <NextLink href="/savedProducts">
            <Link color="frost.1">
                <Icon as={BsFillHeartFill} boxSize={8} mr={4}/>
            </Link>
        </NextLink>
        {personLink}

    </Flex>)

    if(loading) {//data is loading
      //should have a page skeleton here
    }
    
    return (
        <Flex 
          zIndex={1} 
          bg="polarNight.1" 
          p={4}
          justifyContent="center"
          flexDirection="row"
        >
            <Box>
                {basic}
            </Box>
        </Flex>
    );
}
import React, { useState } from 'react'
import { Box, Flex, Icon, Link } from '@chakra-ui/react';
import NextLink from 'next/link';
import { useMeQuery } from '../generated/graphql';
import { isServer } from '../utils/isServer';
import {BsHouseDoorFill, BsFillPersonFill,BsFillHeartFill, BsSearch} from 'react-icons/bs'
import { useApolloClient } from '@apollo/client';
import { useRouter } from 'next/router';


export const NavBar:React.FC = () => {
    const router = useRouter();
    const path = router.pathname;
    
    const apolloClient = useApolloClient();
    const {data, loading} = useMeQuery({
        skip: isServer(), //
    });
     
    const basic = (
        <Flex>
            <Box 
              borderTopWidth={3} 
              borderColor={path === "/" ? "pd" : "bl"} 
              borderRadius={3}
            >
                <NextLink href="/">
                    <Link color="pd">
                        <Icon 
                        as={BsHouseDoorFill} 
                        boxSize={8} 
                        m={2}
                        />
                    </Link>
                </NextLink>
            </Box>
            <Box 
              borderTopWidth={3}
              borderColor={path === "/categories" ? "pd" : "bl"} 
              borderRadius={3}
            >
                <NextLink  href="/categories">
                    <Link color="pd">
                        <Icon 
                        as={BsSearch} 
                        boxSize={8} 
                        m={2}
                        />
                    </Link>
                </NextLink>
            </Box>
            <Box 
              borderTopWidth={3} 
              borderColor={path === "/savedProducts" ? "pd" : "bl"} 
              borderRadius={3}
            >
                <NextLink href="/savedProducts">
                    <Link color="pd">
                        <Icon 
                        as={BsFillHeartFill} 
                        boxSize={8} 
                        m={2}            
                        onClick={async() => {
                            await apolloClient.resetStore();
                        }} 
                        />
                    </Link>
                </NextLink>
            </Box>
            <Box 
              borderTopWidth={3} 
              borderColor={router.asPath == `/user/${data?.me?.id}` ? "pd" : "bl"} 
              borderRadius={3}
            >
            <NextLink 
                href={!data?.me ? "/login" : "/user/[id]"} 
                as={!data?.me ? "/login" : `/user/${data?.me?.id}`}
            >
                <Link color="pd">
                    <Icon 
                      as={BsFillPersonFill} 
                      boxSize={8}
                      m={2}  
                    />
                </Link>
            </NextLink> 
            </Box>
        </Flex>
    )

    if(loading) {//data is loading
      //should have a page skeleton here
    }
    
    return (
        <Flex 
          zIndex={1} 
          bg="bl" 
          borderColor="bd"
          borderStyle="solid"
          borderTopWidth={2}
          justifyContent="center"
          flexDirection="row"
        >
            {basic}
            
        </Flex>
    );
}
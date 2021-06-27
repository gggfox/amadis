import { useApolloClient } from '@apollo/client';
import { Box, Divider, Flex, Grid, GridItem, Icon, Link, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure } from '@chakra-ui/react';
import React, { useState } from 'react';
import { useLogoutMutation } from '../generated/graphql';
import { AddSocialMedia } from './AddSocialMedia';
import { ChooseCategories4Promotor } from './ChooseCategories4Promotor';
import { BsThreeDots } from 'react-icons/bs';

interface ProfileOptionsProps {
    userId: number,
}

export const ProfileOptions:React.FC<ProfileOptionsProps> = ({userId, ...props}) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [ title, setTitle ] = useState("opciones");
    const [logout,{loading: logoutFetching}] = useLogoutMutation();
    const apolloClient = useApolloClient();

    const deleteCookie = async () => {
        await logout();
        await apolloClient.resetStore();
        onClose()
    }

    const openModal = () => {
        setTitle("opciones")
        onOpen()
    }

    return (
            <Box>
            <Link>
                <Icon onClick={ openModal } _hover={{}} as={BsThreeDots} color="wl" boxSize={8}/>
            </Link>
             
          
          <Modal isOpen={isOpen} onClose={onClose} >
            <ModalOverlay />
            <ModalContent bg="bl">
              <ModalHeader color="wl">
                  {(title === "opciones")?(title):(
                   
                    <Grid
                templateRows="repeat(1, 1fr)"
                templateColumns="repeat(12, 1fr)"
                gap={1}
              >
                    <GridItem colSpan={4} colStart={1} >
                    <Link  color="wl" onClick={() => setTitle("opciones")}>
                        atras
                    </Link>
                    </GridItem>
                    <GridItem colSpan={6} colStart={5}>
                    {title.toUpperCase()}
                    </GridItem>
                </Grid>

                  
                  )}
              </ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                {!(title === "opciones")?(null):(
                <Flex flexDirection="column" align="center" w="100%">
                <Link color="wl" onClick={() => setTitle("redes")} w="100%">
                    <Box align="center">Agregar red social</Box>
                </Link>
                <Divider my={4}/>
                <Link color="wl"onClick={() => setTitle("categorias")}  w="100%">
                <Box align="center">Elegir categorias</Box>
                </Link>
                <Divider my={4}/>
                <Link color="rl" onClick={() => deleteCookie()}  w="100%">
                <Box align="center">logout</Box>
                    
                </Link>
                </Flex>
                )}

                {!(title === "redes")?(null):(
                <Flex flexDirection="column" align="center">
             
                <AddSocialMedia userId={userId}/>
                </Flex>
                )}
              
              {!(title === "categorias")?(null):(
                <Flex flexDirection="column" align="center">
                    <ChooseCategories4Promotor promotorId={userId}/>
                </Flex>
                )}
                </ModalBody>
                <ModalFooter/>
            </ModalContent>
        </Modal>
        </Box> 

        );
}
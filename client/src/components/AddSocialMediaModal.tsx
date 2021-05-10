import { AddIcon } from '@chakra-ui/icons';
import { Box, Button, Flex, FormControl, FormLabel, Icon, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure } from '@chakra-ui/react';
import { Field, Form, Formik } from 'formik';
import { useRouter } from 'next/router';
import React from 'react';
import { useAddSocialMediaMutation } from '../generated/graphql';
import { InputField } from './InputField';

interface AddSocialMediaModalProps {
    userId: number,
}

export const AddSocialMediaModal:React.FC<AddSocialMediaModalProps> = ({userId}) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [addSocialMedia] = useAddSocialMediaMutation();
    const router = useRouter();
    return (
        <>
        <Button onClick={onOpen}>
            <Icon as={AddIcon} boxSize={8}/>
        </Button>
        <Modal isOpen={isOpen} onClose={onClose} >
            <ModalOverlay />
            <ModalContent bg="polarNight.1">
                <ModalHeader color="snowStorm.1">Redes Sociales</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <Box color="snowStorm.1">Agrega una red social</Box>
                    
                    <Formik
                        initialValues={{ social_media: "", link:"" }}

                        onSubmit={async (values) => {
                            console.log(values)
                            const {errors} = await addSocialMedia({variables: values,
                            update: (cache) => {
                                cache.evict({id: "User:" + userId});
                            }
                            });
                            if(errors){
                                router.push("/");
                            }
                        }}
                        >
                            {({isSubmitting}) => (
                                <Form>
                                    <Flex justifyContent="center">
                                    <FormControl flex={1}>
                                    <FormLabel color="snowStorm.0" htmlFor="social_media"></FormLabel>
                                    <Field as="select" name="social_media" bg="white">
                                    <option value="Facebook" >Facebook</option>
                                    <option value="Instagram" selected>Instagram</option>
                                    <option value="TikTok">TikTok</option>
                                    <option value="Youtube">Youtube</option>
                                    <option value="Spotify">Spotify</option>
                                    </Field>
                                    </FormControl>

                                    <InputField
                                    textarea={false}
                                    name="link"
                                    placeholder="enlace/link"
                                    label=""
                                    />
                                   
                                    </Flex>
                                    <Button 
                                    mt={6} 
                                    ml="50%"
                                    type='submit' 
                                    isLoading={isSubmitting} 
                                    bg="frost.1"
                                    w="50%"
                                    >
                                        añadir red social
                                    </Button>

                                </Form>
                            )}
                        </Formik>

                </ModalBody>

                <ModalFooter>
                   
                </ModalFooter>
            </ModalContent>
        </Modal>
        </>
        );
}


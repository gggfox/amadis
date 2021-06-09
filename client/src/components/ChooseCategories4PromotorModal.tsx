import { AddIcon } from '@chakra-ui/icons';
import { Box, Button, Flex, Icon, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure } from '@chakra-ui/react';
import { Field, Form, Formik } from 'formik';
import { useRouter } from 'next/router';
import React from 'react';
import { Category, useCategoryQuery, useChooseCategories4PromotorMutation } from '../generated/graphql';
import { CategoryCheckBox } from './CategoryCheckBox';

interface ChooseCategories4PromotorModalProps {
    promotorId: number,
}

export const ChooseCategories4PromotorModal:React.FC<ChooseCategories4PromotorModalProps> = ({promotorId}) => {
    const { isOpen, onOpen, onClose } = useDisclosure();

    const [chooseCategories] = useChooseCategories4PromotorMutation();
    const {data, error, loading} = useCategoryQuery();

    const router = useRouter();
    return (
        <>
        <Button onClick={onOpen}>
            <Icon as={AddIcon} boxSize={8}/>
        </Button>
        <Modal isOpen={isOpen} onClose={onClose} >
            <ModalOverlay />
            <ModalContent bg="polarNight.1">
                <ModalHeader color="snowStorm.1">Categorias</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <Box color="snowStorm.1">Elige hasta 5 categorias</Box>
                    
                    <Formik
                        initialValues={{ id: promotorId, categories:[] }}

                        onSubmit={async (values) => {
                            console.log(values)
                            const {errors} = await chooseCategories({variables: values,
                            update: (cache) => {
                                cache.evict({id: "User:" + promotorId});
                            }
                            });
                            if(errors){
                                router.push("/");
                            }
                        }}
                        >

                            {({isSubmitting}) => (
                                <Form>
                                    <Flex>

                                    {!loading && !data 
                                    ?(<div>
                                            <div>you got no categories for some reason</div>
                                            <div>{error?.message}</div>
                                    </div>)
                                    :(!data?.allCategories && loading 
                                        ?(<div>loading...</div>) 
                                        :(<div role="group" aria-labelledby="checkbox-group">
                                            <Flex flexDirection="row" flexWrap="wrap">
                                                {data!.allCategories.map((c) => 
                                                !c 
                                                ? null 
                                                :(
                                                    <CategoryCheckBox c={c as Category} filedName={"categories"}/>
                                                ))
                                                }
                                            </Flex>
                                        </div>)
                                    )
                                    }
                                   
                                    </Flex>
                                    <Button 
                                    mt={6} 
                                    ml="50%"
                                    type='submit' 
                                    isLoading={isSubmitting} 
                                    bg="frost.1"
                                    w="50%"
                                    >
                                    elegir categorias                                    
                                    </Button>

                                </Form>
                            )}
                        </Formik>
                </ModalBody>
                <ModalFooter></ModalFooter>
            </ModalContent>
        </Modal>
        </>
        );
}

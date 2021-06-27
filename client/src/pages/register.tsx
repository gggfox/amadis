import React from 'react'
import {Formik, Form} from 'formik';
import { Box, Button, Flex, Heading, Link } from '@chakra-ui/react';
import { Wrapper } from "../components/Wrapper";
import { InputField } from '../components/InputField';
import { MeDocument, MeQuery, useRegisterMutation } from '../generated/graphql';
import { toErrorMap } from '../utils/toErrorMap';
import { useRouter } from 'next/router';
import { Layout } from '../components/Layout';
import NextLink from 'next/link';
import { withApollo } from '../utils/apollo/withApollo';
import { PrimaryBtn } from '../components/styled/PrimaryBtn';
interface registerProps {}

const Register: React.FC<registerProps> = ({}) => {
    const router = useRouter();
    const [register] = useRegisterMutation();
    return (
        
        <Layout variant="small">
            <Wrapper variant="small">
        <Formik
            initialValues={{ email: "", username: "", password: "", confirmation: "" }}
            onSubmit={async (values,{setErrors}) => {
                console.log(values);
                const response = await register({variables: {options: values},
                    update: (cache, {data}) => {
                        cache.writeQuery<MeQuery>({
                            query: MeDocument,
                            data: {
                                __typename: "Query",
                                me: data?.register.user,
                            }
                        })
                    }
                });//return promise to stop infinite spinning
                if(response.data?.register.errors) {
                    setErrors(toErrorMap(response.data.register.errors));
                }else if (response.data?.register.user){
                    router.push('/');

                }
            }}
        >
            {({isSubmitting}) => (
                <Form>
                    <InputField
                      textarea={false}
                      name="username"
                      placeholder="usuario"
                      label="Usuario"
                    />
                    <Box my={5}>
                        <InputField
                          textarea={false} 
                          name="email" 
                          placeholder="email" 
                          label="Email"
                        />
                    </Box>
                    
                    <InputField
                      textarea={false}
                      name="password"
                      placeholder="contraseña"
                      label="Contraseña"
                      type="password"
                    />
                   
                    <Box my={5}>
                    <InputField
                      textarea={false}
                      name="confirmation"
                      placeholder="confirmar contraseña"
                      label="Confirmacion"
                      type="password"
                    />
                    </Box>
                    <Button 
                      variant="unstyled"
                      mb={5} 
                      type='submit' 
                      isLoading={isSubmitting} 
                      w="100%"
                    >
                        <PrimaryBtn text={"Crear Cuenta"}/>
                    </Button>

                </Form>
            )}
        </Formik>
        </Wrapper>

        <Flex mb={20} w="100%" justifyContent="center">
            <Wrapper variant="small">
                <Flex alignItems="center" flexDirection="column">
                    <Heading size="1xl" color="wl">¿Ya tienes cuenta?</Heading>
                    <NextLink href='/login'>
                        <Link color="pd">Ingresa a tu cuenta</Link>
                    </NextLink>
                </Flex> 
            </Wrapper>
        </Flex>
        </Layout>  
    );
}

export default  withApollo({ssr: false})(Register);//no ssr
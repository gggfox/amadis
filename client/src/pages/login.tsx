import React from 'react'
import {Formik, Form} from 'formik';
import { Box, Button, Flex, Heading, Link } from '@chakra-ui/react';
import { InputField } from '../components/InputField';
import { MeDocument, MeQuery, useLoginMutation } from '../generated/graphql';
import { toErrorMap } from '../utils/toErrorMap';
import { useRouter } from 'next/router';
import NextLink from 'next/link';
import { Layout } from '../components/Layout';
import { Wrapper } from '../components/Wrapper';
import { withApollo } from '../utils/withApollo';

const Login: React.FC<{}> = ({}) => {
    const router = useRouter();
    const [login] = useLoginMutation();
    return (
       
        <Layout variant="small">
        <Wrapper variant="small">
        <Formik
            initialValues={{ usernameOrEmail: "", password: "" }}
            onSubmit={async (values,{setErrors}) => {
                const response = await login({
                    variables: values, 
                    update: (cache, {data}) =>{ 
                        cache.writeQuery<MeQuery>({
                        query: MeDocument,
                        data: {
                            __typename: "Query",
                            me: data?.login.user,
                        }
                    });
                    cache.evict({fieldName: "posts:{}"})
                }
                });//return promise to stop infinite spinning
                if(response.data?.login.errors) {
                    setErrors(toErrorMap(response.data.login.errors));
                }else if (response.data?.login.user){
                    if(typeof router.query.next === "string") {
                        router.push(router.query.next);
                    }else{
                        router.push("/");
                    }

                }
            }}
        >
            {({isSubmitting}) => (
                <Form>
                    <InputField
                    name="usernameOrEmail"
                    placeholder="usuario o email"
                    label="Usuario o Email"
                    />
                    <Box mt={4}>
                    <InputField
                    name="password"
                    placeholder="contraseña"
                    label="Contraseña"
                    type="password"
                    /></Box>
            
                    <Button 
                      mt={4} 
                      type='submit' 
                      isLoading={isSubmitting} 
                      bg="frost.1"
                      w="100%"
                      borderRadius={25}
                    >
                     login 
                    </Button>
                    
                    <Flex justifyContent="center">
                        <NextLink href="/forgot-password">
                            <Link color="frost.1" mt={3}>¿Olvidaste tu constraseña?</Link>
                        </NextLink>
                    </Flex>
                    <div id="fb-root"></div>
                    <script async defer crossOrigin="anonymous" 
                        src="https://connect.facebook.net/es_LA/sdk.js#xfbml=1&version=v10.0&appId=125098359587197&autoLogAppEvents=1" 
                        nonce="cQiNFQyf">
                    </script>
                </Form>
            )}
        </Formik>
        </Wrapper>
                <Wrapper variant="small">
            <Flex alignItems="center" flexDirection="column">
                <Heading size="1xl" color="snowStorm.0">¿No tienes cuenta?</Heading>
                <NextLink href='/register'>
                    <Link color="frost.1">Crea una cuenta</Link>
                </NextLink>
            </Flex>
        </Wrapper>
        </Layout>
        
    );
}


export default  withApollo({ssr: false})(Login);

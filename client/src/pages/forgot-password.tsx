import { Box, Button } from '@chakra-ui/react';
import { Formik, Form } from 'formik';
import React, { useState } from 'react';
import { InputField } from '../components/InputField';
import { Layout } from '../components/Layout';
import { PrimaryBtn } from '../components/styled/PrimaryBtn';
import { Wrapper } from '../components/Wrapper';
import { useChangePasswordMutation } from '../generated/graphql';
import { withApollo } from '../utils/apollo/withApollo';

const ForgotPassword: React.FC<{}> = ({}) => {
        const [complete, setComplete] = useState(false);
        const[forgotPassword] = useChangePasswordMutation();
    return (    
        <Layout variant="small">   
    <Wrapper variant="small">
        <Formik
            initialValues={{ email: "" }}
            onSubmit={async (values) => {
                await forgotPassword({variables: values as any});
                setComplete(true);
            }}
        >
            {({isSubmitting}) => complete ? (
                <Box>
                    if an account with that email exists, we sent you an email
                </Box>):(
                <Form>
                    <InputField
                      textarea={false}
                      name="email"
                      placeholder="email"
                      label="Email"
                      type="email"
                    />
                    <Button 
                      my={4} 
                      type='submit' 
                      isLoading={isSubmitting} 
                      variant="unstyled"
                      w="100%"
                    >
                        <PrimaryBtn text={"olvide mi contraseña"}/>
                    </Button>
                </Form>
            )}
        </Formik>
    </Wrapper></Layout> 
    );
};

export default  withApollo({ssr: false})(ForgotPassword);
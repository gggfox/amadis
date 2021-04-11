import { Box, Button } from '@chakra-ui/react';
import { Formik, Form } from 'formik';
import React from 'react'
import { InputField } from '../components/InputField';
import { useCreatePostMutation } from '../generated/graphql';
import { useRouter } from "next/router";
import { Layout } from '../components/Layout';
import { useIsAuth } from '../utils/useIsAuth';
import { withApollo } from '../utils/withApollo';

const CreatePost: React.FC<{}> = ({}) => {
    const router = useRouter();
    useIsAuth();
    const [createPost] = useCreatePostMutation();
        return (
            <Layout variant="small">
     
                <Formik
                  initialValues={{ title: "", text: "" }}
                  onSubmit={async (values) => {
                      console.log(values);
                      const {errors} = await createPost({variables: {input: values},
                      update: (cache) => {
                        cache.evict({fieldName: "posts:{}"});
                      }
                    });
                      if(!errors){
                        router.push("/");
                      }
                  }}
                 >
                    {({isSubmitting}) => (
                        <Form>
                            <InputField
                              textarea={false}
                              name="title"
                              placeholder="titulo"
                              label="Titulo"
                            />
                            <Box mt={4}>
                            <InputField
                              textarea
                              name="text"
                              placeholder="texto..."
                              label="Descripcion"
                              type="textarea"
                            /></Box>
                            <Button 
                              mt={4} 
                              type='submit' 
                              isLoading={isSubmitting} 
                              bg="frost.1"
                              w="100%"
                              borderRadius={25}
                            >
                                crear producto
                            </Button>

                        </Form>
                    )}
                </Formik>
            </Layout>
        );
};

export default  withApollo({ssr: false})(CreatePost);
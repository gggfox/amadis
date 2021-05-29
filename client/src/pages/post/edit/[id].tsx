import { Box, Button } from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import { useRouter } from 'next/router';
import React from 'react'
import { InputField } from '../../../components/InputField';
import { Layout } from '../../../components/Layout';
import { Wrapper } from '../../../components/Wrapper';
import { usePostQuery, useUpdatePostMutation } from '../../../generated/graphql';
import { useGetIntId } from '../../../utils/useGetIntId';
import { withApollo } from '../../../utils/withApollo';

const EditPost = ({}) => {
    const router = useRouter();
    const intId = useGetIntId();
    const {data, loading} = usePostQuery({
        skip: intId === -1,
        variables: {
            id: intId,
        },
    });
    // const {data:data2, loading:loading2} = useCategoryQuery();

    const [updatePost] = useUpdatePostMutation();
    if (loading) {
      return (
        <Layout>
            <div>loading...</div>
        </Layout>
      );
    }
    if(!data?.post){
        return(
            <Layout>
                <Box>could not find post</Box>
            </Layout>
        );
    }
        return (
            <Layout variant="small">
              <Wrapper variant="small">
                <Formik
                  initialValues={{ title: data.post.title, text: data.post.text }}
                  onSubmit={async (values) => {
                    await updatePost({variables: {id: intId, ...values}})
                    router.back();
                  }}
                 >
                    {({isSubmitting}) => (
                        <Form>
                            <InputField
                              name="title"
                              placeholder="titulo"
                              label="Titulo"
                            />
                            <Box mt={4}>
                            <InputField
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
                                update post
                            </Button>
       
                             
                        </Form>
                    )}
                </Formik>
                </Wrapper>
            </Layout>
        );
}

export default  withApollo({ssr: false})(EditPost);
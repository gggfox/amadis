import { Box, Button, Flex, Text } from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import { useRouter } from 'next/router';
import React, { useState } from 'react'
import { InputField } from '../../../components/InputField';
import { Layout } from '../../../components/Layout';
import { Wrapper } from '../../../components/Wrapper';
import { useAddPictureMutation, usePostQuery, useUpdatePostMutation } from '../../../generated/graphql';
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

  const [updatePost] = useUpdatePostMutation();
  const [addImage] = useAddPictureMutation();
  const [file, changeFile] = useState("");

  const handleFileChange = async (e:any) => {
    if(!e.target.files[0]) return;
    changeFile(e.target.files[0]);
  } 

  const uploadFile = async(postId:number) => {
    if(file === ""){
      return;
    } 
    await addImage({ 
      variables: { 
        picture: file,
        postId: postId 
      }
    });
  }

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
            const response = await updatePost({variables: {id: intId, ...values}})
            uploadFile(response.data?.updatePost?.id as number)
            router.back();
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
              <Box mt={4}/>
              <InputField
                textarea={true}
                name="text"
                placeholder="texto..."
                label="Descripcion"
              />
              <Box mt={4}/>
              <Flex alignItems="center" flexWrap="wrap" mb={5}>
                  <Box 
                    className="upload-file-btn"
                    bg={file==""? "aurora.purple":"aurora.orange"}
                    mr={3}
                    color="polarNight.0"
                  >
                    Subir Foto
                    <input 
                      type="file" 
                      id="photo" 
                      name="photo" 
                      onChange={handleFileChange}
                      className="hide-real-file-btn"
                      accept="image/png, image/jpeg"
                      multiple={false}
                    />
                  </Box>
                  <Text color="snowStorm.2">
                    {file["name" as any]}
                  </Text>
                </Flex>


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
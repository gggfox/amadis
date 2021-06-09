import { Box, Button, Flex, Text} from '@chakra-ui/react';
import { Formik, Form, Field } from 'formik';
import React, { useState } from 'react'
import { InputField } from '../components/InputField';
import { Category, useAddPictureMutation, useCategoryQuery, useCreatePostMutation } from '../generated/graphql';
import { useRouter } from "next/router";
import { Layout } from '../components/Layout';
import { useIsAuth } from '../utils/useIsAuth';
import { withApollo } from '../utils/withApollo';
import { Wrapper } from '../components/Wrapper';
import { toErrorMap } from '../utils/toErrorMap';
import { FieldError } from "../generated/graphql";
import { CategoryCheckBox } from '../components/CategoryCheckBox';
import swal from 'sweetalert';

const CreatePost: React.FC<{}> = ({}) => {
  useIsAuth();
  const router = useRouter();
    
  const {data, error, loading} = useCategoryQuery();
  const [createPost] = useCreatePostMutation();
  const [addImage] = useAddPictureMutation();
  const [file, changeFile] = useState("");

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

  const handleFileChange = async (e:any) => {
    if(!e.target.files[0]) return;
    const size = e.target.files[0].size;
    //swal(size + "")
    if(size > 1000000){
      swal(`Tu archivo tiene ${size} bytes que sobre pasa el limite de 1,000,000`);
    }else{
      changeFile(e.target.files[0]);
    }
  } 

  return (
      <Layout variant="small">
        <Wrapper variant="small">
          <Formik
            initialValues={{ title: "", text: "", categoryNames:[] }}
            
            onSubmit={async (values, {setErrors}) => {
              const response = await createPost(
                {variables: 
                  {input: values},
                  update: (cache) => {
                    cache.evict({fieldName: "posts:{}"});
                  }
                }
              );

              if(response.data?.createPost.errors) { 
                setErrors(toErrorMap(response.data.createPost.errors as FieldError[]));
              }else if (response.data?.createPost.post){
                if(typeof router.query.next === "string") {
                    router.push(router.query.next);
                }else{
                    uploadFile(response.data?.createPost.post.id as number)
                    router.push("/");
                }
              }
            }}
          >
            {({isSubmitting}) => (
              <Form>
                  <InputField
                    textarea={false}
                    name="title"
                    placeholder="titulo"
                    label="Título"
                  />
                  <Box mb={5}/>
                  <InputField
                    textarea={true}
                    name="text"
                    label="Descripción"
                  />
                  <Box mb={5}/>
                  <Flex alignItems="center" flexWrap="wrap" mb={5}>
                  <Box 
                    className="upload-file-btn"
                    bg={file==""? "aurora.yellow":"aurora.orange"}
                    mr={3}
                  >
                    Subir Foto
                    <input 
                      type="file" 
                      id="photo" 
                      name="photo" 
                      required 
                      onChange={handleFileChange}
                      className="hide-real-file-btn"
                      accept="image/png, image/jpeg"
                      multiple={false}
                    />
                  </Box>
                  <Text color="snowStorm.2">{file["name" as any]}</Text>
                  </Flex>

              
                  {!loading && !data ?//done loading and no data
                    (<div>
                      <div>you got no categories for some reason</div>
                      <div>{error?.message}</div>
                      </div>)
                    : (!data?.allCategories && loading 
                      ? (<div>loading...</div>) 
                      : (
                        <Box> 
                          <Box id="checkbox-group" color="white" fontWeight="bold">Categorías </Box>
                          <Flex role="group" aria-labelledby="checkbox-group" flexWrap="wrap" flexDirection="row">
                              {data!.allCategories.map((c) => (!c
                                ? null 
                                : (<CategoryCheckBox c={c as Category} filedName={"categoryNames"}/>)))
                              }
                          </Flex>
                        </Box>
                      )
                    )
                  }
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
          </Wrapper>
          <Box mb={100}></Box>
      </Layout>
  );
};

export default  withApollo({ssr: false})(CreatePost);
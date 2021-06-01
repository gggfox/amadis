
import { Box, Button, Flex} from '@chakra-ui/react';
import { Formik, Form, Field } from 'formik';
import React, { useState } from 'react'
import { InputField } from '../components/InputField';
import { useAddPictureMutation, useCategoryQuery, useCreatePostMutation } from '../generated/graphql';
import { useRouter } from "next/router";
import { Layout } from '../components/Layout';
import { useIsAuth } from '../utils/useIsAuth';
import { withApollo } from '../utils/withApollo';
import { Wrapper } from '../components/Wrapper';
import { toErrorMap } from '../utils/toErrorMap';
import { FieldError } from "../generated/graphql";

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
    changeFile(e.target.files[0]);
  } 



  const changeColor = (id:string) => {
    let cbox = document.getElementById("checkbox-group");
    let category = document.getElementById(id);

    if(cbox && category){
      cbox.style.color = "#ffffff"
      if(category.style.color == cbox.style.color){
        category.style.color = "#b48ead"
      }else{
        category.style.color = "#ffffff"
      }
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
                    name="title"
                    placeholder="titulo"
                    label="Título"
                  />
                  <Box mt={4} mb={5}>
                    <InputField
                      name="text"
                      placeholder="texto..."
                      label="Descripción"
                      type="textarea"
                      
                    />
                    <Box mb={5}/>
                    <input 
                      type="file" 
                      id="photo" 
                      name="photo" 
                      required 
                      onChange={handleFileChange}
                    />

                  </Box>
                  {!loading && !data ?//done loading and no data
                    (<div>
                      <div>you got no categories for some reason</div>
                      <div>{error?.message}</div>
                      </div>)
                    :(!data?.allCategories && loading 
                      ? (<div>loading...</div>) 
                      : (       <div> 
                      <Box id="checkbox-group" color="white" fontWeight="bold">Categorías</Box>
                      <Box id="cbox" color="white"/>
                      <Flex role="group" aria-labelledby="checkbox-group" flexWrap="wrap">
                          {data!.allCategories.map((p) => 
                            !p 
                            ? null 
                            :(
                              <label key={p.name} >
                                <Field 
                                  type="checkbox" 
                                  name="categoryNames" 
                                  value={p.name} 
                                  onChange={() => changeColor(p.name)}
                                  hidden
                                  />
                                <Box 
                                  id={p.name}
                                  color="#ffffff"
                                  width="fit-content" 
                                  border="2px" 
                                  mr={2}
                                  mt={2} 
                                  p={1} 
                                  borderRadius={15}
                                  
                                  >
                                  {p.name}
                                </Box>
                              </label>
                              
                              ))
                          } 
                      </Flex></div>)
                )}
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
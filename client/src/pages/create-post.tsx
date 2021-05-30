import { Box, Button, Heading} from '@chakra-ui/react';
import { Formik, Form, Field } from 'formik';
import React from 'react'
import { InputField } from '../components/InputField';
import { PostInput, useCategoryQuery, useCreatePostMutation } from '../generated/graphql';
import { useRouter } from "next/router";
import { Layout } from '../components/Layout';
import { useIsAuth } from '../utils/useIsAuth';
import { withApollo } from '../utils/withApollo';
import { Wrapper } from '../components/Wrapper';
import { InputImageField } from '../components/InputImageField';
import { toErrorMap } from '../utils/toErrorMap';
import { FieldError } from "../generated/graphql";

const CreatePost: React.FC<{}> = ({}) => {
    const router = useRouter();
    useIsAuth();
    const {data, error, loading} = useCategoryQuery();
    const [createPost] = useCreatePostMutation();

    return (
        <Layout variant="small">
          <Wrapper variant="small">
            <Formik
              initialValues={{ title: "", text: "", categoryNames:[] }}
              onSubmit={async (values, {setErrors}) => {
               
          
                  const response = await createPost({variables: {input: values},
                  update: (cache) => {
                    cache.evict({fieldName: "posts:{}"});
                  }
                });

                if(response.data?.createPost.errors) {
                  
                  setErrors(toErrorMap(response.data.createPost.errors as FieldError[]));
              }else if (response.data?.createPost.post){
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
                          name="title"
                          placeholder="titulo"
                          label="Título"
                        />
                        <Box mt={4}>
                        <InputField
                          name="text"
                          placeholder="texto..."
                          label="Descripción"
                          type="textarea"
                        />
                        <InputImageField
                          name="photo"
                          label="Foto"
                          type="file"
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
                              <Box id="checkbox-group" color="snowStorm.0" fontWeight="bold">Categorías</Box>
                            <div role="group" aria-labelledby="checkbox-group">
                                {data!.allCategories.map((p) => 
                                  !p 
                                  ? null 
                                  :(<Box color="white">
                                    <label key={p.name}>
                                      <Field type="checkbox" name="categoryNames" value={p.name}/>
                                      {p.name}
                                    </label>
                                    </Box>
                                    ))
                                } 
                            </div></div>)
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
import { Box, Button} from '@chakra-ui/react';
import { Formik, Form, Field } from 'formik';
import React from 'react'
import { InputField } from '../components/InputField';
import { useCategoryQuery, useCreatePostMutation } from '../generated/graphql';
import { useRouter } from "next/router";
import { Layout } from '../components/Layout';
import { useIsAuth } from '../utils/useIsAuth';
import { withApollo } from '../utils/withApollo';
import { Wrapper } from '../components/Wrapper';

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
              onSubmit={async (values) => {
                  console.log("values:"+values.categoryNames);
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
                              <div id="checkbox-group">Checked</div>
                            <div role="group" aria-labelledby="checkbox-group">
                                {data!.allCategories.map((p) => 
                                  !p 
                                  ? null 
                                  :(<label key={p.name}>
                                      <Field type="checkbox" name="categoryNames" value={p.name}/>
                                      {p.name}
                                    </label>
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
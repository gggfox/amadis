import { Button } from '@chakra-ui/react';
import { Formik, Form } from 'formik';
import React from 'react'
import { InputField } from '../components/InputField';
import { useCreateCategoryMutation } from '../generated/graphql';
import { useRouter } from "next/router";
import { Layout } from '../components/Layout';
import { useIsAdmin } from '../utils/useIsAdmin';
import { withApollo } from '../utils/withApollo';
import { Wrapper } from '../components/Wrapper';

const CreateCategory: React.FC<{}> = ({}) => {
    const router = useRouter();
    useIsAdmin();
    const [createCategory] = useCreateCategoryMutation();
        return (
            <Layout variant="small">
              <Wrapper variant="small">
                <Formik
                  initialValues={{ name: "" }}
                  onSubmit={async (values) => {
                      console.log(values)
                      const {errors} = await createCategory({variables: {name: values.name},
                      update: (cache) => {
                        cache.evict({fieldName: "posts:{}"});
                      }
                    });
                      if(!errors){
                        router.push("/categories");
                      }else{
                        router.push("/");
                      }
                  }}
                 >
                    {({isSubmitting}) => (
                        <Form>
                            <InputField
                              name="name"
                              placeholder="nombre de la categoria"
                              label="Nombre de la categoria"
                            />
                            <Button 
                              mt={4} 
                              type='submit' 
                              isLoading={isSubmitting} 
                              bg="frost.1"
                              w="100%"
                              borderRadius={25}
                            >
                                crear categoria
                            </Button>

                        </Form>
                    )}
                </Formik>
                </Wrapper>
            </Layout>
        );
};

export default  withApollo({ssr: false})(CreateCategory);
import { Button, Link } from '@chakra-ui/react';
import { Formik, Form } from 'formik';
import React from 'react'
import { InputField } from '../components/InputField';
import { useCreateCategoryMutation } from '../generated/graphql';
import { useRouter } from "next/router";
import { Layout } from '../components/Layout';
import { useIsAdmin } from '../utils/roleAuth/useIsAdmin';
import { withApollo } from '../utils/apollo/withApollo';
import { Wrapper } from '../components/Wrapper';
import { PrimaryBtn } from '../components/styled/PrimaryBtn';
import { toErrorMap } from '../utils/toErrorMap';
import { FieldError } from "../generated/graphql";

const CreateCategory: React.FC<{}> = ({}) => {
    const router = useRouter();
    useIsAdmin();
    const [createCategory] = useCreateCategoryMutation();
        return (
            <Layout variant="small">
              <Wrapper variant="small">
                <Formik
                  initialValues={{ name: "" }}
                  onSubmit={async (values,{setErrors}) => {
                      console.log(values)
                      const response = await createCategory({variables: {name: values.name},
                      update: (cache) => {
                        cache.evict({fieldName: "posts:{}"});
                      }
                    });
                    

                    if(response.data?.createCategory?.errors) { 
                      setErrors(toErrorMap(response.data?.createCategory?.errors as FieldError[]));
                    }else if (response.data?.createCategory?.category?.name) {
                      if(typeof router.query.next === "string") {
                          router.push(router.query.next);
                      }else{
                          router.push("/");
                      }
                    }


                      // if(!errors){
                      //   router.push("/categories");
                      // }else{
                      //   router.push("/");
                      // }
                  }}
                 >
                    {({isSubmitting}) => (
                        <Form>
                            <InputField
                            textarea={false}
                              name="category"
                              placeholder="nombre de la categoria"
                              label="Nombre de la categoria"
                            />
                            
                            <Button 
                              variant="unstyled"
                              type='submit' 
                              isLoading={isSubmitting} 
                              w="100%"
                              mb={4}
                            >
                              <PrimaryBtn text={"crear categoria"}/>  
                            </Button>
                        </Form>
                    )}
                </Formik>
                </Wrapper>
            </Layout>
        );
};

export default  withApollo({ssr: false})(CreateCategory);
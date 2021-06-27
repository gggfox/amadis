import { Box, Button, Flex} from '@chakra-ui/react';
import { Formik, Form, Field } from 'formik';
import React from 'react'
import { useRouter } from "next/router";
import { useCategoryQuery, useChooseCategories4PromotorMutation } from '../../../generated/graphql';
import { useGetIntId } from '../../../utils/urlManipulation/useGetIntId';
import { Layout } from '../../../components/Layout';
import { Wrapper } from '../../../components/Wrapper';
import { useIsAuth } from '../../../utils/roleAuth/useIsAuth';
import { withApollo } from '../../../utils/apollo/withApollo';

const AddCategories2Promotor: React.FC<{}> = ({}) => {
    const router = useRouter();
    useIsAuth();
    const {data, error, loading} = useCategoryQuery();
    const [chooseCategories] = useChooseCategories4PromotorMutation();
    const intId = useGetIntId();

    return (
        <Layout variant="small">
          <Wrapper variant="small">
            <Formik
              initialValues={{id:intId,categories:[] as string | string[]}}
              onSubmit={async (values) => {
                
                  const {errors} = await chooseCategories({variables: {id:intId, categories: values.categories},
                  update: (cache) => {
                    cache.evict({fieldName: "promotors:{}"});
                  }
                });
                  if(!errors){
                    router.push("/user/"+intId);
                  }
              }}
              >
                {({isSubmitting}) => (
                    <Form>
                        <input type="hidden" value={intId} name="id" />
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
                                <Flex flexDirection="column">                               
                                  {data!.allCategories.map((p) => 
                                  !p 
                                  ? null 
                                  :(<label key={p.name}>
                                      <Field type="checkbox" name="categories" value={p.name}/>
                                      {p.name}
                                    </label>
                                    ))
                                } 
                                </Flex> 
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
                            añadir categorias                        
                        </Button>
                    </Form>
                )}
            </Formik>
            </Wrapper>
            <Box mb={100}></Box>
        </Layout>
    );
};


export default  withApollo({ssr: false})(AddCategories2Promotor);
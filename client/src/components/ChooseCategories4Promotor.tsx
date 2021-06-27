import { Box, Button, Flex, Heading, ModalHeader, Text } from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { Category, useCategoryQuery, useChooseCategories4PromotorMutation, usePromotorQuery } from '../generated/graphql';
import { CategoryCheckBox } from './CategoryCheckBox';
import { PrimaryBtn } from './styled/PrimaryBtn';

interface ChooseCategories4PromotorProps {
    promotorId: number,
}

export const ChooseCategories4Promotor:React.FC<ChooseCategories4PromotorProps> = ({promotorId}) => {
    const [chooseCategories] = useChooseCategories4PromotorMutation();
    const {data, error, loading} = useCategoryQuery();
    const router = useRouter();
    const {data:promotor, } = usePromotorQuery({
        skip: promotorId === -1,
        variables: {
            id: promotorId,
        }});

    const current_categories = promotor?.promotor.categories?.map((obj) => (obj.name))
    const [count, setCount] = useState(current_categories?.length)
    return (
        <Box>  
        <Heading color="wl" w="100%" align="center">maximo 5</Heading>                         
        <Formik
            initialValues={{ id: promotorId, categories:current_categories as string[] }}

            onSubmit={async (values) => {
                setCount(values.categories.length)
                const {errors} = await chooseCategories({variables: values,
                update: (cache) => {
                    cache.evict({id: "User:" + promotorId});
                }
                });
                if(errors){
                    router.push("/");
                }
            }}
        >

            {({isSubmitting}) => (
                <Form>
                    <Flex>
                    
                    {!loading && !data 
                    ?(<div>
                            <div>you got no categories for some reason</div>
                            <div>{error?.message}</div>
                    </div>)
                    :(!data?.allCategories && loading 
                        ?(<div>loading...</div>) 
                        :(<div role="group" aria-labelledby="checkbox-group">

                            <Flex flexDirection="row" flexWrap="wrap" justify="center">
                                {data!.allCategories.map((c) => 
                                !c 
                                ? null 
                                :(
                                    <CategoryCheckBox c={c as Category} filedName={"categories"} active={current_categories?.includes(c.name)}/>
                                ))
                                }
                            </Flex>
                        </div>)
                    )
                    }
                    
                    </Flex>
                    <Button 
                    mt={6} 
                    ml="50%"
                    type='submit' 
                    isLoading={isSubmitting} 
                    w="50%"
                    variant="unstyled"
                    >
                        <PrimaryBtn text={`elegir categorias`}/>                           
                    </Button>

                </Form>
            )}
        </Formik>
        </Box>
    );
}
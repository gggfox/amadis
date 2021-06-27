import { Box, Button, Flex, Text} from '@chakra-ui/react';
import { Formik, Form } from 'formik';
import React, { useState } from 'react'
import { InputField } from '../components/InputField';
import { Category, useAddPictureMutation, useCategoryQuery, useCreateProductMutation } from '../generated/graphql';
import { useRouter } from "next/router";
import { Layout } from '../components/Layout';
import { useIsAuth } from '../utils/roleAuth/useIsAuth';
import { withApollo } from '../utils/apollo/withApollo';
import { Wrapper } from '../components/Wrapper';
import { toErrorMap } from '../utils/toErrorMap';
import { FieldError } from "../generated/graphql";
import { CategoryCheckBox } from '../components/CategoryCheckBox';
import swal from 'sweetalert';
import { NumInputField } from '../components/NumberInputField';

const CreatePost: React.FC<{}> = ({}) => {
  useIsAuth();
  const router = useRouter();
    
  const {data, error, loading} = useCategoryQuery();
  const [createProduct] = useCreateProductMutation();
  const [addImage] = useAddPictureMutation();
  const [file, changeFile] = useState("");

  const uploadFile = async(productId:number) => {
    if(file === ""){
      return;
    } 
    await addImage({ 
      variables: { 
        picture: file,
        productId: productId 
      }
    });
  }

  const handleFileChange = async (e:any) => {
    if(!e.target.files[0]) return;
    const size = e.target.files[0].size;
    //swal(size + "")
    
    if(size > 2000000){
      swal(`Tu archivo tiene ${size} bytes que sobre pasa el limite de 2,000,000`);
    }else{
      changeFile(e.target.files[0]);
    }
  } 

  return (
      <Layout variant="small">
        <Wrapper variant="small">
          <Formik
            initialValues={{ title: "", text: "", price:100, quantity: 10, categoryNames:[] }}
            
            onSubmit={async (values, {setErrors}) => {
            
              const response = await createProduct(
                {variables: 
                  {input: values},
                  update: (cache) => {
                    cache.evict({fieldName: "products:{}"});
                  }
                }
              );
  
              if(response.data?.createProduct.errors) { 
                setErrors(toErrorMap(response.data.createProduct.errors as FieldError[]));
              }else if (response.data?.createProduct.product){
                if(typeof router.query.next === "string") {
                    router.push(router.query.next);
                }else{
                    uploadFile(response.data?.createProduct.product.id as number)
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
                    char_limit={100}
                  />
                  <Box mb={5}/>
                  <InputField
                    textarea={true}
                    name="text"
                    label="Descripción"
                    char_limit={500}
                  />
                  <NumInputField
                    name="price"
                    label="Precio"
                  />
                  <NumInputField
                    name="quantity"
                    label="Cantidad"
                  />
                  <Box mb={5}/>
                  <Flex alignItems="center" flexWrap="wrap" mb={5}>
                  <Box 
                    className="upload-file-btn"
                    bg="bl"
                    borderWidth={2}
                    color="pd"
                    mr={3}
                    fontWeight="bold"
                    _hover={{color:"wl"}}
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
                  <Text color="wl">{file["name" as any]}</Text>
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
                    bg="pd"
                    w="100%"
                    borderRadius={10}
                    color="wl"
                    _hover={{borderWidth:"2px"}}
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
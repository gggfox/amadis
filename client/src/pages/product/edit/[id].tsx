import { Box, Button, Flex, Text } from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import { useRouter } from 'next/router';
import React, { useState } from 'react'
import { InputField } from '../../../components/InputField';
import { Layout } from '../../../components/Layout';
import { PrimaryBtn } from '../../../components/styled/PrimaryBtn';
import { Wrapper } from '../../../components/Wrapper';
import { FieldError, useAddPictureMutation, useProductQuery, useUpdateProductMutation } from '../../../generated/graphql';
import { useGetIntId } from '../../../utils/urlManipulation/useGetIntId';
import { withApollo } from '../../../utils/apollo/withApollo';
import { NumInputField } from '../../../components/NumberInputField';
import { toErrorMap } from '../../../utils/toErrorMap';

const EditPost = ({}) => {
  const router = useRouter();
  const intId = useGetIntId();
  const {data, loading} = useProductQuery({
      skip: intId === -1,
      variables: {
          id: intId,
      },
  });

  const [updateProduct] = useUpdateProductMutation();
  const [addImage] = useAddPictureMutation();
  const [file, changeFile] = useState("");

  const handleFileChange = async (e:any) => {
    if(!e.target.files[0]) return;
    changeFile(e.target.files[0]);
  } 

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

  if (loading) {
    return (
      <Layout>
          <div>loading...</div>
      </Layout>
    );
  }
  if(!data?.product){
      return(
          <Layout>
              <Box>no se encontro el producto</Box>
          </Layout>
      );
  }
  return (
    <Layout variant="small">
      <Wrapper variant="small">
        <Formik
          initialValues={{ title: data.product.title, text: data.product.text, price: data.product.price, quantity: data.product.quantity }}
          onSubmit={async (values, {setErrors}) => {
            
            const response = await updateProduct({variables: {productId: intId, input: values}})

            if(response.data?.updateProduct?.errors) { 
              setErrors(toErrorMap(response.data.updateProduct?.errors as FieldError[]));
            }else{
              uploadFile(response.data?.updateProduct?.product?.id as number)
              if(typeof router.query.next === "string") {
                  router.push(router.query.next);
              }else{
                router.back();
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
                label="Titulo"
                char_limit={100}
              />
              <Box mt={4}/>
              <InputField
                textarea={true}
                name="text"
                placeholder="texto..."
                label="Descripcion"
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
              <Box mt={4}/>
              <Flex alignItems="center" flexWrap="wrap" mb={5}>
                  <Box 
                    className="upload-file-btn"
                    bg={file === "" ? "bl":"pd"}
                    borderRadius={10}
                    borderWidth={file === "" ? 1 : 0}
                    mr={3}
                    color="wl"
                    fontWeight="bold"
                    _hover={{bg:"wl"}}
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
                  <Text color="wl">
                    {file["name" as any]}
                  </Text>
                </Flex>


              <Button
                my={4} 
                type='submit' 
                isLoading={isSubmitting} 
                w="100%"
                variant="unstyled"
              >
                <PrimaryBtn text={"actualizar producto"}/>
              </Button>
            </Form>
          )}
        </Formik>
      </Wrapper>
      <Box mb={20}></Box>
    </Layout>
  );
}

export default  withApollo({ssr: false})(EditPost);
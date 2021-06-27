import { Heading } from '@chakra-ui/layout';
import { Box, Flex, Image, Link, Text } from '@chakra-ui/react';
import React from 'react';
import { Layout } from '../../components/Layout';
import { PromoteProductBtn } from '../../components/PromoteProductBtn';
import { Wrapper } from '../../components/Wrapper';
import { useMeQuery } from '../../generated/graphql';
import { useGetProductFromUrl } from '../../utils/urlManipulation/useGetProductFromUrl';
import { withApollo } from '../../utils/apollo/withApollo';
import NextLink from "next/link";
import { SaveProductBtn } from '../../components/SaveProductBtn';
import { Category } from '../../components/styled/Category';

const Post = ({}): JSX.Element => {
    const {data, error, loading} = useGetProductFromUrl(); 
    const {data: meData} = useMeQuery();

    if(loading){
        return(
            <Layout>
                <div>loading...</div>
            </Layout>
        );
    }

    if(error) {
        return <div>{error.message}</div>
    }

    if(!data?.product){
        return (
            <Layout>
                <Box>no se encontro ningun producto</Box>
            </Layout>
        );
    }

    let isPromotor = false;
    if(data.product.promotors){
        data.product.promotors.map((u) => {
            if(u.id === meData?.me?.id){
                isPromotor = true;
            }
        });
    }

    const isLiked = (productId:number) => {
        const products = meData?.me?.savedProducts?.map((p:any) => {
            return p.id ? p.id : null;
        });
        return products?.includes(productId);
     }

        return (
            <Layout>
                <Wrapper variant="regular">
                    <Flex flexDirection="column" alignItems="center">
                    <Heading  color="wl" fontSize={60}>
                        {data.product.title}
                    </Heading>
                    <NextLink href="/user/[id]" as={`/user/${data.product.creator.id}`}>
                     <Link color="pd" fontSize={20} fontWeight="bold">
                        vendedor:{" " + data.product.creator.username}
                     </Link>
                  </NextLink>
                <Box>
                    <Image
                        my={4}
                        boxSize="300px"
                        src={`https://amadisimages.blob.core.windows.net/imagenes/Product:${data.product.id}`}
                        alt="product image"
                        fallbackSrc='https://amadisimages.blob.core.windows.net/imagenes/post:247'
                        border="2px"
                        borderColor="bd"
                        borderRadius={20}
                    />
                    <Flex justifyContent="space-between" alignItems="center">
                        <Text color="wl" fontWeight="bold" fontSize={25}>{"$"+data.product.price+" mxn"}</Text>
                        <SaveProductBtn meId={meData?.me?.id as number} like={isLiked(data.product.id) as boolean} productId={data.product.id}/>
                    </Flex>
                    <Flex flexDirection="column" w="100%" my={5}>
                        <Heading size="md" color="wl">Descripcion:</Heading> 
                        <Box mb={4} color="wl">{data.product.text}</Box>
                        {isPromotor
                            ? (null)
                            : (<PromoteProductBtn productId={data.product.id} />)
                        }
                    </Flex>
                </Box>





                {(data?.product?.categories?.length === 0)  ? null : 
               (<Flex flexDirection="row" flexWrap="wrap">
                  <Heading size="md" color="wl" w="100%">Categorias:</Heading> 
                   {data.product.categories?.map((c:any)=>(
                       
                    <NextLink href="/product/category/[categoryName]" as={`/product/category/${c.categoryName}`}>
                        <Link _hover={{}}>
                            <Category name={c.categoryName}/>
                        </Link>
                    </NextLink>
                   ))}
               </Flex>
               )}
                </Flex>
                

               {/* <Flex mt={4}>
                    <EditDeletePostButtons id={data.post.id} creatorId={data.post.creator.id} />
               </Flex> */}

               </Wrapper>
               <Box m={100}></Box>
            </Layout>
        );
}

export default  withApollo({ssr: true})(Post);
import React from "react"
import { Layout } from "../components/Layout"
import { Product, useMeQuery, useProductsQuery } from "../generated/graphql"
import NextLink from "next/link";
import { Box, Button, Flex, Heading, Link, Stack, Text} from "@chakra-ui/react"
import { withApollo } from "../utils/apollo/withApollo";
import { Wrapper } from "../components/Wrapper";
import { ProductPreview } from "../components/ProductPreview";

const Index = () => {
   
   const { data: meData} = useMeQuery();
   const {data, error, loading, fetchMore, variables} = useProductsQuery({
      variables:{
         limit: 10, 
         cursor: null,
      },
      notifyOnNetworkStatusChange: true,
   });

 if(!loading && !data){//done loading and no data
    return (
      <div>
         <div>No tienes productos por alguna razon</div>
         <div>{error?.message}</div>
      </div>);
 }
    return(
 <Layout>
   
   <Wrapper variant="regular">
      
    <Flex align="center">
    
      <Heading color="wl" fontFamily="unna" fontSize={40}>
         Productos
      </Heading>

      {(meData?.me?.userType != "admin" && meData?.me?.userType != "business") ? null : (
         <NextLink href="/create-product">
            <Link ml="auto" color="pd">
               <Text as="ins">
                  <b>crear producto</b>
               </Text>
            </Link>
         </NextLink>
      )}
    </Flex>
    </Wrapper>

    {!data && loading 
      ? (<div>loading...</div>) 
      : (<Stack spacing={6} w="100%" alignItems="center">
            {data!.products.products.map((p) => 
            !p ? null : (
               <ProductPreview p={p as Product} meData={meData ? meData : null}/>
            ))}
         </Stack>)
    }
   
    {!(data?.products.hasMore) ? (null) : (
    <Flex>
      <Button 
      bg="pd"
      color="wl"
      shadow="xl"
        onClick={() => {
         fetchMore({
            variables: {
               limit: variables?.limit,
               cursor: data.products.products[data.products.products.length - 1].createdAt,
            },
         });
      }} m="auto" my={4}>
         Mostrar mas
      
      </Button>
    </Flex> 
    )}
<Box mb={20}></Box>
 </Layout>
)}

export default withApollo({ssr: true})(Index)//has ssr

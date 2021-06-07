import React from "react"
import { Layout } from "../components/Layout"
import { Post, useSavedProductsQuery } from "../generated/graphql"
import { Box, Flex, Heading, Link, Stack, Text, Image } from "@chakra-ui/react"
import { withApollo } from "../utils/withApollo";
import { Wrapper } from "../components/Wrapper";
import { useIsAuth } from "../utils/useIsAuth";
import { PostPreview } from "../components/PostPreview";

const SavedProducts = () => {
   const meData = useIsAuth();
   const {data, error, loading} = useSavedProductsQuery();
   if(!loading && !data){//done loading and no data
      return (
         <div>
            <div>you got no posts for some reason</div>
            <div>{error?.message}</div>
         </div>
      );
 }
 console.log(data?.savedProducts?.savedProducts)
    return(
 <Layout>
    <Wrapper variant="regular">
    <Flex align="center">
      <Heading color="snowStorm.0">Productos Guardados</Heading>
    </Flex>

    {!data && loading 
      ? (<div>loading...</div>) 
      : (<Stack spacing={8}>
            {data!.savedProducts?.savedProducts!.map((p): any => 
            !p ? null : (
               <PostPreview p={p as Post} meData={meData}/>
            ))}
         </Stack>)
    }

    </Wrapper>
    <Box mb={100}></Box>
 </Layout>
)}

export default withApollo({ssr: true})(SavedProducts)//has ssr

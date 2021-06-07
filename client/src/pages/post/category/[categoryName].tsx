import React from "react"
import NextLink from "next/link";
import { Box, Flex, Heading, Link, Stack, Text, Image } from "@chakra-ui/react"
import { useGetPostsFromUrlByCategory } from "../../../utils/useGetPostsFromUrlByCategory";
import { EditDeletePostButtons } from "../../../components/EditDeletePostButtons";
import { Layout } from "../../../components/Layout";
import { UpdootSection } from "../../../components/UpdootSection";
import { Wrapper } from "../../../components/Wrapper";
import { withApollo } from "../../../utils/withApollo";
import { useGetStringCategory } from "../../../utils/useGetStringCategory";
import { Post, useMeQuery } from "../../../generated/graphql";
import { PostPreview } from "../../../components/PostPreview";

const SearchPostsByCategory = () => {
   const { data: meData} = useMeQuery();
   const {data, error, loading} = useGetPostsFromUrlByCategory();
   console.log("data: "+data?.postsByCategory);
 if(!loading && !data){//done loading and no data
    return (
      <div>
         <div>you got no posts for some reason</div>
         <div>{error?.message}</div>
      </div>);
 }
 const category = useGetStringCategory(); 
    return(
 <Layout>
    <Wrapper variant="regular">
    <Heading color="snowStorm.0">Productos: {category}</Heading>
    {!data && loading 
      ? (<div>loading...</div>) 
      : (<Stack spacing={8}>
            {data!.postsByCategory?.map((p) => 
            !p ? null : (
               <PostPreview p={p as Post} meData={meData}/>
            ))}
         </Stack>)
    }
    </Wrapper>
    <Box mb={100}></Box>
 </Layout>
)}

export default withApollo({ssr: true})(SearchPostsByCategory)//has ssr


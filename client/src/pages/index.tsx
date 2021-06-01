import React from "react"
import { Layout } from "../components/Layout"
import { Post, useMeQuery, usePostsQuery } from "../generated/graphql"
import NextLink from "next/link";
import { Box, Button, Flex, Heading, Link, Stack} from "@chakra-ui/react"
import { withApollo } from "../utils/withApollo";
import { Wrapper } from "../components/Wrapper";
import { PostPreview } from "../components/PostPreview";

const Index = () => {
   const { data: meData} = useMeQuery();
   const {data, error, loading, fetchMore, variables} = usePostsQuery({
      variables:{
         limit: 10, 
         cursor: null,
      },
      notifyOnNetworkStatusChange: true,
   });

 if(!loading && !data){//done loading and no data
    return (
      <div>
         <div>you got no posts for some reason</div>
         <div>{error?.message}</div>
      </div>);
 }
 const meType = meData?.me?.userType;
    return(
 <Layout>
    <Wrapper variant="regular">
    <Flex align="center">
      <Heading color="snowStorm.0">Productos</Heading>

      {(meType != "admin" && meType != "business") ? null : (
         <NextLink href="/create-post">
            <Link ml="auto" color="snowStorm.0">
               crear producto
            </Link>
         </NextLink>
      )}
    </Flex>
    {!data && loading 
      ? (<div>loading...</div>) 
      : (<Stack spacing={8}>
            {data!.posts.posts.map((p) => 
            !p ? null : (
               <PostPreview p={p as Post} meData={meData}/>
            ))}
         </Stack>)
    }

    {data ? (
    <Flex>
      <Button 
        onClick={() => {
         fetchMore({
            variables: {
               limit: variables?.limit,
               cursor: data.posts.posts[data.posts.posts.length - 1].createdAt,
            },
         });
      }} m="auto" my={4}>Load more</Button>
    </Flex> 
    ): null}

    </Wrapper>
    <Box mb={100}></Box>
 </Layout>
)}

export default withApollo({ssr: true})(Index)//has ssr

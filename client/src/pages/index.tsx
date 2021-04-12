import React from "react"
import { Layout } from "../components/Layout"
import { usePostsQuery } from "../generated/graphql"
import NextLink from "next/link";
import { Box, Button, Flex, Heading, Link, Stack, Text } from "@chakra-ui/react"
import { UpdootSection } from "../components/UpdootSection"
import { EditDeletePostButtons } from "../components/EditDeletePostButtons"
import { withApollo } from "../utils/withApollo";
import { Wrapper } from "../components/Wrapper";

const Index = () => {
   //const [{ data: meData}] = useMeQuery();
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
    return(
 <Layout>
    <Wrapper variant="regular">
    <Flex align="center">
      <Heading color="snowStorm.0">Productos</Heading>
      <NextLink href="/create-post">
         <Link ml="auto" color="snowStorm.0">
            crear producto
         </Link>
      </NextLink>
    </Flex>
    {!data && loading 
      ? (<div>loading...</div>) 
      : (<Stack spacing={8}>
            {data!.posts.posts.map((p) => 
            !p ? null : (
               <Flex key={p.id} p={5} shadow="md" borderWidth="1px">
                  <UpdootSection post={p}/>
                  <Box flex={1}>
                  <NextLink href="/post/[id]" as={`/post/${p.id}`}>
                  <Link>
                     <Heading fontSize="xl" color="snowStorm.1">
                        {p.title}
                     </Heading>
                  </Link>
                  </NextLink>
                  
                     <Text >
                        vendedor: {p.creator.username}
                     </Text>
                     <Flex flexDirection="row">
                     <Text lex={1} mt={2} color="snowStorm.1">{p.textSnippet}...</Text>
                     <Box ml="auto">
                        <EditDeletePostButtons id={p.id} creatorId={p.creator.id}/>
                     </Box>
                  </Flex>
                </Box>
               </Flex>
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
            // updateQuery: (previousValue, {fetchMoreResult}): PostsQuery => {
            //    if(!fetchMoreResult) {
            //       return previousValue as PostsQuery;
            //    }

            //    return {
            //       __typename: 'Query',
            //       posts: {
            //          __typename: 'PaginatedPosts',
            //          hasMore: (fetchMoreResult as PostsQuery).posts.hasMore,
            //          posts: [
            //             ...(previousValue as PostsQuery).posts.posts,
            //             ...(fetchMoreResult as PostsQuery).posts.posts,
            //          ]
            //       }
            //    }
            // }
         });
      }} m="auto" my={4}>Load more</Button>
    </Flex> 
    ): null}
    </Wrapper>
    <Box mb={100}></Box>
 </Layout>
)}

export default withApollo({ssr: true})(Index)//has ssr

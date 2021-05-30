import React from "react"

import NextLink from "next/link";
import { Box, Flex, Heading, Link, Stack, Text } from "@chakra-ui/react"
import { useGetPostsFromUrlByCategory } from "../../../utils/useGetPostsFromUrlByCategory";
import { EditDeletePostButtons } from "../../../components/EditDeletePostButtons";
import { Layout } from "../../../components/Layout";
import { UpdootSection } from "../../../components/UpdootSection";
import { Wrapper } from "../../../components/Wrapper";
import { withApollo } from "../../../utils/withApollo";
import { useGetStringCategory } from "../../../utils/useGetStringCategory";
import { useMeQuery } from "../../../generated/graphql";

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
               <Flex key={p.id} p={5} shadow="md" borderWidth="1px">
                  {!meData?.me? (null):(
                     <UpdootSection post={p}/>
                  )}
                  <Box flex={1}>
                  <NextLink href="/post/[id]" as={`/post/${p.id}`}>
                  <Link>
                     <Heading fontSize="xl" color="snowStorm.1">
                        {p.title}
                     </Heading>
                  </Link>
                  </NextLink>
                  <NextLink href="/user/[id]" as={`/user/${p.creator.id}`}>
                     <Link>
                        <Text>
                           vendedor: {p.creator.username}
                        </Text>
                     </Link>
                  </NextLink>

                     <Flex flexDirection="row">
                     <Text lex={1} mt={2} color="snowStorm.1">{p.textSnippet}...</Text>
                     <Box ml="auto">
                        <EditDeletePostButtons me={meData?.me} id={p.id} creatorId={p.creator.id}/>
                     </Box>
                  </Flex>
                </Box>
               </Flex>
            ))}
         </Stack>)
    }
    </Wrapper>
    <Box mb={100}></Box>
 </Layout>
)}

export default withApollo({ssr: true})(SearchPostsByCategory)//has ssr


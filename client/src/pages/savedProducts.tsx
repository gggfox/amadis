import React from "react"
import { Layout } from "../components/Layout"
import { useSavedProductsQuery } from "../generated/graphql"
import NextLink from "next/link";
import { Box, Flex, Heading, Link, Stack, Text } from "@chakra-ui/react"
import { UpdootSection } from "../components/UpdootSection"
import { withApollo } from "../utils/withApollo";
import { Wrapper } from "../components/Wrapper";
import { useIsAuth } from "../utils/useIsAuth";
import { SavePostBtn } from "../components/SavePostBtn";

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
               <Flex key={p.id} p={5} shadow="md" borderWidth="1px">
                   
                  <UpdootSection post={p as any}/>
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
                     <Text lex={1} mt={2} color="snowStorm.1">{p.text}...</Text>
                     <Box ml="auto">
                        <SavePostBtn meId={meData?.me?.id as number} like={true} postId={p.id} origin={'Post'}/>
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

export default withApollo({ssr: true})(SavedProducts)//has ssr

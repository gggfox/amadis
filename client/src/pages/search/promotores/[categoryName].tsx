import React from "react"
import NextLink from "next/link";
import { Layout } from "../../../components/Layout";
import { Wrapper } from "../../../components/Wrapper";
import { withApollo } from "../../../utils/withApollo";
import { useGetPromotoresFromUrlByCategory } from "../../../utils/useGetPromotoresFromUrlByCategory";
import { Heading, Stack, Flex, Box, Link } from "@chakra-ui/react";
import { PromotorUpdootSection } from "../../../components/PromotorUpdootSection";
import { useGetStringCategory } from "../../../utils/useGetStringCategory";

const SearchPromotoresByCategory = () => {
const {data, error, loading} = useGetPromotoresFromUrlByCategory();
const category = useGetStringCategory();
 console.log("data: "+data?.promotoresByCategory)
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
    <Heading color="snowStorm.0">Promotores: {category}</Heading>
    <Stack spacing={8}>
          {data?.promotoresByCategory?.map((p) => 
          !p ? null : (
              <Flex key={p.id} p={5} shadow="md" borderWidth="1px">
                <PromotorUpdootSection promotor={p}/>
                <Box flex={1}>
                <NextLink href="/user/[id]" as={`/user/${p.id}`}>
                <Link>
                   <Heading fontSize="xl" color="snowStorm.1">
                      {p.username}
                   </Heading>
                </Link>
                </NextLink>
               </Box>
             </Flex>
          ))}
    </Stack>
    </Wrapper>
    </Layout>)}

export default withApollo({ssr: true})(SearchPromotoresByCategory)//has ssr
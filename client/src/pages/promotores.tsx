import { Box, Flex, Heading, Link, Stack } from "@chakra-ui/react";
import React from "react"
import { Layout } from "../components/Layout";
import { usePromotoresQuery } from "../generated/graphql";
import { withApollo } from "../utils/apollo/withApollo";
import NextLink from "next/link";
import { Wrapper } from "../components/Wrapper";
import { PromotorUpdootSection } from "../components/PromotorUpdootSection";

const Promotores = () => {
    const {data, error, loading} = usePromotoresQuery();
    if(!loading && !data){//done loading and no data
        return (
        <div>
            <div>No te llego ningun promotor</div>
            <div>{error?.message}</div>
        </div>);
    }
    return(
      <Layout>

        <Wrapper variant="regular">
      <Heading color="snowStorm.0">Promotores</Heading>
      <Stack spacing={8}>
            {data?.promotores.map((p) => 
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

            
                    {p.categories?.map((c) => (
                      <Box>{c.name}</Box>
                    ))}
                 </Box>
               </Flex>
            ))}
      </Stack>
      </Wrapper>
      </Layout>)
}

export default withApollo({ssr: true})(Promotores)
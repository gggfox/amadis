import React from "react"
import { Layout } from "../components/Layout"
import { useCategoryQuery, useMeQuery } from "../generated/graphql"
import { Box, Flex, Heading, Link, Stack, Text } from "@chakra-ui/react"
import { withApollo } from "../utils/withApollo";
import { Wrapper } from "../components/Wrapper";
import NextLink from "next/link";

const AllCategories = () => {
   const { data: meData} = useMeQuery();
   const {data, error, loading} = useCategoryQuery();
   if(!loading && !data){//done loading and no data
      return (
         <div>
            <div>you got no categories for some reason</div>
            <div>{error?.message}</div>
         </div>);
   }

   const meType = meData?.me?.userType;
   return(
      <Layout>
         <Wrapper variant="regular">
            
            <Flex align="center">
               <Heading color="snowStorm.0">Categorias</Heading>

               {(meType != "admin" && meType != "business") ? null : (
               <NextLink href="/create-category">
                  <Link ml="auto" color="snowStorm.0">
                     crear categoria
                  </Link>
               </NextLink>
               )}
            </Flex>
            <Flex p={2}>
            <Box  p={5} flexGrow={1}>
               <Text textAlign="center" fontSize={20} lex={1} mt={2} color="snowStorm.1" alignItems="center">
                  productos
            </Text>
            </Box>
            <Box p={5} flexGrow={1}>
               <Text textAlign="center" fontSize={20} lex={1} mt={2} color="snowStorm.1" alignItems="center">
                  promotores
            </Text>
            </Box>
            </Flex>
         {!data && loading 
            ? (<div>loading...</div>) 
            : (
            <Stack spacing={8}>
                  {data!.allCategories.map((p) => 
                  !p ? null : (
                     <Flex key={p.name}  >
                        <Box borderWidth="1px" shadow="md" p={5} flexGrow={1}>
                        <NextLink href="/post/category/[categoryName]" as={`/post/category/${p.name}`}>
                           <Link>          
                              <Text textAlign="center" fontSize={20} lex={1} mt={2} color="snowStorm.1">{p.name}</Text>
                           </Link>
                        </NextLink>
                        </Box>
                        

                        <Box borderWidth="1px" shadow="md" p={5} flexGrow={1}>
                        <NextLink href="/search/promotores/[categoryName]" as={`/search/promotores/${p.name}`}>
                           <Link>   
                              <Text textAlign="center" fontSize={20} lex={1} mt={2} color="snowStorm.1" alignItems="center">{p.name}</Text>
                           </Link>
                        </NextLink>
                        </Box>
                     </Flex>
                  ))} 
               </Stack>)
         }
         </Wrapper>
         <Box mb={100}></Box>
      </Layout>
   )
}

export default withApollo({ssr: true})(AllCategories)//has ssr

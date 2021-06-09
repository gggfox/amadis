import React, { useState } from "react"
import { Layout } from "../components/Layout"
import { useCategoryQuery, useMeQuery } from "../generated/graphql"
import { Box, Flex, Heading, Link, Stack, Text } from "@chakra-ui/react"
import { withApollo } from "../utils/withApollo";
import { Wrapper } from "../components/Wrapper";
import NextLink from "next/link";

const tabs = ['PRODUCTOS', 'PROMOTORES'];
const routes = ['/post/category/','/search/promotores/']
const AllCategories = () => {
   const { data: meData} = useMeQuery();

   const [active, setActive] = useState(routes[0]);

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

            <Flex>
               {tabs.map((tab, index)=>(
                  <Box flexGrow={1}>
                     <Link>
                     <Text 
                     textAlign="center" 
                     fontSize={20} 
                     lex={1} 
                     mt={2} 
                     color="snowStorm.1" 
                     alignItems="center"
                     onClick={() => setActive(routes[index])}
                     bg={active == routes[index] ? "polarNight.1" : ""}
                     p={3}
                     borderRadius={20}
                     border={active == routes[index] ? "2px" : ""}
                     borderColor="polarNight.0"
                     >
                        {tab}
                        
                     </Text>
                     </Link>
                  </Box>
               ))}
            </Flex>

         {!data && loading 
            ? (<div>loading...</div>) 
            : (
               <Flex justifyContent="space-around" flexWrap="wrap">
                  {data!.allCategories.map((c) => 
                  !c ? null : (
                     
                        <NextLink href={`${active}[categoryName]`} as={`${active}${c.name}`}>
                           <Link>    
                           <Box 
                            id={c.name}
                            color= "aurora.yellow"
                            width="fit-content" 
                            border="2px" 
                            mr={2}
                            mt={2} 
                            p={1} 
                            borderRadius={15}
                            _hover={{ bg: "frost.2" }}
                            >
                                <Link>{c.name}</Link>
                            </Box>      
                           </Link>
                        </NextLink>
                  ))}</Flex> )
         }
         </Wrapper>
         <Box mb={100}></Box>
      </Layout>
   )
}

export default withApollo({ssr: true})(AllCategories)//has ssr

import React, { useState } from "react"
import { Layout } from "../components/Layout"
import { useCategoryQuery, useMeQuery } from "../generated/graphql"
import { Box, Flex, Heading, Link, Text } from "@chakra-ui/react"
import { withApollo } from "../utils/apollo/withApollo";
import { Wrapper } from "../components/Wrapper";
import NextLink from "next/link";
import { Category } from '../components/styled/Category';

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
               <Heading color="wl" fontFamily="unna" fontSize={40}>Buscar</Heading>

               {(meType != "admin" && meType != "business") ? null : (
               <NextLink href="/create-category">
                  <Link ml="auto" color="pd">
                  <Text as="ins">
                  <b>crear categoria</b>
               </Text> 
                  </Link>
               </NextLink>
               )}
            </Flex>
            </Wrapper>


            <Wrapper variant="regular">
            <Flex mb={10}>
               {tabs.map((tab, index)=>(
                  <Box flexGrow={1}>
                     
                     <Text 
                     textAlign="center" 
                     fontSize={20}
                     fontFamily="unna" 
                     color="wl" 
                     alignItems="center"
                     onClick={() => setActive(routes[index])}
                     borderBottom={active == routes[index] ? "2px" : ""}
                     borderColor="pd"
                     >
                        <Link _hover={{}}>{tab}       </Link>           
                     </Text>

                  </Box>
                  
               ))}
            </Flex>
            

           
         {!data && loading 
            ? (<div>loading...</div>) 
            : (
               <Flex justifyContent="space-around" flexWrap="wrap">
                  {data!.allCategories.map((c) => !c 
                     ? null 
                     : (
                           <NextLink href={`${active}[categoryName]`} as={`${active}${c.name}`}>
                              <Link _hover={{}}><Category name={c.name}/></Link>
                           </NextLink>
                     )
                  )}
               </Flex> 
            )
         }
       </Wrapper>
         
      </Layout>
   )
}

export default withApollo({ssr: true})(AllCategories)//has ssr

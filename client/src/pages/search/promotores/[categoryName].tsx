import React from "react"
import NextLink from "next/link";
import { Layout } from "../../../components/Layout";
import { Wrapper } from "../../../components/Wrapper";
import { withApollo } from "../../../utils/apollo/withApollo";
import { useGetPromotoresFromUrlByCategory } from "../../../utils/urlManipulation/useGetPromotoresFromUrlByCategory";
import { Heading, Stack, Flex, Image, Link } from "@chakra-ui/react";
import { PromotorUpdootSection } from "../../../components/PromotorUpdootSection";
import { useGetStringCategory } from "../../../utils/urlManipulation/useGetStringCategory";
import { useMeQuery } from "../../../generated/graphql";

const SearchPromotoresByCategory = () => {
const { data:meData } = useMeQuery();
const {data, error, loading} = useGetPromotoresFromUrlByCategory();
const category = useGetStringCategory();
 console.log("data: "+data?.promotoresByCategory)
 if(!loading && !data){//done loading and no data
    return (
      <div>
         <div>you got no posts for some reason</div>
         <div>{error?.message}</div>
      </div>);
 }    const isPhone = global.window?.innerWidth < 400;

 
   return(
      <Layout>

         <Wrapper variant="regular">
            <Heading 
            color="wl" 
            fontSize={40} 
            fontFamily="unna"
            >
               #{category}
            </Heading>
         </Wrapper>
         
        
            <Stack spacing={8} w="100%" alignItems="center" m={0} p={0}>
               {data?.promotoresByCategory?.map((p) => 
               !p ? null : (
                  <Wrapper variant="regular">
                  <Flex key={p.id}>
                     {!meData?.me? (null):(
                     <PromotorUpdootSection promotor={p}/>
                     )}
                                    <Image
                  mx={5}
                  boxSize= {isPhone ? "120px" : "150px"}
                  borderRadius={20}
                  objectFit="cover"
                  src={`https://amadisimages.blob.core.windows.net/imagenes/Avatar:${p.id}`}
                  alt="promotor image"
                  fallbackSrc="https://via.placeholder.com/150"
                  border="2px"
                  borderColor="bd"
                  bg="pd"
               />
               
                     <NextLink href="/user/[id]" as={`/user/${p.id}`}>
                     
                        <Heading 
                          fontSize={isPhone ? 20 : 30} 
                          color="wl"
                        >
                           <Link>{p.username}</Link>
                        </Heading>
                     </NextLink>
                    
                  </Flex>
                  </Wrapper>
               ))}
            </Stack>
         
      </Layout>
   )
}

export default withApollo({ssr: true})(SearchPromotoresByCategory)//has ssr
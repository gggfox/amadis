import React from "react"
import { Box, Heading, Stack } from "@chakra-ui/react"
import { useGetProductsFromUrlByCategory } from "../../../utils/urlManipulation/useGetProductsFromUrlByCategory";
import { Layout } from "../../../components/Layout";
import { Wrapper } from "../../../components/Wrapper";
import { withApollo } from "../../../utils/apollo/withApollo";
import { useGetStringCategory } from "../../../utils/urlManipulation/useGetStringCategory";
import { Product, useMeQuery } from "../../../generated/graphql";
import { ProductPreview } from "../../../components/ProductPreview";

const SearchProductsByCategory = () => {
   const { data: meData} = useMeQuery();
   const {data, error, loading} = useGetProductsFromUrlByCategory();
  
 if(!loading && !data){//done loading and no data
    return (
      <div>
         <div>no tienes productos por alguna razon</div>
         <div>{error?.message}</div>
      </div>);
 }
 const category = useGetStringCategory(); 
    return(
 <Layout>
   <Wrapper>
      <Heading color="wl" fontSize={40} fontFamily="unna">
         #{category}
      </Heading>
   </Wrapper>
    {!data && loading 
      ? (<div>loading...</div>) 
      : (<Stack spacing={8} w="100%" alignItems="center">
            {data!.productsByCategory?.map((p) => 
            !p ? null : (
               <ProductPreview p={p as Product} meData={meData}/>
            ))}
         </Stack>)
    }
 
    <Box mb={100}></Box>
 </Layout>
)}

export default withApollo({ssr: true})(SearchProductsByCategory)//has ssr


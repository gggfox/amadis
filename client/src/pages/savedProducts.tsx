import React from "react"
import { Layout } from "../components/Layout"
import { Product, useSavedProductsQuery } from "../generated/graphql"
import { Box, Heading, Stack } from "@chakra-ui/react"
import { withApollo } from "../utils/apollo/withApollo";
import { Wrapper } from "../components/Wrapper";
import { useIsAuth } from "../utils/roleAuth/useIsAuth";
import { ProductPreview } from "../components/ProductPreview";

const SavedProducts = () => {
   const meData = useIsAuth();
   const {data, error, loading} = useSavedProductsQuery();
   if(!loading && !data){//done loading and no data
      return (
         <div>
            <div>no tienes produtos por alguna razon</div>
            <div>{error?.message}</div>
         </div>
      );
 }
 console.log(data?.savedProducts?.savedProducts)
    return(
 <Layout>
    <Wrapper variant="regular">
  
      <Heading color="wl" fontFamily="unna" fontSize={40}>Productos Guardados</Heading>

    </Wrapper>
    {!data && loading 
      ? (<div>loading...</div>) 
      : (<Stack spacing={8} w="100%" alignItems="center">
            {data!.savedProducts?.savedProducts!.map((p): any => 
            !p ? null : (
               <ProductPreview p={p as Product} meData={meData}/>
            ))}
         </Stack>)
    }

   
    <Box mb={100}></Box>
 </Layout>
)}

export default withApollo({ssr: true})(SavedProducts)//has ssr

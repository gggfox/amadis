import React, { InputHTMLAttributes } from 'react'
import { Image, Flex, Link, Box, Heading, Text } from "@chakra-ui/react";
import { Product } from '../generated/graphql';
import { UpdootSection } from './UpdootSection';
import { ProductOptionsMenu } from './ProductOptionsMenu';
import { SaveProductBtn } from './SaveProductBtn';
import NextLink from "next/link";
import { Wrapper } from './Wrapper';
type ProductPreviewProps = InputHTMLAttributes<HTMLInputElement> & {
    p: Product;
    meData: any;
};

export const ProductPreview: React.FC<ProductPreviewProps> = ({p, meData,}) => {
   
   const isLiked = (productId:number) => {
      const products = meData?.me?.savedProducts?.map((p:any) => {
         return p.id ? p.id : null
      });
      return products?.includes(productId);
   }
   
    const isPhone = global.window?.innerWidth < 400;
    
    const addComma = (numString:string) => {
      let threePairs = 0;
      let res = '';
      for(let i = numString.length -1; i >= 0; i--){
         res += numString[i] ;
         threePairs += 1;
         if(threePairs === 3 && i != 0){
            res += ','
            threePairs = 0;
         }
         
      }
      return res.split("").reverse().join("");
    }

    return (    
      <Wrapper variant="regular">
      <Flex 
         key={p.id} 
         flexDirection="row"
         flexWrap="nowrap"
         justifyContent="space-between"
         w="100%"
      >
         
          
               {!meData? (null):(
                          <UpdootSection product={p}/>
         
               )}
               <Box mr={5} h="100%"/> 
               <Image
                  boxSize= {isPhone ? "120px" : "150px"}
                  borderRadius={20}
                  objectFit="cover"
                  src={`https://amadisimages.blob.core.windows.net/imagenes/Product:${p.id}`}
                  alt="product image"
                  fallbackSrc="https://via.placeholder.com/150"
                  border="2px"
                  borderColor="bd"
                  bg="pd"
               />
            
            <Flex  flexDirection="column" justifyContent="flex-start" height="100%" width="100%" ml={5}>
                  <NextLink href="/product/[id]" as={`/product/${p.id}`}>
                        <Heading fontSize={20} color="wl">
                           <Link>{p.title}</Link>
                        </Heading>
                  </NextLink>
                  <Heading fontSize={20} color="wl" mt={2}>
                           ${addComma(p.price.toString())}.00
                  </Heading>
                  <NextLink href="/user/[id]" as={`/user/${p.creator.id}`}>
                     <Link color="pd">
                           <Text as="ins" fontWeight="bold">vendedor</Text>:
                           {" " + p.creator.username}
                     </Link>
                  </NextLink>

            </Flex>


            <Flex alignItems="flex-end" height="100%" alignSelf="flex-end">
                  {(meData && meData?.me?.id === p.creator.id)
                     ?(<ProductOptionsMenu id={p.id} creatorId={p.creator.id}/>)
                     :(<SaveProductBtn meId={meData?.me?.id} like={isLiked(p.id) as boolean} productId={p.id}/>)
                  }  
            </Flex>
       
         

         
      </Flex></Wrapper>
    );
}
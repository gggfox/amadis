import React, { InputHTMLAttributes } from 'react'
import { Image, Flex, Link, Box, Heading, Text } from "@chakra-ui/react";
import { Post } from '../generated/graphql';
import { UpdootSection } from './UpdootSection';
import { EditDeletePostButtons } from './EditDeletePostButtons';
import { SavePostBtn } from './SavePostBtn';
import NextLink from "next/link";

type PostPreviewProps = InputHTMLAttributes<HTMLInputElement> & {
    p: Post;
    meData: any;
};

export const PostPreview: React.FC<PostPreviewProps> = ({p, meData,}) => {
   
   const isLiked = (postId:number) => {
      const products = meData?.me?.savedProducts?.map((p:any) => {
         if(p.id){
            return p.id;
         }
         return null;
      });
      return products?.includes(postId);
   }
   
    const isPhone = global.window?.innerWidth < 400;
    

    return (    
      <Flex 
         key={p.id} 
         p={5} 
         shadow="md" 
         borderWidth="1px" 
         borderRadius={5} 
         borderColor="frost.0" 
         flexDirection="row"
         flexWrap="nowrap"
      >
         <Flex alignItems="center">
         {!meData? (null):(
         <UpdootSection post={p}/>
         )}
                     
         <Image
            boxSize= {isPhone ? "85px" : "100px"}
            mr={5}
            borderRadius={50}
            src={`https://amadisimages.blob.core.windows.net/imagenes/post:${p.id}`}
            alt="product image"
            fallbackSrc="https://media.giphy.com/media/duzpaTbCUy9Vu/giphy.gif"
            border="2px"
            borderColor="frost.1"
            
         />
        
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
                  <Text color="frost.2">
                     vendedor: {p.creator.username}
                  </Text>
               </Link>
            </NextLink>
            <Text>{}</Text>
         </Box>
         </Flex>
         <Box></Box>
         
         <Flex flex={1} alignItems="center" justifyContent="right">
               {(meData && meData?.me?.id === p.creator.id)
                  ?(<EditDeletePostButtons id={p.id} creatorId={p.creator.id}/>)
                  :(<SavePostBtn meId={meData?.me?.id} like={isLiked(p.id) as boolean} postId={p.id}/>)
               }  
         
         </Flex>
      
      </Flex>
    );
}
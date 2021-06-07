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
            return p.id
        });
        return products?.includes(postId);
    }

    const isPhone = global.window?.innerWidth < 400;
    

    return (    
           <Flex key={p.id} p={5} shadow="md" borderWidth="1px" borderRadius={5} borderColor="frost.0">
                  {!meData?.me? (null):(
                  <UpdootSection post={p}/>
                  )}
                     
                     <Image
                        boxSize= {isPhone ? "85px" : "100px"}
                        mr={5}
                        borderRadius={50}
                        src={`https://amadisimages.blob.core.windows.net/imagenes/post:${p.id}`}
                        alt="product image"
                        fallbackSrc="https://media.giphy.com/media/duzpaTbCUy9Vu/giphy.gif"
                     />
                    <Text>{}</Text>
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

                     <Flex flexDirection="row" m={0} p={0}>
                     {/* <Text lex={1} mt={2} color="snowStorm.1">{p.textSnippet}...</Text> */}
                     {!meData?.me? (null):(
                     <Box ml="auto" mt={3}>
                        
                        {(meData?.me?.id === p.creator.id)
                           ?(<EditDeletePostButtons id={p.id} creatorId={p.creator.id}/>)
                           :(<SavePostBtn meId={meData.me.id} like={isLiked(p.id) as boolean} postId={p.id} origin={'User'}/>)
                        }  
                     </Box>
                     )}
                  </Flex>
                </Box>
               </Flex>
    );
}
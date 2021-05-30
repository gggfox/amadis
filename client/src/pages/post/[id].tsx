import { Heading } from '@chakra-ui/layout';
import { Box, Flex } from '@chakra-ui/react';
import React from 'react';
import { EditDeletePostButtons } from '../../components/EditDeletePostButtons';
import { Layout } from '../../components/Layout';
import { PromoteProductBtn } from '../../components/PromoteProductBtn';
import { Wrapper } from '../../components/Wrapper';
import { useMeQuery } from '../../generated/graphql';
import { useGetPostFromUrl } from '../../utils/useGetPostFromUrl';
import { withApollo } from '../../utils/withApollo';

const Post = ({}) => {
    const {data, error, loading} = useGetPostFromUrl(); 
    const {data: meData} = useMeQuery();
    if(loading){
        return(
            <Layout>
                <div>loading...</div>
            </Layout>
        );
    }

    if(error) {
        return <div>{error.message}</div>
    }

    if(!data?.post){
        return <Layout>
            <Box>could not find post</Box>
        </Layout>
    }

    let alreadyAPromotor = false;
    if(data.post.promotors){
        data.post.promotors.map((c) => {
            if(c.id === meData?.me?.id){
                alreadyAPromotor = true;
            }
        });
    }

    
        return (
            <Layout>
                <Wrapper variant="regular">
                <Heading mb={4}>{data.post.title}</Heading>
               <Box mb={4}>{data.post.text}</Box>

               {(data?.post?.categories?.length === 0)  ? null : 
               (<Flex flexDirection="column">
                   Categorias:
                   {data.post.categories?.map((c)=>(
                       <Box>{c.categoryName}</Box>
                   ))}
               </Flex>
               )}
               <Flex mt={4}>
                   {alreadyAPromotor?(null):(<Box mr={2}><PromoteProductBtn postId={data.post.id} /></Box>)}
                    <EditDeletePostButtons id={data.post.id} creatorId={data.post.creator.id} />
               </Flex>

               </Wrapper>
            </Layout>
        );
}

export default  withApollo({ssr: true})(Post);
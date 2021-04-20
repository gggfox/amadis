import { Heading } from '@chakra-ui/layout';
import { Box } from '@chakra-ui/react';
import React from 'react';
import { EditDeletePostButtons } from '../../components/EditDeletePostButtons';
import { Layout } from '../../components/Layout';
import { Wrapper } from '../../components/Wrapper';
import { useGetPostFromUrl } from '../../utils/useGetPostFromUrl';
import { withApollo } from '../../utils/withApollo';

const Post = ({}) => {
    const {data, error, loading} = useGetPostFromUrl(); 

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
        return (
            <Layout>
                <Wrapper variant="regular">
                <Heading mb={4}>{data.post.title}</Heading>
               <Box mb={4}>{data.post.text}</Box> 
               <EditDeletePostButtons id={data.post.id} creatorId={data.post.creator.id} />
               </Wrapper>
            </Layout>
        );
}

export default  withApollo({ssr: true})(Post);
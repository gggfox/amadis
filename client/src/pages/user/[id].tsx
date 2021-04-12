import { Box, Heading } from '@chakra-ui/react';
import React from 'react';
import { Layout } from '../../components/Layout';
import { Wrapper } from '../../components/Wrapper';
import { useGetUserFromUrl } from '../../utils/useGetUserFromUrl';
import { withApollo } from '../../utils/withApollo';

const User = ({}) => {
    const {data, error, loading} = useGetUserFromUrl(); 

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

    if(!data?.user){
        return <Layout>
            <Box>could not find post</Box>
        </Layout>
    }

        return (
            <Layout>
                <Wrapper variant="small">
               <Heading mb={4}>{data.user.username}</Heading>
               </Wrapper>
            </Layout>
        );
}

export default  withApollo({ssr: true})(User);
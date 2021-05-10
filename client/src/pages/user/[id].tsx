import { Box, Flex, Heading, IconButton } from '@chakra-ui/react';
import React from 'react';
import { Layout } from '../../components/Layout';
import { Wrapper } from '../../components/Wrapper';
import { useGetPromotorFromUrl } from '../../utils/useGetPromotorFromUrl';
import { withApollo } from '../../utils/withApollo';
import { AddSocialMediaModal } from '../../components/AddSocialMediaModal';
import { DeleteIcon } from '@chakra-ui/icons';
import { useDeleteSocialMediaMutation } from '../../generated/graphql';
const User = ({}) => {
    const {data, error, loading} = useGetPromotorFromUrl();
    const [deleteSocialMedia] = useDeleteSocialMediaMutation();
    console.log("data: "+data)
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

    if(!data?.promotor){
        return <Layout>
            <Box>could not find post</Box>
        </Layout>
    }

        return (
            <Layout variant="small">
                <Wrapper variant="small">
                    <Flex justifyContent="space-between">
                        <Heading mb={4}>
                            {data.promotor.username}
                        </Heading>
                        <AddSocialMediaModal userId={data.promotor.id}/>

                    </Flex>
               
               <Box>

               {!data.promotor.socialMedia ? (null):(
                   <Box mt={3}>Redes Sociales</Box>
               )}

               {data.promotor.socialMedia?.map((media)=>(
                   <Box>
               <a href={"https://www."+media.link} target="_blank">{media.social_media}</a>
               <IconButton 
                ml={2}
                aria-label="Delete Post" 
                icon={<DeleteIcon/>}
                bg="snowStorm.2"

                onClick={ () => {
                    console.log(deleteSocialMedia),
                    deleteSocialMedia({
                        variables: { link: media.link},
                        update:(cache) => {
                            cache.evict({id: 'User:' + data.promotor.id});
                        }
                    });
                }}/>
                </Box>
               ))}
               </Box>


               {!data.promotor.categories ? (null):(
                   <Box mt={3}>Categorias</Box>
               )}
               
                   {data.promotor.categories?.map((c)=>(
                   <Flex flexDirection="column">
                       {c.name}
                   </Flex>
               ))}
               </Wrapper>
            </Layout>
        );
}

export default  withApollo({ssr: true})(User);


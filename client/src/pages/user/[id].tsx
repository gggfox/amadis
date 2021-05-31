import { Box, Button, Flex, Heading, IconButton, Link } from '@chakra-ui/react';
import React from 'react';
import { Layout } from '../../components/Layout';
import { Wrapper } from '../../components/Wrapper';
import { useGetPromotorFromUrl } from '../../utils/useGetPromotorFromUrl';
import { withApollo } from '../../utils/withApollo';
import { AddSocialMediaModal } from '../../components/AddSocialMediaModal';
import { DeleteIcon } from '@chakra-ui/icons';
import { useDeletePromotionMutation, useDeleteSocialMediaMutation, useLogoutMutation, useMeQuery } from '../../generated/graphql';
import NextLink from "next/link";
import { ChooseCategories4PromotorModal } from '../../components/ChooseCategories4PromotorModal';
import { useApolloClient } from '@apollo/client';

const User = ({}) => {
    const [logout,{loading: logoutFetching}] = useLogoutMutation();
    const {data, error, loading} = useGetPromotorFromUrl();
    const [deleteSocialMedia] = useDeleteSocialMediaMutation();
    const {data: meData} = useMeQuery();
    const [deletePromotion] = useDeletePromotionMutation();
    const apolloClient = useApolloClient();
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
        return (
            <Layout>
                <Box>could not find post</Box>
            </Layout>
        )
    }

    const hide = data?.promotor.id !== meData?.me?.id;
    
        return (
            <Layout variant="small">
                <Wrapper variant="small">
                    <Flex justifyContent="space-between">
                        <Heading mb={4} color="snowStorm.2">
                            {data.promotor.username}
                        </Heading>
                        {hide ? (null) : (
                        <Button 
                            onClick={async() => {
                                await logout();
                                await apolloClient.resetStore();
                            }} 
                            isLoading={logoutFetching}
                            variant="link">
                                logout
                        </Button>
                        )}
                    </Flex>
               
               <Box>
               {!data.promotor.socialMedia ? (null):(
                    <Flex justifyContent="space-between" mb={5}>
                        <Heading mt={3} size="md" color="snowStorm.0">
                        Redes Sociales
                        </Heading>
                        {hide?(null):
                            (<AddSocialMediaModal userId={data.promotor.id}/>)
                        }
                    </Flex>
               )}

               {data.promotor.socialMedia?.map((media)=>(
                   <Flex justifyContent="space-between">
                       <Heading size="xs" color="frost.3">
                <Link href={"https://www."+media.link} target="_blank" color="frost.3">
                   {media.social_media}
                </Link>
                </Heading>
               {hide ? (null):(
                    <IconButton 
                        ml={2}
                        aria-label="Delete SocialMedia" 
                        icon={<DeleteIcon/>}
                        bg="snowStorm.2"
                        size="sm"
                        onClick={ () => {
                            deleteSocialMedia({
                                variables: { link: media.link},
                                update:(cache) => {
                                    cache.evict({id: 'User:' + meData?.me?.id});
                                }
                            });
                        }}
                    />
                )}
                </Flex>
               ))}
               </Box>

            
               {!data.promotor.categories? (null):(
                   <Flex justifyContent="space-between" mt={5}>
                   <Heading mt={3} size="md" color="snowStorm.0">Categorias</Heading>
                    {!(data.promotor.id === meData?.me?.id && meData.me.userType === "influencer") ? (null) : (
                        <ChooseCategories4PromotorModal promotorId={data.promotor.id}/>
                    )}
                   </Flex>
               )}
               
                   {data.promotor.categories?.map((c)=>(
                   <Flex flexDirection="column">
                       {c.name}
                   </Flex>
               ))}


                {!data.promotor.promotes || data.promotor.activePromotions == 0
                    ? (null)
                    :(<Heading mt={3} size="md" color="snowStorm.0">Promociones: {data.promotor.activePromotions}</Heading>)
                }
               
                {data.promotor.promotes?.map((p) => (
                   <Flex flexDirection="column">
                       <Flex flexDirection="row" justifyContent="space-between">
                        <NextLink href="/post/[id]" as={`/post/${p.id}`}>
                            <Link>
                                <Heading size="xs" color="frost.3">
                                    {p.title}
                                </Heading>
                            </Link>
                        </NextLink>
                        {hide ? (null):(
                    <IconButton 
                        ml={2}
                        aria-label="Delete SocialMedia" 
                        icon={<DeleteIcon/>}
                        bg="snowStorm.2"
                        size="sm"
                        onClick={ () => {
                            deletePromotion({
                                variables: { postId: p.id},
                                update:(cache) => {
                                    cache.evict({id: 'User:' +  meData?.me?.id});
                                }
                            });
                        }}
                    />
                )}
                </Flex>
                   </Flex>
                ))}
                
               </Wrapper>
               <Box mt={20}></Box>
            </Layout>
        );
}

export default  withApollo({ssr: true})(User);


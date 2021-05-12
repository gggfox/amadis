import { Box, Flex, Heading, IconButton, Link } from '@chakra-ui/react';
import React from 'react';
import { Layout } from '../../components/Layout';
import { Wrapper } from '../../components/Wrapper';
import { useGetPromotorFromUrl } from '../../utils/useGetPromotorFromUrl';
import { withApollo } from '../../utils/withApollo';
import { AddSocialMediaModal } from '../../components/AddSocialMediaModal';
import { DeleteIcon } from '@chakra-ui/icons';
import { useDeletePromotionMutation, useDeleteSocialMediaMutation, useMeQuery } from '../../generated/graphql';
import NextLink from "next/link";
import { ChooseCategories4PromotorModal } from '../../components/ChooseCategories4PromotorModal';

const User = ({}) => {
    const {data, error, loading} = useGetPromotorFromUrl();
    const [deleteSocialMedia] = useDeleteSocialMediaMutation();
    const {data: meData} = useMeQuery();
    const [deletePromotion] = useDeletePromotionMutation();

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

    const hide = data?.promotor.id !== meData?.me?.id;

        return (
            <Layout variant="small">
                <Wrapper variant="small">
                    <Flex justifyContent="space-between">
                        <Heading mb={4}>
                            {data.promotor.username}
                        </Heading>
                        {hide?(null):
                        (<AddSocialMediaModal userId={data.promotor.id}/>)
                        }
                    </Flex>
               
               <Box>

               {!data.promotor.socialMedia ? (null):(
                   <Box mt={3}>Redes Sociales</Box>
               )}

               {data.promotor.socialMedia?.map((media)=>(
                   <Box>
               <a href={"https://www."+media.link} target="_blank">{media.social_media}</a>
               {hide ? (null):(
                    <IconButton 
                        ml={2}
                        aria-label="Delete SocialMedia" 
                        icon={<DeleteIcon/>}
                        bg="snowStorm.2"

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
                </Box>
               ))}
               </Box>


               {!data.promotor.categories ? (null):(
                   <Flex justifyContent="space-between">
                   <Box mt={3}>Categorias</Box>
                   <ChooseCategories4PromotorModal promotorId={data.promotor.id}/>
                   </Flex>
               )}
               
                   {data.promotor.categories?.map((c)=>(
                   <Flex flexDirection="column">
                       {c.name}
                   </Flex>
               ))}


                {!data.promotor.promotes 
                    ? (null)
                    :(<Box mt={3}>Promociones: {data.promotor.activePromotions}</Box>)
                }
               
                {data.promotor.promotes?.map((p) => (
                   <Flex flexDirection="column">
                       <Flex flexDirection="row">
                        <NextLink href="/post/[id]" as={`/post/${p.id}`}>
                            <Link>
                                <Heading fontSize="xl" color="snowStorm.1">
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


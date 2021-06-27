import { Avatar, Box, Flex, Heading, IconButton, Link, Tab, TabList, Tabs, Image, SimpleGrid, AspectRatio, Icon } from '@chakra-ui/react';
import React, { useState } from 'react';
import { Layout } from '../../components/Layout';
import { Wrapper } from '../../components/Wrapper';
import { useGetPromotorFromUrl } from '../../utils/urlManipulation/useGetPromotorFromUrl';
import { withApollo } from '../../utils/apollo/withApollo';
import { DeleteIcon } from '@chakra-ui/icons';
import { useDeletePromotionMutation, useDeleteSocialMediaMutation, useMeQuery } from '../../generated/graphql';
import NextLink from "next/link";
import { Category } from '../../components/styled/Category';
import { RiFacebookFill } from 'react-icons/ri'
import { SiTiktok,SiInstagram,SiYoutube,SiSpotify } from 'react-icons/si';
import { ProfileOptions } from '../../components/ProfileOptions';

const User = ({}) => {
    const {data, error, loading} = useGetPromotorFromUrl();
    const [deleteSocialMedia] = useDeleteSocialMediaMutation();
    const {data: meData} = useMeQuery();
    const [deletePromotion] = useDeletePromotionMutation();

  
    const promotorUserTabs = ["promociones", "redes", "categorias"]
  
    const [tab, setTab] = useState(0);

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
                <Box>could not find user</Box>
            </Layout>
        )
    }

    const hide = data?.promotor.id !== meData?.me?.id;
    const selected = { color: "pd", borderBottomWidth:2 , borderBottomColor:"pd" };

    const social_media_icons:any = {
        "facebook":RiFacebookFill,
        "tiktok": SiTiktok,
        "instagram":SiInstagram,
        "youtube":SiYoutube,
        "spotify":SiSpotify 
    }

    return (
        <Layout variant="small">
            <Wrapper variant="small">
            <Flex justifyContent="space-between">
                         <Avatar size="xl" name={data.promotor.username} mb={4} />
                         <ProfileOptions userId={data.promotor.id}/>
                </Flex>
               
                <Heading mb={4} color="wl" size="md">
                    {data.promotor.username.toUpperCase()}
                </Heading>
                [{data.promotor.userType}]
                <Tabs isFitted color="wl"  size="lg" variant="unstyled" >
                    <TabList>
                        <Tab 
                            _focus={{}} 
                            _selected={selected}
                        onClick={() => setTab(0)}
                        >
                            promociones
                        </Tab>
                        <Tab 
                            _focus={{}} 
                            _selected={selected}
                            onClick={() => setTab(1)}
                        >
                            redes
                        </Tab>
                        <Tab 
                            _focus={{}} 
                            _selected={selected}
                            onClick={() => setTab(2)}
                        >
                            categorias
                        </Tab>
                    </TabList>
                </Tabs>
                </Wrapper>
<Box my={3}></Box>                 
            {!(promotorUserTabs[tab]==="promociones")
                ? (null)
                : (<SimpleGrid columns={2} spacing={6}>
                    {data.promotor.promotes?.map((p) => (
                        
                        <Box>
                            <NextLink href="/product/[id]" as={`/product/${p.id}`}>
                            <Link>
                    <Box p={4}>
                            <AspectRatio maxW="560px" ratio={1} minW="150px" w="100%" h="100%" >
                            <Image
                                w="inherit"
                                h="inherit"
                                shadow="lg"
                                borderRadius={20}
                                src={`https://amadisimages.blob.core.windows.net/imagenes/product:${p.id}`}
                                alt="product image"
                                fallbackSrc="https://via.placeholder.com/150"
                                border="2px"
                                borderColor="bd"
                                bg="bl"
                                objectFit="cover"
                            /></AspectRatio></Box>
                            </Link> 
                            </NextLink>

                             <Flex flexDirection="row" w="100%" justifyContent="space-around">
                                        <Heading size="xs" color="pd">
                                            {p.title}
                                        </Heading>
                                {hide ? (null):(
                            <IconButton 
                                aria-label="Delete SocialMedia" 
                                icon={<DeleteIcon/>}
                                bg="wl"
                                size="sm"
                                onClick={ () => {
                                    deletePromotion({
                                        variables: { productId: p.id},
                                        update:(cache) => {
                                            cache.evict({id: 'User:' +  meData?.me?.id});
                                        }
                                    });
                                }}
                            />
                        )}
                        </Flex>
                      </Box>
                        
                        ))}
                 </SimpleGrid>
                )
            }
            {!(promotorUserTabs[tab]==="redes")
                ? (null)
                : ( <Wrapper variant="small" bg='bd'><SimpleGrid columns={2} spacing={6} w="100%">        
                    {data.promotor.socialMedia?.map((media)=>(
                        <Flex flexDirection="column" align="center">
                             <Box p={4}>
                          <Link href={"https://"+media.link} target="_blank" color="pd">
                         
                            <AspectRatio maxW="560px" minW="150px" ratio={1}>
                              <Icon
                                borderRadius={20}
                                shadow="lg"
                                aria-label="social media button"
                                bg="bl"
                                color="wl"
                                w="inherit"
                                h="inherit"
                                p={10}
                                as={social_media_icons[`${media.social_media}`]}
                                _hover={{borderWidth:2}}
                              />
                            </AspectRatio>
                          </Link>
                          {hide ? (null):
                            (<IconButton 
                              w="100%"
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
                            />)
                          }</Box>
                        </Flex>    
                    ))}
                    </SimpleGrid></Wrapper>)
            }

{!(promotorUserTabs[tab]==="categorias")
                ? (null)
                :( <Box>{!(data.promotor.userType === "influencer") ? (null):(
                    <Flex justifyContent="space-between" mt={5}>
                        {/* {!(data.promotor.id === meData?.me?.id && meData.me.userType === "influencer") ? (null) : (
                            <ChooseCategories4Promotor promotorId={data.promotor.id}/>
                        )} */}
                    </Flex>
                    )}
                    <Flex flexDirection="row" flexWrap="wrap">
                    {data.promotor.categories?.map((c)=>(

                    <NextLink href={`/search/promotores/[categoryName]`} as={`/search/promotores/${c.name}`}>
                    <Link _hover={{}}>
                    <Category name={c.name}/>
                    </Link>
                    </NextLink>
                        
                        ))}
                    </Flex></Box>)}

            <Box mt={20}></Box>
        </Layout>
    );
}

export default  withApollo({ssr: true})(User);
import { Box, Button, Link } from '@chakra-ui/react';
import React from 'react'
import { useCreatePromotionMutation, useMeQuery } from '../generated/graphql';
import { SecondaryBtn } from './styled/SecondaryBtn';
interface PromoteProductBtnProps {
    productId: number,
}

export const PromoteProductBtn: React.FC<PromoteProductBtnProps> = ({productId}) => {
    const {data: meData} = useMeQuery();
    const [promotePost] = useCreatePromotionMutation();

    if(meData?.me?.userType !== "influencer" && meData?.me?.userType !== "admin"){
        return null;
    }
    
    return (
        <Link
          w="100%"
          onClick={ () => {
            promotePost({
                variables: { productId },
                update:(cache) => {
                    cache.evict({id: 'User:' + meData?.me?.id}),
                    cache.evict({id: 'Product:' + productId});
                }
            });
          }}
        >
            <SecondaryBtn text={"promover"}/>
        </Link>
    );
};

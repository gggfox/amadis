import { Box, Button } from '@chakra-ui/react';
import React from 'react'
import { useCreatePromotionMutation, useMeQuery } from '../generated/graphql';

interface PromoteProductBtnProps {
    postId: number,
}

export const PromoteProductBtn: React.FC<PromoteProductBtnProps> = ({postId}) => {
    const {data: meData} = useMeQuery();
    const [promotePost] = useCreatePromotionMutation();

    if(meData?.me?.userType !== "influencer" && meData?.me?.userType !== "admin"){
        return null;
    }

    
    return (
        <Box>
            <Button 
            ml={2}
            aria-label="Promote Post" 
            bg="frost.3"
            color="snowStorm.0"
            onClick={ () => {
                promotePost({
                    variables: { postId },
                    update:(cache) => {
                        cache.evict({id: 'User:' + meData?.me?.id}),
                        cache.evict({id: 'Post:' + postId});
                    }
                });
            }}> promover </Button>
        </Box>
    );
};

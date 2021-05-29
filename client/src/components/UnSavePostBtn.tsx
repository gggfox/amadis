import { Icon, IconButton } from '@chakra-ui/react';
import React from 'react'
import { useMeQuery, useUnSaveProductMutation } from '../generated/graphql';
import { IoMdHeartDislike } from 'react-icons/io';

interface UnSavePostBtnProps {
    postId: number,
}

export const UnSavePostBtn: React.FC<UnSavePostBtnProps> = ({postId}) => {
    const {data} = useMeQuery();
    const [unsaveProduct] = useUnSaveProductMutation();

    return (
     
            <IconButton 
            ml={2}
            aria-label="Delete Post" 
            icon={<Icon as={IoMdHeartDislike} boxSize={8}/>}
            bg=""

            onClick={ () => {
                unsaveProduct({
                    variables: { postId},
                    update:(cache) => {
                        cache.evict({id: 'User:' + data?.me?.id});
                    }
                });
            }}/>
      
    );
};

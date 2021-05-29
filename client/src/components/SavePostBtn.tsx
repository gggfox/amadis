import { Icon, IconButton } from '@chakra-ui/react';
import React from 'react'
import { useMeQuery, useSaveProductMutation } from '../generated/graphql';
import { BsFillHeartFill } from 'react-icons/bs';

interface SavePostBtnProps {
    postId: number,
}

export const SavePostBtn: React.FC<SavePostBtnProps> = ({postId}) => {
    const {data} = useMeQuery();
    const [saveProduct] = useSaveProductMutation();

    return (
     
            <IconButton 
            ml={2}
            aria-label="Delete Post" 
            icon={<Icon as={BsFillHeartFill} boxSize={8}/>}
            bg=""

            onClick={ () => {
                saveProduct({
                    variables: { postId},
                    update:(cache) => {
                        cache.evict({id: 'User:' + data?.me?.id});
                    }
                });
            }}/>
      
    );
};

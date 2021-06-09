import { EditIcon, DeleteIcon } from '@chakra-ui/icons';
import { Box, IconButton } from '@chakra-ui/react';
import React from 'react'
import NextLink from 'next/link';

import { useMeQuery, useDeletePostMutation } from '../generated/graphql';

interface EditDeletePostButtonsProps {
    id: number,
    creatorId: number,
}


export const EditDeletePostButtons: React.FC<EditDeletePostButtonsProps> = ({ id, creatorId}) => {
    const [deletePost] = useDeletePostMutation();
    const { data: meData} = useMeQuery();
  
    if(meData?.me?.id !== creatorId && meData?.me?.userType !== "admin"){
        return null;
    }
    return (
        <Box>
            <NextLink href='/post/edit/[id]' as={`/post/edit/${id}`}>
            <IconButton 
            aria-label="Edit Post" 
            icon={<EditIcon/>}
            bg="snowStorm.2"
            ml={2}
            mt={1}
            />
            
            </NextLink>
            <IconButton 
            mt={1}
            aria-label="Delete Post" 
            icon={<DeleteIcon/>}
            bg="snowStorm.2"
            ml={2}

            onClick={ () => {
                deletePost({
                    variables: { id},
                    update:(cache) => {
                        cache.evict({id: 'Post:' + id});
                    }
                });
            }}/>
            </Box>
    );
};

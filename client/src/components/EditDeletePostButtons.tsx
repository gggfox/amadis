import { EditIcon, DeleteIcon } from '@chakra-ui/icons';
import { Box, IconButton } from '@chakra-ui/react';
import React from 'react'
import NextLink from 'next/link';
import { MeQuery, useDeletePostMutation } from '../generated/graphql';

interface EditDeletePostButtonsProps {
    me: any,
    id: number,
    creatorId: number,
}

export const EditDeletePostButtons: React.FC<EditDeletePostButtonsProps> = ({me, id, creatorId}) => {
    const [deletePost] = useDeletePostMutation();

    if(me.id !== creatorId && me.userType !== "admin"){
        return null;
    }
    return (
        <Box>
            <NextLink href='/post/edit/[id]' as={`/post/edit/${id}`}>
            <IconButton 
            ml="auto" 
            aria-label="Edit Post" 
            icon={<EditIcon/>}
            bg="snowStorm.2"
            />
            
            </NextLink>
            <IconButton 
            ml={2}
            aria-label="Delete Post" 
            icon={<DeleteIcon/>}
            bg="snowStorm.2"

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

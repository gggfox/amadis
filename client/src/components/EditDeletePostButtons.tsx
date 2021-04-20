import { EditIcon, DeleteIcon } from '@chakra-ui/icons';
import { Box, IconButton } from '@chakra-ui/react';
import React from 'react'
import NextLink from 'next/link';
import { useDeletePostMutation, useMeQuery } from '../generated/graphql';

interface EditDeletePostButtonsProps {
    id: number,
    creatorId: number,
}

export const EditDeletePostButtons: React.FC<EditDeletePostButtonsProps> = ({id, creatorId}) => {
    const {data: meData} = useMeQuery();
    const [deletePost] = useDeletePostMutation();

    if(meData?.me?.id !== creatorId && meData?.me?.userType !== "admin"){
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

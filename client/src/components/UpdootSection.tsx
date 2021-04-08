import { Flex, IconButton } from '@chakra-ui/react';
import { ArrowUpIcon, ArrowDownIcon } from '@chakra-ui/icons';
import React, { useState } from 'react'
import { PostsQuery, useVoteMutation } from '../generated/graphql';

interface UpdootSectionProps {
    post: PostsQuery["posts"]["posts"][0]
}

export const UpdootSection: React.FC<UpdootSectionProps> = ({post}) => {
    const [loadingState, setLoadingState] = useState<'updoot-loading' | 'downdoot-loading' | 'not-loading'>('not-loading');
    const [, vote] = useVoteMutation();
    return (
            <Flex flexDirection="column" mr={3} alignItems="center">
                <IconButton
                    icon={<ArrowUpIcon/>} 
                    aria-label="Updoot post"
                    
                    onClick={async () => {
                        if(post.voteStatus === 1) {
                            return;
                        }
                        setLoadingState('updoot-loading')
                        await vote({
                            postId: post.id,
                            value: 1,
                        });
                        setLoadingState('not-loading');
                    }} 
                    bg={post.voteStatus === 1 ? "aurora.green" : "snowStorm.2"}
                    isLoading={loadingState==='updoot-loading'}
                    />
                <div>{post.points}</div>
                <IconButton
                    icon={<ArrowDownIcon/>} 
                    aria-label="Downdoot post"
                    onClick={async () => {
                        if(post.voteStatus === -1) {
                            return;
                        }
                        setLoadingState('downdoot-loading')
                        await vote({
                            postId: post.id,
                            value: -1,
                        })
                        
                        setLoadingState('not-loading');
                    }}
                    isLoading={loadingState==='downdoot-loading'}
                    bg={post.voteStatus === -1 ? "aurora.red" : "snowStorm.2"}
                    />
            </Flex>
    );
}
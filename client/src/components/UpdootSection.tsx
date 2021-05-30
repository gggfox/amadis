import { Flex, IconButton } from '@chakra-ui/react';
import { ArrowUpIcon, ArrowDownIcon } from '@chakra-ui/icons';
import React, { useState } from 'react'
import { PostsQuery, useVoteMutation, VoteMutation } from '../generated/graphql';
import gql from 'graphql-tag';
import { ApolloCache } from '@apollo/client';

interface UpdootSectionProps {
    post: PostsQuery["posts"]["posts"][0]
}

const updateAfterVote = (
  value: number, 
  postId: number,
  cache:ApolloCache<VoteMutation>
) => {
    const data = cache.readFragment<{
      id: number;
      points: number
      voteStatus: number | null;
    }>({
        id: 'Post:' + postId,
        fragment: gql`
            fragment _ on Post {
                id 
                points
                voteStatus
            } 
        `,
    });
    if (data) {
        if (data.voteStatus === value) {
            return;
        }
        const newPoints =
          (data.points as number) + (!data.voteStatus ? 1 : 2) * value;
        cache.writeFragment({
            id: 'Post:' + postId,
            fragment: gql`
                fragment __ on Post {
                    points
                    voteStatus
                }
            `,
            data: { points: newPoints, voteStatus: value },
        });
    }
};

export const UpdootSection: React.FC<UpdootSectionProps> = ({post}) => {
    const [loadingState, setLoadingState] = useState<'updoot-loading' | 'downdoot-loading' | 'not-loading'>('not-loading');
    const [vote] = useVoteMutation();
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
                            variables: {
                                postId: post.id,
                                value: 1,
                            },
                            update: (cache) => updateAfterVote(1, post.id, cache),
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
                            variables: {
                                postId: post.id,
                                value: -1,
                            },
                            update: (cache) => updateAfterVote(-1, post.id, cache),
                        })
                        
                        setLoadingState('not-loading');
                    }}
                    isLoading={loadingState==='downdoot-loading'}
                    bg={post.voteStatus === -1 ? "aurora.red" : "snowStorm.2"}
                    />
            </Flex>
    );
}
import { Flex, IconButton } from '@chakra-ui/react';
import { ArrowUpIcon, ArrowDownIcon } from '@chakra-ui/icons';
import React, { useState } from 'react'
import {PromotoresQuery, useVotePromotorMutation, VotePromotorMutation } from '../generated/graphql';
import gql from 'graphql-tag';
import { ApolloCache } from '@apollo/client';

interface PromotorUpdootSectionProps {
    promotor: PromotoresQuery["promotores"][0]
}

const updateAfterVote = (
  value: number, 
  userId: number,
  cache:ApolloCache<VotePromotorMutation>
) => {
    const data = cache.readFragment<{
      id: number;
      influencerPoints: number
      influencerVoteStatus: number | null;
    }>({
        id: 'User:' + userId,
        fragment: gql`
            fragment _ on User {
                id 
                influencerPoints
                influencerVoteStatus
            } 
        `,
    });
    if (data) {
        if (data.influencerVoteStatus === value) {
            return;
        }
        const newPoints =
          (data.influencerPoints as number) + (!data.influencerVoteStatus ? 1 : 2) * value;
        cache.writeFragment({
            id: 'User:' + userId,
            fragment: gql`
                fragment __ on User {
                    influencerPoints
                    influencerVoteStatus
                }
            `,
            data: { influencerPoints: newPoints, influencerVoteStatus: value },
        });
    }
};

export const PromotorUpdootSection: React.FC<PromotorUpdootSectionProps> = ({promotor}) => {
    const [loadingState, setLoadingState] = useState<'updoot-loading' | 'downdoot-loading' | 'not-loading'>('not-loading');
    const [vote] = useVotePromotorMutation();

    return (
        <Flex flexDirection="column" mr={3} alignItems="center">
            <IconButton
                icon={<ArrowUpIcon/>} 
                aria-label="Updoot user"
                
                onClick={async () => {
                    if(promotor.influencerVoteStatus === 1) {
                        return;
                    }
                    setLoadingState('updoot-loading')
                    await vote({
                        variables: {
                            promotorId: promotor.id,
                            value: 1,
                        },
                        update: (cache) => updateAfterVote(1, promotor.id, cache),
                    });
                    setLoadingState('not-loading');
                }} 
                bg={promotor.influencerVoteStatus === 1 ? "aurora.green" : "snowStorm.2"}
                isLoading={loadingState==='updoot-loading'}
                />
            <div>{promotor.influencerPoints}</div>
            <IconButton
                icon={<ArrowDownIcon/>} 
                aria-label="Downdoot post"
                onClick={async () => {
                    if(promotor.influencerVoteStatus === -1) {
                        return;
                    }
                    setLoadingState('downdoot-loading')
                    await vote({
                        variables: {
                            promotorId: promotor.id,
                            value: -1,
                        },
                        update: (cache) => updateAfterVote(-1, promotor.id, cache),
                    })
                    
                    setLoadingState('not-loading');
                }}
                isLoading={loadingState==='downdoot-loading'}
                bg={promotor.influencerVoteStatus === -1 ? "aurora.red" : "snowStorm.2"}
                />
        </Flex>
    );
}
import { Flex, IconButton, Text } from '@chakra-ui/react';
import React, { useState } from 'react'
import {PromotoresQuery, useVotePromotorMutation, VotePromotorMutation } from '../generated/graphql';
import gql from 'graphql-tag';
import { ApolloCache } from '@apollo/client';
import {ImArrowUp,ImArrowDown } from 'react-icons/im'

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
    const isPhone = global.window?.innerWidth < 400;

    return (
        <Flex 
          flexDirection="column" 
          alignItems="center" 
          justifyContent="space-between"
        >
            <IconButton
                variant="unstyled"
                _hover={{color:"pd"}}
                aria-label="Updoot promotor"

                as={ImArrowUp} 
                boxSize={8}
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
                color={promotor.influencerVoteStatus === 1 ? "pd" : "bd"}
                isLoading={loadingState==='updoot-loading'}
                />

            <Text 
                color="wl" 
                fontSize={isPhone ? "x-large" : "xx-large"} 
                fontFamily="unna"
            >
                {promotor.influencerPoints}
            </Text>
        
            <IconButton
                variant="unstyled"
                _hover={{color:"rl"}}
                boxSize={8}
                as={ImArrowDown} 
                aria-label="Downdoot promotor"
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
                color={promotor.influencerVoteStatus === -1 ? "rl" : "bd"}
                />
        </Flex>
    );
}
import {  Flex, Text, IconButton } from '@chakra-ui/react';
import React, { useState } from 'react'
import { ProductsQuery, useVoteMutation, VoteMutation } from '../generated/graphql';
import gql from 'graphql-tag';
import { ApolloCache } from '@apollo/client';
import {ImArrowUp,ImArrowDown } from 'react-icons/im'

interface UpdootSectionProps {
    product: ProductsQuery["products"]["products"][0]
}

const updateAfterVote = (
  value: number, 
  productId: number,
  cache:ApolloCache<VoteMutation>
) => {
    const data = cache.readFragment<{
      id: number;
      points: number
      voteStatus: number | null;
    }>({
        id: 'Product:' + productId,
        fragment: gql`
            fragment _ on Product {
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
            id: 'Product:' + productId,
            fragment: gql`
                fragment __ on Product {
                    points
                    voteStatus
                }
            `,
            data: { points: newPoints, voteStatus: value },
        });
    }
};

export const UpdootSection: React.FC<UpdootSectionProps> = ({product}) => {
    const [vote] = useVoteMutation();
    const isPhone = global.window?.innerWidth < 400;
    const [loadingState, setLoadingState] = useState<'updoot-loading' | 'downdoot-loading' | 'not-loading'>('not-loading');

    return (
        <Flex flexDirection="column" justifyContent="space-between" alignItems="center">
            <IconButton
                variant="unstyled"
                _hover={{color:"pd"}}
                as={ImArrowUp}
                boxSize={8}
                aria-label="Updoot product"
                onClick={async () => {
                    if(product.voteStatus === 1) {
                        return;
                    }
                    setLoadingState('updoot-loading');
                    await vote({
                        variables: {
                            productId: product.id,
                            value: 1,
                        },
                        update: (cache) => updateAfterVote(1, product.id, cache),
                    });
                    setLoadingState('not-loading');
                }}
                isLoading={loadingState==='updoot-loading'}
                bg="bl" 
                color={product.voteStatus === 1 ? "pd" : "bd"}
            />

            <Text 
                color="wl" 
                fontSize={isPhone ? "x-large" : "xx-large"} 
                fontFamily="unna"
            >
                {product.points}
            </Text>

            <IconButton
                variant="unstyled"
                _hover={{color:"rl"}}
                as={ImArrowDown} 
                boxSize={8}
                aria-label="Downdoot post"
                onClick={async () => {
                    if(product.voteStatus === -1) {
                        return;
                    }
                    setLoadingState('downdoot-loading')
                    await vote({
                        variables: {
                            productId: product.id,
                            value: -1,
                        },
                        update: (cache) => updateAfterVote(-1, product.id, cache),
                    })
                    setLoadingState('not-loading');
                }}
                isLoading={loadingState==='downdoot-loading'}
                bg="bl"
                color={product.voteStatus === -1 ? "rl" : "bd"}
                />
        </Flex>
    );
}
import { Icon, IconButton } from '@chakra-ui/react';
import React, { useState } from 'react'
import { Post, SaveProductMutation, UnSaveProductMutation, useSaveProductMutation, useUnSaveProductMutation } from '../generated/graphql';
import { BsFillHeartFill } from 'react-icons/bs';
import { ApolloCache, gql } from '@apollo/client';
import { timeStamp } from 'node:console';

interface SavePostBtnProps {
    meId: number,
    like: boolean,
    postId: number,
    origin: string,
    
}

const updateAfterSave = (
    postId: number, 
    userId: number,
    like: boolean,
    cache:ApolloCache<SaveProductMutation> | ApolloCache<UnSaveProductMutation> 
  ) => {
      const data = cache.readFragment<{
        id: number;
        savedProducts: any;
      }>({
          id: 'User:' + userId,
          fragment: gql`
              fragment _ on User {
                  id
                  savedProducts{
                      id
                  }
              } 
          `,
      });

      if (data) {
          const newSavedProducts = () =>{

            if(like){
                for(let i = 0; i< data.savedProducts.length();i++){
                    if(data.savedProducts[i].id === postId){
                        data.savedProducts.splice(i--, 1);
                    }
                }
            }else{      
                let temp = data.savedProducts[0];
                temp.id = postId;
                data.savedProducts.push(temp);
            }
            return data.savedProducts;
          }
            

          cache.writeFragment({
              id: 'User:' + userId,
              fragment: gql`
                  fragment __ on User {
                    savedProducts{
                      id
                  }
                  }
              `,
              data: { savedProducts: newSavedProducts },
          });
      }
  };




export const SavePostBtn: React.FC<SavePostBtnProps> = ({meId, like, postId, origin}) => {
    const [saveProduct] = useSaveProductMutation();
    const [unsaveProduct] = useUnSaveProductMutation();
    const [saved, setSaved] = useState(like ? "red" : "black");

    const action = like ? unsaveProduct : saveProduct;

    const getColor = (like:boolean) => {
        if(like){
            return "red"
        }
        return "black"
    }

    return (
            <IconButton 
            ml={2}
            aria-label="Save Post" 
            icon={<Icon as={BsFillHeartFill} boxSize={8}/>}
            bg=""
            color={saved}
            onClick={ () => {
                setSaved(like ? "black" : "red"),
                action({
                    variables: { postId },
                    update: (cache:any) => {
                        if(origin === 'User'){
                            updateAfterSave( postId, meId, like, cache)
                        }
                        cache.evict({id: 'Post:' + postId});
                        
                    }
                    })
            }}
            
            />
      
    );
};
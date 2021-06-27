import { Icon, IconButton, Link } from '@chakra-ui/react';
import React, { useState } from 'react'
import { SaveProductMutation, UnSaveProductMutation, useSaveProductMutation, useUnSaveProductMutation } from '../generated/graphql';
import { BsFillHeartFill } from 'react-icons/bs';
import { ApolloCache, gql } from '@apollo/client';
import { useRouter } from 'next/router';

interface SaveProductBtnProps {
    meId: number,
    like: boolean,
    productId: number,
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




export const SaveProductBtn: React.FC<SaveProductBtnProps> = ({meId, like, productId}) => {
    const router = useRouter();
    const [saveProduct] = useSaveProductMutation();
    const [unsaveProduct] = useUnSaveProductMutation();
    
    const action = like ? unsaveProduct : saveProduct;
    const setColor = (bool:boolean) => {
       return bool ? "rl" : "bd"
    }
    const [saved, setSaved] = useState(setColor(like));
    const handleClick = () => {
        setSaved(setColor(!like)),
        action({
            variables: { productId },
            update: (cache:any) => {
                if(router.pathname === '/savedProducts'){
                    cache.evict({id: 'Product:' + productId});
                }else{
                    updateAfterSave( productId, meId, like, cache);
                }
            }
        })
    }
  
    return (
        <Link>
            <Icon
            aria-label="Save Post" 
            as={BsFillHeartFill}
            boxSize={8}
            bg=""
            color={saved}
            _hover={{color:setColor(!like)}}
            onClick={handleClick}
            />
      </Link>
    );
};

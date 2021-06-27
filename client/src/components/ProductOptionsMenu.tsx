import { Icon, Menu, MenuButton, MenuItem, MenuList } from '@chakra-ui/react';
import React from 'react'
import { BsThreeDots } from 'react-icons/bs';
import { useMeQuery, useDeleteProductMutation } from '../generated/graphql';
import { useRouter } from 'next/router';

interface ProductOptionsMenuProps {
    id: number,
    creatorId: number,
}


export const ProductOptionsMenu: React.FC<ProductOptionsMenuProps> = ({ id, creatorId}) => {
    const [deleteProduct] = useDeleteProductMutation();
    const { data: meData} = useMeQuery();
    const router = useRouter();

    if(meData?.me?.id !== creatorId && meData?.me?.userType !== "admin"){
        return null;
    }

    const edit = () => {
        router.push(`/product/edit/${id}`);
    }
    const eliminate = () => {
            deleteProduct({
              variables: { id },
              update:(cache) => {
                cache.evict({id: 'Product:' + id});
              }
            });
    }
    return (
            <Menu autoSelect={false} placement="left-end">
            <MenuButton color="wl">
                <Icon as={BsThreeDots} boxSize={8} aria-label="options button"/>
            </MenuButton>
            <MenuList bg="bl" borderColor='bd' color="wl" variant="unstyled" >
                <MenuItem _hover={{bg:"bd"}} onClick={edit}>Editar</MenuItem>
                <MenuItem 
                  _hover={{bg:"bd"}} 
                  color="rl"            
                  onClick={eliminate}
                >
                    Eliminar
                </MenuItem>
            </MenuList>
            </Menu>
    );
};

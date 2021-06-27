import React, { useState } from 'react'
import { useAddPictureMutation } from '../generated/graphql';
import { Layout } from '../components/Layout';
import { useIsAdmin } from '../utils/roleAuth/useIsAdmin';
import { withApollo } from '../utils/apollo/withApollo';
import { Wrapper } from '../components/Wrapper';

import { Button, Flex } from '@chakra-ui/react';

const AddImage: React.FC<{}> = ({}) => { 
    useIsAdmin();

    const [addImage] = useAddPictureMutation();
    const [file, changeFile] = useState("");


    const uploadFile = async() => {
      if(file === "") return;

      await addImage({ 
        variables: { 
          picture: file,
          productId: 1
        }
      });
    }

    const handleFileChange = async (e:any) => {
      if(!e.target.files[0]) return;
      changeFile(e.target.files[0]);
    } 
    

        return (
            <Layout variant="small">
              <Wrapper variant="small">


                <Flex>
                  <input type="file" id="photo" name="photo" required onChange={handleFileChange} />
                  <Button onClick={uploadFile}>subir imagen</Button>
                </Flex>
                </Wrapper>
            </Layout>
        );
};

export default  withApollo({ssr: false})(AddImage);
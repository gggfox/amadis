import React from 'react'
import { useAddPictureMutation } from '../generated/graphql';
import { Layout } from '../components/Layout';
import { useIsAdmin } from '../utils/useIsAdmin';
import { withApollo } from '../utils/withApollo';
import { Wrapper } from '../components/Wrapper';

const AddImage: React.FC<{}> = ({}) => { 
    useIsAdmin();
    const [addImage] = useAddPictureMutation();

    const handleFileChange = async (e:any) => {
      if(!e.target.files[0]) return;
      console.log(e.currentTarget.files[0].name)
      await addImage({ 
        variables: { 
          picture: e.currentTarget.files[0]
        }
      });
    } 
    

        return (
            <Layout variant="small">
              <Wrapper variant="small">


              <input type="file" id="photo" name="photo" required onChange={handleFileChange} />

                </Wrapper>
            </Layout>
        );
};

export default  withApollo({ssr: false})(AddImage);
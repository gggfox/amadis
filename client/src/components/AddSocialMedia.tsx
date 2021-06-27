import { Button, FormControl, FormLabel, Grid, GridItem, Select } from '@chakra-ui/react';
import { Field, Form, Formik } from 'formik';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { useAddSocialMediaMutation } from '../generated/graphql';
import { InputField } from './InputField';
import { PrimaryBtn } from './styled/PrimaryBtn';

interface AddSocialMediaProps {
    userId: number,
}

export const AddSocialMedia:React.FC<AddSocialMediaProps> = ({userId, ...props}) => {
    const [addSocialMedia] = useAddSocialMediaMutation();
    const [media, setMedia] = useState("");
    const router = useRouter();
    return (
        <Formik
          initialValues={{ social_media: media, link:"" }}
          onSubmit={
            async (values) => {
                console.log(values);
                values.social_media = media
                if(values.social_media === ""){
                    values.social_media = "facebook";
                }
                const { errors } = await addSocialMedia({variables: values,
                    update: (cache) => {
                        cache.evict({id: "User:" + userId});
                    }
                });
                if(errors){
                    router.push("/");
                }
            }
          }
        >
          {({isSubmitting}) => (
            <Form>
              <Grid
                templateRows="repeat(1, 1fr)"
                templateColumns="repeat(6, 1fr)"
                gap={1}
              >
                    <GridItem colSpan={2}>
                    <Field  name="social_media" bg="white" placeholder="hola">
                    {({form}:{form:any}) => (
                        <FormControl>
                            <FormLabel htmlFor="social_media"/>
                            <Select {...form} name="social_media" id="social_media" color="wl" >
                                <option value="facebook" onClick={() => setMedia("facebook")}>Facebook</option>
                                <option value="instagram" onClick={() => setMedia("instagram")}>Instagram</option>
                                <option value="tiktok" onClick={() => setMedia("tiktok")}>TikTok</option>
                                <option value="youtube" onClick={() => setMedia("youtube")}>Youtube</option>
                                <option value="spotify" onClick={() => setMedia("spotify")}>Spotify</option>
                            </Select>
                        </FormControl>
                    )}
                    </Field>
                    </GridItem>
                    <GridItem colSpan={4}>
                    <InputField 
                        textarea={false}
                        aria-label="social media link"
                        name="link"
                        placeholder="facebook.com"
                        label=""
                        hide_label={true}
                    />
                    </GridItem>
                </Grid>
                <Button 
                    mt={4} 
                    ml="50%"
                    type='submit' 
                    variant="unstyled"
                    w="50%"
                _   loading={isSubmitting}
                >
                    <PrimaryBtn text={"añadir red social"}/>
                </Button>
            </Form>
        )}
        </Formik>
        );
}
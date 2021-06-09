import React from 'react'
import { Field } from "formik";
import {Box } from "@chakra-ui/react";
import { Category } from '../generated/graphql';
import  theme  from "../theme"

type CategoryCheckBoxFieldProps = {
    c: Category ;
    filedName:string;
};

export const CategoryCheckBox: React.FC<CategoryCheckBoxFieldProps> = ({c, filedName}) => {
    const yellow = theme.colors.aurora.yellow;
    const white = theme.colors.snowStorm[2];

    const changeColor = (checked:boolean, id:string) => {
        let category = document.getElementById(id);
        if(category){
          if(checked){
            category.style.color =  yellow;
          }else{
            category.style.color = white;
          }
        }
      }

    return(
        <label key={c.name} >
        <Field 
          type="checkbox" 
          name={filedName}
          value={c.name} 
          onClick={(e:any) => changeColor(e.target.checked, c.name)}
          hidden
          />
        <Box 
          id={c.name}
          color= {white}
          width="fit-content" 
          border="2px" 
          mr={2}
          mt={2} 
          p={1} 
          borderRadius={15}
          >
          {c.name} 
        </Box>
      </label>
    )

}
import React, { useState } from 'react'
import { Field } from "formik";
import {Box, Link } from "@chakra-ui/react";
import { Category } from '../generated/graphql';

type CategoryCheckBoxFieldProps = {
    c: Category ;
    filedName:string;
    active?: boolean;
};

export const CategoryCheckBox: React.FC<CategoryCheckBoxFieldProps> = ({c, filedName, active=false}) => {
    const [selected, setSelected] = useState(active);

    return(
        <label key={c.name} >
        <Field 
          type="checkbox" 
          name={filedName}
          value={c.name} 
          onClick={(e:any) => setSelected(e.target.checked)}
          checked={selected}
          hidden
          />
        <Link _hover={{}}>
          <Box 
            id={c.name}
            color= {(selected) ? "pd" : "wl"}
            width="fit-content" 
            border="2px" 
            mx={2}
            my={2} 
            p={2} 
            borderRadius={25}
            _hover={{color: (!selected) ? "pd" : "wl"}}
          >
            #{c.name} 
          </Box>
        </Link>
      </label>
    )
}
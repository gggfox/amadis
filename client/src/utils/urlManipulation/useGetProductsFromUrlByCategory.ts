import { useProductsByCategoryQuery } from "../../generated/graphql";
import { useGetStringCategory } from "./useGetStringCategory";

export const useGetProductsFromUrlByCategory = () => {
    const category = useGetStringCategory(); 
    return useProductsByCategoryQuery({
        skip: category === "-1",
        variables: {
            categoryName: category,
        },
    });
};
import { usePromotoresByCategoryQuery } from "../../generated/graphql";
import { useGetStringCategory } from "./useGetStringCategory";

export const useGetPromotoresFromUrlByCategory = () => {
    const category = useGetStringCategory(); 
    return usePromotoresByCategoryQuery({
        skip: category === "-1",
        variables: {
            categoryName: category,
        },
    });
};
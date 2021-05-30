import { usePostsByCategoryQuery } from "../generated/graphql";
import { useGetStringCategory } from "./useGetStringCategory";

export const useGetPostsFromUrlByCategory = () => {
    const category = useGetStringCategory(); 
    return usePostsByCategoryQuery({
        skip: category === "-1",
        variables: {
            categoryName: category,
        },
    });
};
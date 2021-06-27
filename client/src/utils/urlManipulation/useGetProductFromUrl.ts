import { useProductQuery } from "../../generated/graphql";
import { useGetIntId } from "./useGetIntId";

export const useGetProductFromUrl = () => {
    const intId = useGetIntId(); 

    return useProductQuery({
        skip: intId === -1,
        variables: {
            id: intId,
        },
    });
};


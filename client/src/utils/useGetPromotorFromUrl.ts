import { usePromotorQuery } from "../generated/graphql";
import { useGetIntId } from "./useGetIntId";

export const useGetPromotorFromUrl = () => {
    const intId = useGetIntId(); 
    return usePromotorQuery({
        skip: intId === -1,
        variables: {
            id: intId,
        },
    });
};
import { useUserQuery } from "../generated/graphql";
import { useGetIntId } from "./useGetIntId";

export const useGetUserFromUrl = () => {
    const intId = useGetIntId(); 
    return useUserQuery({
        skip: intId === -1,
        variables: {
            id: intId,
        },
    });
};
import { useRouter } from "next/router";

export const useGetIntId = () => {
    const router = useRouter();
    //console.log("router: "+router)
    const intId = typeof router.query.id === "string" 
        ? parseInt(router.query.id) 
        : -1;
    return intId;
};
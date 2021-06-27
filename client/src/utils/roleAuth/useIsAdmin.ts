import { useRouter } from "next/router";
import { useEffect } from "react";
import { useMeQuery } from "../../generated/graphql";

export const useIsAdmin = () => {
    const {data, loading} = useMeQuery();
    const router = useRouter();
    useEffect(() => {
        if(!data?.me && !loading && data?.me?.userType === "admin") {
            router.replace("/login?next=" + router.pathname);
        }
    }, [loading, data,router]);
}
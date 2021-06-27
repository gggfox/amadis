import { useRouter } from "next/router";

export const useGetStringCategory = () => {
    const router = useRouter();
    const stringCategory = typeof router.query.categoryName === "string" 
        ? router.query.categoryName
        : "-1";
    return stringCategory as string;
};
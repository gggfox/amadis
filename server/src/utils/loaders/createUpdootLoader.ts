import DataLoader from "dataloader";
import { Updoot } from "../../entities/Updoot";


export const createUpdootLoader = () => 
    new DataLoader<{productId: number, userId: number}, Updoot | null>(
        async (keys) => {
            const updoots = await Updoot.findByIds(keys as any);
            const updootIdToUpdoot: Record<string, Updoot> = {};
            updoots.forEach((up) => {
                updootIdToUpdoot[`${up.userId}|${up.productId}`] = up;
            });

            return keys.map((key) => updootIdToUpdoot[`${key.userId}|${key.productId}`]);
        }
);
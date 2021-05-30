import DataLoader from "dataloader";
import { PromotorUpdoot } from "../entities/PromotorUpdoot";

export const createPromotorUpdootLoader = () => 
    new DataLoader<{promotorId: number, userId: number}, PromotorUpdoot | null>(
        async (keys) => {
            const updoots = await PromotorUpdoot.findByIds(keys as any);
            const updootIdToUpdoot: Record<string, PromotorUpdoot> = {};
            updoots.forEach((up) => {
                updootIdToUpdoot[`${up.userId}|${up.promotorId}`] = up;
            });

            return keys.map((key) => updootIdToUpdoot[`${key.userId}|${key.promotorId}`]);
        }
);
import { PrjStatus } from "./PrjStatus";

export type PrjStageStatus = {
    id: number;
    Description: string;
    isActive: boolean;
    UpdatedBy: number;
    UpdatedDate: Date;
    Statuses: PrjStatus[]
}
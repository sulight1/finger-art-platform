import { User } from './user.entity';
export declare enum ExchangeStatus {
    REQUESTED = "REQUESTED",
    ACCEPTED = "ACCEPTED",
    COMPLETED = "COMPLETED",
    CANCELLED = "CANCELLED"
}
export declare class SkillExchange {
    id: number;
    userA: User;
    userB: User;
    status: ExchangeStatus;
    description: string;
    zaowuBiCost: number;
    createdAt: Date;
    updatedAt: Date;
}

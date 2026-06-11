export declare enum UserRole {
    BUYER = "BUYER",
    CREATOR = "CREATOR",
    ADMIN = "ADMIN"
}
export declare class User {
    id: number;
    username: string;
    password: string;
    role: UserRole;
    creditScore: number;
    zaowuBiBalance: number;
    avatar: string;
    bio: string;
    realNameVerified: boolean;
    isBanned: boolean;
    banUntil: Date;
    createdAt: Date;
    updatedAt: Date;
}
//# sourceMappingURL=user.entity.d.ts.map
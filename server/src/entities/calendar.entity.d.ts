import { User } from './user.entity';
export declare enum CalendarType {
    BUSY = "BUSY",
    AVAILABLE = "AVAILABLE"
}
export declare class Calendar {
    id: number;
    user: User;
    startTime: Date;
    endTime: Date;
    type: CalendarType;
    description: string;
    createdAt: Date;
    updatedAt: Date;
}
//# sourceMappingURL=calendar.entity.d.ts.map
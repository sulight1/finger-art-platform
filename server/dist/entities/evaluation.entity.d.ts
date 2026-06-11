import { User } from './user.entity';
import { Order } from './order.entity';
export declare class Evaluation {
    id: number;
    order: Order;
    rater: User;
    ratee: User;
    score: number;
    comment: string;
    images: string[];
    createdAt: Date;
}

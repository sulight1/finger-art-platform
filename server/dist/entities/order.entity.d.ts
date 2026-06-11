import { User } from './user.entity';
import { Product } from './product.entity';
export declare enum OrderStatus {
    PENDING_PAY = "PENDING_PAY",
    PRODUCING = "PRODUCING",
    HALF_FINISHED_CONFIRM = "HALF_FINISHED_CONFIRM",
    PENDING_SHIP = "PENDING_SHIP",
    RECEIVED = "RECEIVED",
    COMPLETED = "COMPLETED",
    CANCELLED = "CANCELLED"
}
export declare class Order {
    id: number;
    buyer: User;
    product: Product;
    status: OrderStatus;
    amount: number;
    customRequirements: string;
    shippingAddress: string;
    createdAt: Date;
    updatedAt: Date;
}

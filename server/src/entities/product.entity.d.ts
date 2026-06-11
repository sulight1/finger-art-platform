import { User } from './user.entity';
export declare enum ProductType {
    READY_MADE = "READY_MADE",
    CUSTOMIZABLE = "CUSTOMIZABLE"
}
export declare class Product {
    id: number;
    creator: User;
    title: string;
    description: string;
    price: number;
    stock: number;
    tags: string[];
    images: string[];
    type: ProductType;
    createdAt: Date;
    updatedAt: Date;
}
//# sourceMappingURL=product.entity.d.ts.map
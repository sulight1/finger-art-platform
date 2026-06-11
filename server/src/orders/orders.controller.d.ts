import { OrdersService } from './orders.service';
import { ProductsService } from '../products/products.service';
import { OrderStatus } from '../entities/order.entity';
export declare class OrdersController {
    private ordersService;
    private productsService;
    constructor(ordersService: OrdersService, productsService: ProductsService);
    create(body: any, req: any): Promise<import("../entities/order.entity").Order>;
    findAll(req: any): Promise<import("../entities/order.entity").Order[]>;
    findOne(id: string): Promise<import("../entities/order.entity").Order>;
    updateStatus(id: string, status: OrderStatus, req: any): Promise<import("../entities/order.entity").Order>;
}
//# sourceMappingURL=orders.controller.d.ts.map
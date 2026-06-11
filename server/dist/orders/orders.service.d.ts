import { Repository } from 'typeorm';
import { Order, OrderStatus } from '../entities/order.entity';
import { User } from '../entities/user.entity';
import { Product } from '../entities/product.entity';
import { CreditService } from '../common/credit.service';
export declare class OrdersService {
    private ordersRepository;
    private creditService;
    constructor(ordersRepository: Repository<Order>, creditService: CreditService);
    create(orderData: Partial<Order>, buyer: User, product: Product): Promise<Order>;
    findAll(user: User): Promise<Order[]>;
    findOne(id: number): Promise<Order | null>;
    updateStatus(id: number, status: OrderStatus, user: User): Promise<Order>;
}

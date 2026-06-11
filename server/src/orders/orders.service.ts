import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order, OrderStatus } from '../entities/order.entity';
import { User } from '../entities/user.entity';
import { Product } from '../entities/product.entity';
import { CreditService } from '../common/credit.service';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
    private creditService: CreditService,
  ) {}

  async create(orderData: Partial<Order>, buyer: User, product: Product): Promise<Order> {
    const order = this.ordersRepository.create({
      ...orderData,
      buyer,
      product,
      status: OrderStatus.PENDING_PAY,
      amount: product.price, // Base price, could be adjusted for custom orders
    });
    return this.ordersRepository.save(order);
  }

  async findAll(user: User): Promise<Order[]> {
    return this.ordersRepository.find({
      where: user.role === 'CREATOR' ? { product: { creator: { id: user.id } } } : { buyer: { id: user.id } },
      relations: { buyer: true, product: { creator: true } },
    });
  }

  async findByArtisan(artisanId: number): Promise<Order[]> {
    return this.ordersRepository.find({
      where: { product: { creator: { id: artisanId } } },
      relations: { buyer: true, product: { creator: true } },
    });
  }

  async findByBuyer(buyerId: number): Promise<Order[]> {
    return this.ordersRepository.find({
      where: { buyer: { id: buyerId } },
      relations: { buyer: true, product: { creator: true } },
    });
  }

  async findOne(id: number): Promise<Order | null> {
    return this.ordersRepository.findOne({
      where: { id },
      relations: { buyer: true, product: { creator: true } },
    });
  }

  async updateStatus(id: number, status: OrderStatus, user: User): Promise<Order> {
    const order = await this.findOne(id);
    if (!order) throw new BadRequestException('Order not found');

    // Basic state machine logic
    const allowedTransitions: Record<OrderStatus, OrderStatus[]> = {
      [OrderStatus.PENDING_PAY]: [OrderStatus.PRODUCING, OrderStatus.CANCELLED],
      [OrderStatus.PRODUCING]: [OrderStatus.HALF_FINISHED_CONFIRM, OrderStatus.CANCELLED],
      [OrderStatus.HALF_FINISHED_CONFIRM]: [OrderStatus.PENDING_SHIP, OrderStatus.CANCELLED],
      [OrderStatus.PENDING_SHIP]: [OrderStatus.RECEIVED],
      [OrderStatus.RECEIVED]: [OrderStatus.COMPLETED],
      [OrderStatus.COMPLETED]: [],
      [OrderStatus.CANCELLED]: [],
    };

    if (!allowedTransitions[order.status].includes(status)) {
      throw new BadRequestException(`Cannot transition from ${order.status} to ${status}`);
    }

    // Role-based restrictions (e.g., only creator can mark as PRODUCING)
    if (status === OrderStatus.PRODUCING && user.id !== order.product.creator.id) {
      throw new BadRequestException('Only the creator can start production');
    }

    // Special logic for cancellation during production
    if (status === OrderStatus.CANCELLED && order.status === OrderStatus.PRODUCING) {
      if (user.id === order.product.creator.id) {
        // Penalty for creator cancelling during production
        await this.creditService.deductCredit(user.id, 10);
        // Ban for 7 days
        const banUntil = new Date();
        banUntil.setDate(banUntil.getDate() + 7);
        // This would ideally be handled in a dedicated user management service
        // For now, let's assume creditService can handle basic penalty logic
      }
    }

    order.status = status;
    return this.ordersRepository.save(order);
  }
}

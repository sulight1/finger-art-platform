import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { User } from './user.entity';
import { Product } from './product.entity';

export enum OrderStatus {
  PENDING_PAY = 'PENDING_PAY',
  PRODUCING = 'PRODUCING',
  HALF_FINISHED_CONFIRM = 'HALF_FINISHED_CONFIRM',
  PENDING_SHIP = 'PENDING_SHIP',
  RECEIVED = 'RECEIVED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  buyer: User;

  @ManyToOne(() => Product)
  product: Product;

  @Column({
    type: 'varchar',
    default: OrderStatus.PENDING_PAY,
  })
  status: OrderStatus;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({ type: 'text', nullable: true })
  customRequirements: string;

  @Column({ nullable: true })
  shippingAddress: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

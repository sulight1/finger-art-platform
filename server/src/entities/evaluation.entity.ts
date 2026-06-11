import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne } from 'typeorm';
import { User } from './user.entity';
import { Order } from './order.entity';

@Entity('evaluations')
export class Evaluation {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Order)
  order: Order;

  @ManyToOne(() => User)
  rater: User;

  @ManyToOne(() => User)
  ratee: User;

  @Column({ type: 'int' })
  score: number; // 1-5

  @Column({ type: 'text', nullable: true })
  comment: string;

  @Column({ type: 'json', nullable: true })
  images: string[];

  @CreateDateColumn()
  createdAt: Date;
}

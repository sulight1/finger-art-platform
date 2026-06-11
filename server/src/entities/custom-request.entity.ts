import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { User } from './user.entity';

@Entity('custom_requests')
export class CustomRequest {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  buyer: User;

  @Column()
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  budgetMin: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  budgetMax: number;

  @Column({ nullable: true })
  expectedMaterial: string;

  @Column({ type: 'json', nullable: true })
  referenceImages: string[];

  @Column()
  deadline: Date;

  @Column({ default: 'OPEN' }) // OPEN, CLOSED, COMPLETED
  status: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { User } from './user.entity';

export enum ExchangeStatus {
  REQUESTED = 'REQUESTED',
  ACCEPTED = 'ACCEPTED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

@Entity('skill_exchanges')
export class SkillExchange {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  userA: User;

  @ManyToOne(() => User)
  userB: User;

  @Column({
    type: 'varchar',
    default: ExchangeStatus.REQUESTED,
  })
  status: ExchangeStatus;

  @Column({ type: 'text' })
  description: string;

  @Column({ default: 0 })
  zaowuBiCost: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

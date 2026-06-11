import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { User } from './user.entity';

export enum ProductType {
  READY_MADE = 'READY_MADE',
  CUSTOMIZABLE = 'CUSTOMIZABLE',
}

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  creator: User;

  @Column()
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ default: 0 })
  stock: number;

  @Column({ type: 'json', nullable: true })
  tags: string[];

  @Column({ type: 'json', nullable: true })
  images: string[];

  @Column({
    type: 'varchar',
    default: ProductType.READY_MADE,
  })
  type: ProductType;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum UserRole {
  BUYER = 'BUYER',
  CREATOR = 'CREATOR',
  ADMIN = 'ADMIN',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column({ select: false })
  password: string;

  @Column({
    type: 'varchar',
    default: UserRole.BUYER,
  })
  role: UserRole;

  @Column({ default: 100 })
  creditScore: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  zaowuBiBalance: number;

  @Column({ nullable: true })
  avatar: string;

  @Column({ type: 'text', nullable: true })
  bio: string;

  @Column({ default: false })
  realNameVerified: boolean;

  @Column({ default: false })
  isBanned: boolean;

  @Column({ nullable: true })
  banUntil: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

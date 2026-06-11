import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { User } from './user.entity';

export enum CalendarType {
  BUSY = 'BUSY',
  AVAILABLE = 'AVAILABLE',
}

@Entity('calendars')
export class Calendar {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  user: User;

  @Column()
  startTime: Date;

  @Column()
  endTime: Date;

  @Column({
    type: 'varchar',
    default: CalendarType.AVAILABLE,
  })
  type: CalendarType;

  @Column({ nullable: true })
  description: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { User } from './User';

@Entity('leads')
export class Lead {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  first_name: string;

  @Column()
  last_name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  phone: string;

  @Column({ default: 'website' })
  source: string;

  @Column({ default: 'new' })
  status: string;

  @Column({ type: 'int', default: 0 })
  priority: number; // 0-100

  @Column({ nullable: true })
  interested_car_model: string | null;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  budget_min: number | null;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  budget_max: number | null;

  @Column({ nullable: true })
  preferred_contact_time: string | null;

  @Column({ default: false })
  financing_needed: boolean;

  @Column({ nullable: true })
  trade_in_vehicle: string | null;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'assigned_to' })
  assigned_to: User;

  @Column({ nullable: true })
  assigned_at: string | null;

  @Column({ type: 'int', default: 0 })
  lead_score: number; // 0-100

  @Column({ default: '' })
  tags: string;

  @Column({ nullable: true })
  notes: string | null;

  @Column({ nullable: true })
  first_contacted_at: string | null;

  @Column({ nullable: true })
  last_contacted_at: string | null;

  @Column({ nullable: true })
  converted_at: string | null;

  @Column({ nullable: true })
  expected_close_date: string | null;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
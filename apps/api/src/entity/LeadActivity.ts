import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Lead } from './Lead';
import { User } from './User';

@Entity('lead_activities')
export class LeadActivity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Lead)
  @JoinColumn({ name: 'lead_id' })
  lead: Lead;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ default: 'note' })
  activity_type: string;

  @Column()
  description: string;

  @Column({ nullable: true })
  outcome: string | null;

  @Column({ type: 'int', nullable: true })
  duration_minutes: number | null;

  @Column({ nullable: true })
  scheduled_at: string | null;

  @Column({ nullable: true })
  completed_at: string | null;

  @Column({ nullable: true })
  metadata: string | null;

  @CreateDateColumn()
  created_at: Date;
}
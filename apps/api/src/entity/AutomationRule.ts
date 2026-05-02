import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('automation_rules')
export class AutomationRule {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  trigger_event: string; // e.g., 'lead_created', 'lead_status_changed', 'activity_completed'

  @Column({ type: 'text', default: '{}' })
  conditions: string;

  @Column({ type: 'text', default: '[]' })
  actions: string;

  @Column({ default: true })
  is_active: boolean;

  @Column({ default: 0 })
  priority: number; // Higher number means higher priority

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
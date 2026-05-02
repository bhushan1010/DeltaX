import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Unique,
} from 'typeorm';

@Entity('users')
@Unique(['email'])
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password_hash: string;

  @Column()
  full_name: string;

  @Column({ default: 'sales_agent' })
  role: string;

  @Column({ nullable: true })
  phone: string | null;

  @Column({ nullable: true })
  avatar_url: string | null;

  @Column({ default: true })
  is_active: boolean;

  @Column({ nullable: true })
  last_login: Date | null;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
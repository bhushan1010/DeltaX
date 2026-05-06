import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Unique,
} from 'typeorm';

/**
 * DeltaX Role Hierarchy (highest → lowest privilege):
 *   admin   – Full system access; manages users, projects, tasks
 *   manager – Creates/manages projects and assigns tasks; no user management
 *   lead    – Creates and assigns tasks within their projects
 *   worker  – Views and updates only their own assigned tasks
 */
export enum UserRole {
  ADMIN   = 'admin',
  MANAGER = 'manager',
  LEAD    = 'lead',
  WORKER  = 'worker',
}

/** Ordered list used for hierarchical privilege checks (index 0 = highest) */
export const ROLE_HIERARCHY: UserRole[] = [
  UserRole.ADMIN,
  UserRole.MANAGER,
  UserRole.LEAD,
  UserRole.WORKER,
];

/** Returns true if `userRole` meets or exceeds the `requiredRole` level. */
export function hasMinimumRole(userRole: UserRole, requiredRole: UserRole): boolean {
  const userIdx     = ROLE_HIERARCHY.indexOf(userRole);
  const requiredIdx = ROLE_HIERARCHY.indexOf(requiredRole);
  return userIdx !== -1 && userIdx <= requiredIdx;
}

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

  @Column({
    type: 'varchar',
    enum: UserRole,
    default: UserRole.WORKER,
  })
  role: UserRole;

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
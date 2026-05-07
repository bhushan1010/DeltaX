/**
 * DeltaX — Demo Seed Script
 * Creates 4 demo users (one per role) plus a sample project, team, and tasks.
 *
 * Usage:
 *   npx ts-node src/scripts/seed.ts
 *
 * ⚠️  Run AFTER the database is up and migrations have been applied.
 */

import 'reflect-metadata';
import * as bcrypt from 'bcryptjs';
import { AppDataSource } from '../config/ormconfig';
import { User, UserRole } from '../entity/User';
import { Project } from '../entity/Project';
import { ProjectMember } from '../entity/ProjectMember';
import { Task, TaskStatus } from '../entity/Task';

// ─── Demo credential definitions ────────────────────────────────────────────

const DEMO_USERS: Array<{
  fullName: string;
  email: string;
  password: string;
  role: UserRole;
}> = [
  {
    fullName: 'Alice Admin',
    email:    'admin@deltax.com',
    password: 'Admin@123',
    role:     UserRole.ADMIN,
  },
  {
    fullName: 'Mark Manager',
    email:    'manager@deltax.com',
    password: 'Manager@123',
    role:     UserRole.MANAGER,
  },
  {
    fullName: 'Leo Lead',
    email:    'lead@deltax.com',
    password: 'Lead@123',
    role:     UserRole.LEAD,
  },
  {
    fullName: 'Wendy Worker',
    email:    'worker@deltax.com',
    password: 'Worker@123',
    role:     UserRole.WORKER,
  },
];

// ─── Main seeder ─────────────────────────────────────────────────────────────

async function seed() {
  await AppDataSource.initialize();
  console.log('✅ Database connected');

  const userRepo    = AppDataSource.getRepository(User);
  const projectRepo = AppDataSource.getRepository(Project);
  const memberRepo  = AppDataSource.getRepository(ProjectMember);
  const taskRepo    = AppDataSource.getRepository(Task);

  // ── 1. Create demo users (skip if email already exists) ──────────────────
  const savedUsers: Record<UserRole, User> = {} as any;

  for (const demo of DEMO_USERS) {
    let user = await userRepo.findOneBy({ email: demo.email });
    if (!user) {
      const salt = await bcrypt.genSalt(10);
      user = userRepo.create({
        full_name:     demo.fullName,
        email:         demo.email,
        password_hash: await bcrypt.hash(demo.password, salt),
        role:          demo.role,
      });
      user = await userRepo.save(user);
      console.log(`  Created user: ${demo.email} (${demo.role})`);
    } else {
      console.log(`  Skipped (exists): ${demo.email}`);
    }
    savedUsers[demo.role] = user;
  }

  // ── 2. Create a sample project ────────────────────────────────────────────
  let project = await projectRepo.findOneBy({ name: 'DeltaX Demo Project' });
  if (!project) {
    project = projectRepo.create({
      name:        'DeltaX Demo Project',
      description: 'A showcase project created by the seed script.',
      owner:       savedUsers[UserRole.ADMIN],
    });
    project = await projectRepo.save(project);
    console.log(`  Created project: ${project.name}`);
  } else {
    console.log(`  Skipped project (exists): ${project.name}`);
  }

  // ── 3. Add all demo users as project members ──────────────────────────────
  for (const user of Object.values(savedUsers)) {
    const existingMembership = await memberRepo.findOne({
      where: { project: { id: project.id }, user: { id: user.id } },
    });
    if (!existingMembership) {
      const member = memberRepo.create({ project, user });
      await memberRepo.save(member);
      console.log(`  Added to project: ${user.email}`);
    }
  }

  // ── 4. Create sample tasks ────────────────────────────────────────────────
  const sampleTasks = [
    {
      title:       'Set up CI/CD pipeline',
      description: 'Configure GitHub Actions for automated testing and deployment.',
      status:      TaskStatus.DONE,
      assignee:    savedUsers[UserRole.MANAGER],
      dueDate:     new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
    },
    {
      title:       'Design database schema',
      description: 'Finalise the ERD and run initial TypeORM migrations.',
      status:      TaskStatus.IN_PROGRESS,
      assignee:    savedUsers[UserRole.LEAD],
      dueDate:     new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // in 3 days
    },
    {
      title:       'Build authentication module',
      description: 'Implement JWT login, refresh tokens, and RBAC middleware.',
      status:      TaskStatus.IN_PROGRESS,
      assignee:    savedUsers[UserRole.WORKER],
      dueDate:     new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // in 5 days
    },
    {
      title:       'Write unit tests for TaskService',
      description: 'Achieve ≥ 80 % coverage for all TaskService methods.',
      status:      TaskStatus.TODO,
      assignee:    savedUsers[UserRole.WORKER],
      dueDate:     new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // in 10 days
    },
    {
      title:       'OVERDUE: Update API documentation',
      description: 'Sync the Swagger / OpenAPI spec with the latest endpoints.',
      status:      TaskStatus.TODO,
      assignee:    savedUsers[UserRole.LEAD],
      dueDate:     new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago (overdue)
    },
  ];

  for (const t of sampleTasks) {
    const exists = await taskRepo.findOneBy({ title: t.title, project: { id: project.id } });
    if (!exists) {
      const task = taskRepo.create({
        title:       t.title,
        description: t.description,
        status:      t.status,
        assignee:    t.assignee,
        project,
        due_date:    t.dueDate,
      });
      await taskRepo.save(task);
      console.log(`  Created task: "${t.title}" (${t.status})`);
    } else {
      console.log(`  Skipped task (exists): "${t.title}"`);
    }
  }

  console.log('\n🎉 Seed complete! Demo credentials:\n');
  console.table(
    DEMO_USERS.map((u) => ({
      Role:     u.role,
      Email:    u.email,
      Password: u.password,
    })),
  );

  await AppDataSource.destroy();
  console.log('✅ Seed process finished successfully.');
  process.exit(0);
}

seed().catch((err) => {
  console.error('⚠️  Seed encountered an error (non-fatal):', err?.message ?? err);
  // Exit 0 — seed failure should not prevent the server from starting
  process.exit(0);
});


import { DataSource } from 'typeorm';
import { User } from '../entity/User';
import { Project } from '../entity/Project';
import { ProjectMember } from '../entity/ProjectMember';
import { Task } from '../entity/Task';

const isProduction = process.env.NODE_ENV === 'production';
const databaseUrl = process.env.DATABASE_URL;

export const AppDataSource = new DataSource({
  type: databaseUrl ? 'postgres' : 'sqlite',
  ...(databaseUrl 
    ? { url: databaseUrl, ssl: isProduction ? { rejectUnauthorized: false } : false }
    : { database: 'database.sqlite' }
  ),
  entities: [User, Project, ProjectMember, Task],
  subscribers: [],
  synchronize: true, // Enabled in production for demo purposes to auto-create tables
  logging: false,
});
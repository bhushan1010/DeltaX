import { DataSource, DataSourceOptions } from 'typeorm';
import { User } from '../entity/User';
import { Project } from '../entity/Project';
import { ProjectMember } from '../entity/ProjectMember';
import { Task } from '../entity/Task';

const isProduction = process.env.NODE_ENV === 'production';
const databaseUrl = process.env.DATABASE_URL;

const config: DataSourceOptions = databaseUrl 
  ? {
      type: 'postgres',
      url: databaseUrl,
      ssl: isProduction ? { rejectUnauthorized: false } : false,
      entities: [User, Project, ProjectMember, Task],
      subscribers: [],
      synchronize: true, // Enabled in production for demo purposes to auto-create tables
      logging: false,
    }
  : {
      type: 'sqlite',
      database: 'database.sqlite',
      entities: [User, Project, ProjectMember, Task],
      subscribers: [],
      synchronize: true, // Auto-create tables for local dev
      logging: false,
    };

export const AppDataSource = new DataSource(config);
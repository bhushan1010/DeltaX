import { DataSource } from 'typeorm';
import { User } from '../entity/User';
import { Project } from '../entity/Project';
import { ProjectMember } from '../entity/ProjectMember';
import { Task } from '../entity/Task';

export const AppDataSource = new DataSource({
  type: 'sqlite',
  database: 'database.sqlite',
  entities: [User, Project, ProjectMember, Task],
  migrations: [__dirname + '/../migration/*{.ts,.js}'],
  subscribers: [],
  synchronize: true,
  logging: false,
});
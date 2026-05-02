import { DataSource } from 'typeorm';
import { User } from '../entity/User';
import { Lead } from '../entity/Lead';
import { LeadActivity } from '../entity/LeadActivity';
import { AutomationRule } from '../entity/AutomationRule';

export const AppDataSource = new DataSource({
  type: 'sqlite',
  database: ':memory:',
  entities: [User, Lead, LeadActivity, AutomationRule],
  migrations: [__dirname + '/../migration/*{.ts,.js}'],
  subscribers: [],
  synchronize: true,
  logging: false,
});
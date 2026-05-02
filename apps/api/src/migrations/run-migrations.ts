import { DataSource } from 'typeorm';
import { AppDataSource } from '../config/ormconfig';

async function runMigrations() {
  try {
    await AppDataSource.initialize();
    console.log('Database connection initialized');

    // Run migrations
    await AppDataSource.runMigrations();
    console.log('Migrations ran successfully');

    await AppDataSource.destroy();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error during migration:', error);
    process.exit(1);
  }
}

runMigrations();
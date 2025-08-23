import { DataSource } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT || '5432'),
  username: process.env.DATABASE_USER || 'postgres',
  password: process.env.DATABASE_PASS || 'postgres',
  database: process.env.DATABASE_NAME || 'content_db',
  synchronize: false,
  logging: process.env.NODE_ENV === 'development',
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/migrations/*{.ts,.js}'],
  namingStrategy: new SnakeNamingStrategy(),
});

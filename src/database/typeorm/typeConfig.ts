import { DataSourceOptions } from 'typeorm';

export const dataSourceOptions: DataSourceOptions = {
  type: 'mysql',
  host: process.env.DATABASE_HOST || 'localhost', // Default to localhost if DB_HOST is not set
  port: parseInt(process.env.DATABASE_PORT || '3306', 10),
  database: process.env.DATABASE_NAME || 'shoperyorganic', // Default to 'shoperyorganic' if DB_DATABASE is not set
  username: process.env.DATABASE_USER || 'root', // Default to 'root' if DB_USERNAME is not set
  password: process.env.DATABASE_PASSWORD || 'thuan@7771412',
  entities: [__dirname + "/../entities/**/*.entity{.ts,.js}"],
  migrations: [__dirname + "/../migration/history/*{.js,.ts}"],
  logger: 'simple-console',
  synchronize: true, // never use TRUE in production!
  dropSchema: true,
  logging: true, // for debugging in dev Area only
};
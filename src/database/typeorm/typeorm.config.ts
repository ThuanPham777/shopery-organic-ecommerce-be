import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';

export const getDatabaseConfig = (configService: ConfigService): TypeOrmModuleOptions => ({
  type: 'mysql',
  host: configService.get('DATABASE_HOST'),
  port: parseInt(configService.get<string>('DATABASE_PORT') || '3306', 10),
  database: configService.get('DATABASE_NAME'),
  username: configService.get('DATABASE_USER'),
  password: configService.get('DATABASE_PASSWORD'),
  entities: [join(__dirname, '/../entities/**/*.entity{.ts,.js}')],
  migrations: [join(__dirname, '/../migration/history/*{.ts,.js}')],
  logger: 'simple-console',
  synchronize: false, // never use TRUE in production!
  logging: true, // for debugging in dev Area only
});
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

export const getRedisConfig = (configService: ConfigService): Redis => {
  return new Redis({
    host: process.env.REDIS_HOST || 'localhost',
    port: Number(process.env.REDIS_PORT) || 6379,
  });
};

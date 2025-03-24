import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import Redis from 'ioredis'; // Import mặc định

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private client: Redis; // Dùng đúng kiểu dữ liệu

  async onModuleInit() {
    this.client = new Redis({
      host: process.env.REDIS_HOST ?? 'localhost',
      port: Number(process.env.REDIS_PORT) ?? 6379,
    });

    this.client.on('error', (err) => console.error('Redis Error:', err));
  }

  async set(key: string, value: any, expireSeconds?: number): Promise<void> {
    const data = JSON.stringify(value);
    if (expireSeconds) {
      await this.client.set(key, data, 'EX', expireSeconds);
    } else {
      await this.client.set(key, data);
    }
  }

  async get<T>(key: string): Promise<T | null> {
    const data = await this.client.get(key);
    return data ? JSON.parse(data) : null;
  }

  async del(key: string): Promise<void> {
    await this.client.del(key);
  }

  async onModuleDestroy() {
    this.client.quit();
  }
}

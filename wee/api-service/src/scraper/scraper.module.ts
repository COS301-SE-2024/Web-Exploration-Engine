// src/scraper/scraper.module.ts
import { Module } from '@nestjs/common';
import { ScraperController } from './scraper.controller';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-yet';
import { ConfigModule, ConfigService } from '@nestjs/config';
import config from './config';

// Modules
import { PubSubModule } from '../pub-sub/pub_sub.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      load: [config],
      isGlobal: true,
    }),
    CacheModule.registerAsync({
      isGlobal: true, 
      imports: [ConfigModule],
      useFactory: async (config) => {
        const store = await redisStore({
          ttl: 24 * 60 * 60 * 1000, // 24 hours in cache
          socket: {
            host: config.get('redis.host'),
            port: config.get('redis.port')
          },
          password: config.get('redis.password'),
        })
        return { store }
      },
      inject: [ConfigService]
    }),
    PubSubModule,
  ],
  controllers: [ScraperController],
})
export class ScraperModule {}

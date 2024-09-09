// src/scraper/scraper.module.ts
import { Module } from '@nestjs/common';
import { ScraperService } from './scraper.service';
import { HealthController } from './scraper.controller';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-yet';
import { ConfigModule, ConfigService } from '@nestjs/config';
import config from './config';

// Modules
import { PubSubModule } from './pub-sub/pub_sub.module';

// Services
import { RobotsService } from './robots/robots.service';
import { ScrapeMetadataService } from './scrape-metadata/scrape-metadata.service';
import { ScrapeStatusService } from './scrape-status/scrape-status.service';
import { IndustryClassificationService } from './industry-classification/industry-classification.service';
import { ScrapeLogoService } from './scrape-logo/scrape-logo.service';
import { ScrapeImagesService } from './scrape-images/scrape-images.service';
import { ScrapeContactInfoService } from './scrape-contact-info/scrape-contact-info.service';
import { ScrapeAddressService } from './scrape-address/scrape-address.service';
import { ScreenshotService } from './screenshot-homepage/screenshot.service';
import { SeoAnalysisService } from './seo-analysis/seo-analysis.service';
import { SentimentAnalysisService } from './sentiment-analysis/sentiment-analysis.service';
import { ProxyService } from './proxy/proxy.service';
import { ScrapeReviewsService } from './scrape-reviews/scrape-reviews.service';
import { KeywordAnalysisService } from './keyword-analysis/keyword-analysis.service';
import {NewsScraperService} from './scrape-news/scrape-news.service';
import {ShareCountService } from './share-count-analytics/share-count-analytics.service';
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
          ttl: 60 * 60 * 1000, // 60 minutes in cache
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
  controllers: [HealthController],
  providers: [
    ScraperService,
    RobotsService,
    ScrapeMetadataService,
    ScrapeStatusService,
    IndustryClassificationService,
    ScrapeLogoService,
    ScrapeImagesService,
    ScrapeContactInfoService,
    ScrapeAddressService,
    ScreenshotService,
    SeoAnalysisService,
    SentimentAnalysisService,
    KeywordAnalysisService,
    ProxyService,
    ScrapeReviewsService,
    NewsScraperService,
    ShareCountService,
  ],
})
export class ScraperModule {}

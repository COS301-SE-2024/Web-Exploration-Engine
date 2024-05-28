import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import {ScrapingModule } from '../industry-classification-app/industry.module';

@Module({
  imports: [ScrapingModule],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

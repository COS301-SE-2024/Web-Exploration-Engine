import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { IndustryModule } from '../industry-classification-app/industry.module';
import { RobotsModule } from '../robots-app/robots.module';
import { StatusModule } from '../status-app/scraping.module';
import { ImagesModule } from '../images-app/scraping.module';


@Module({
  imports: [RobotsModule, IndustryModule, StatusModule, ImagesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

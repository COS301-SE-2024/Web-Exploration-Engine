import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RobotsModule } from '../robots-app/robots.module';

@Module({
  imports: [RobotsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

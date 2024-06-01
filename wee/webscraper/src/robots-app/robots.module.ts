import { Module } from '@nestjs/common';
import { RobotsService } from './robots.service';
import { RobotsController } from './robots.controller';

@Module({
  providers: [RobotsService],
  controllers: [RobotsController],
})
export class RobotsModule {}

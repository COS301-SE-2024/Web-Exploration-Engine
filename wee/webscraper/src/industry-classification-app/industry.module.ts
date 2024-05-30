import { Module } from '@nestjs/common';
import { IndustryService } from '../industry-classification-app/industry.service';
import { IndustryController } from '../industry-classification-app/industry.controller';

@Module({
  controllers: [IndustryController],
  providers: [IndustryService],
})
export class IndustryModule {}

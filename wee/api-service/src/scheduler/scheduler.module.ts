import { Module } from '@nestjs/common';
import { SchedulerService } from './scheduler.service';
import { SchedulerController } from './scheduler.controller';
import { SupabaseService } from '../supabase/supabase.service'; 
import { PubSubService } from '../pub-sub/pub_sub.service';

@Module({
  controllers: [SchedulerController],
  providers: [SchedulerService, SupabaseService, PubSubService],
})
export class SchedulerModule {}

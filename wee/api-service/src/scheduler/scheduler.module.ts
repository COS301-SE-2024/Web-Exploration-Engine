import { Module } from '@nestjs/common';
import { SchedulerService } from './scheduler.service';
import { SupabaseService } from '../supabase/supabase.service'; 
import { PubSubService } from '../pub-sub/pub_sub.service';

@Module({
  providers: [SchedulerService, SupabaseService, PubSubService],
})
export class SchedulerModule {}

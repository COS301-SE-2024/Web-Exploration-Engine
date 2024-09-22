import { Module } from '@nestjs/common';
import { SchedulerService } from './scheduler.service';
import { SupabaseService } from '../supabase/supabase.service'; 
import { PubSubService } from '../pub-sub/pub_sub.service';
import { EmailService } from '../email-service/email.service';
@Module({
  providers: [SchedulerService, SupabaseService, PubSubService,EmailService],
})
export class SchedulerModule {}

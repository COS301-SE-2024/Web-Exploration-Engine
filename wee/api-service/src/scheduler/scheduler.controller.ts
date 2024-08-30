import { Controller, Post, Body, Put } from '@nestjs/common';
import { SchedulerService } from './scheduler.service';
import { ScheduleTask } from '../models/scheduleTaskModels';
import { ApiExcludeEndpoint } from '@nestjs/swagger';

@Controller('schedule')
export class SchedulerController {
  constructor(private readonly schedulerService: SchedulerService) {}

  @Post('create')
  // @ApiExcludeEndpoint() // This hides the endpoint from Swagger -- do we want this?
  async createSchedule(@Body() scheduleTask: ScheduleTask) {
    return await this.schedulerService.createSchedule(scheduleTask);
  }
}

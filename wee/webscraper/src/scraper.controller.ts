import { Controller, Get,UseInterceptors } from '@nestjs/common';
import { PerformanceInterceptor } from './performance.interceptor';
import logger from '../logging/webscraperlogger'
@UseInterceptors(PerformanceInterceptor)
@Controller('health')
export class HealthController {
  @Get()
  check() {
    logger.info(HealthController.name,34223,'Sheldon')

    return { status: 'ok' }; 
  }
}

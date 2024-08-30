import { Controller, Get,UseInterceptors } from '@nestjs/common';
import { PerformanceInterceptor } from './performance.interceptor';

@UseInterceptors(PerformanceInterceptor)
@Controller('health')
export class HealthController {
  @Get()
  check() {
    return { status: 'ok' }; 
  }
}

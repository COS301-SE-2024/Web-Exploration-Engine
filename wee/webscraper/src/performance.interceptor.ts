/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { performance } from 'perf_hooks';
import getLogger from '../logging/webscraperlogger';
const logger = getLogger();
const serviceName = "[PerformanceInterceptor]";
logger.info(serviceName, 'Service started');

@Injectable()
export class PerformanceInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    logger.debug(`${serviceName}`);
    const now = performance.now();
    return next
      .handle()
      .pipe(
        tap(() =>{

          console.log(
            `${context.getClass().name} - ${context.getHandler().name} executed in ${(
              performance.now() - now
            ).toFixed(2)}ms`,
          );
          
          logger.info(context.getClass().name, 'duration' , (performance.now() - now) , context.getHandler().name);

        }
        ),
      );
  }
}
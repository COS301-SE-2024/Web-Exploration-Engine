import { Module } from '@nestjs/common';
import { StatusService } from './status.service';
import { StatusController } from './status.controller';
/**
 * Module for handling Status-related functionality.
 */
@Module({
    providers: [StatusService],
    controllers: [StatusController],
})
export class StatusModule {}

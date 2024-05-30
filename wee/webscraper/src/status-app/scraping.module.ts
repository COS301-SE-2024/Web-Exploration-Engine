import { Module } from '@nestjs/common';
import { StatusService } from './scraping.service';
import { StatusController } from './scraping.controller';
/**
 * Module for handling scraping-related functionality.
 */
@Module({
    providers: [StatusService],
    controllers: [StatusController],
})
export class StatusModule {}

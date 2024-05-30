import { Module } from '@nestjs/common';
import { ScrapingModule } from './scraping.module';

/**
 * Represents the main application module.
 * This module imports the ScrapingModule to provide scraping functionality.
 */

@Module({
    imports: [ScrapingModule],
})
export class AppModule {}
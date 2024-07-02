import { Module } from '@nestjs/common';
import { ScraperModule } from '../scraper/scraper.module';
import { ScreenshotModule } from '../homepage-screenshot/screenshot.modules';
@Module({
  imports: [ScraperModule, ScreenshotModule],
})
export class AppModule {}

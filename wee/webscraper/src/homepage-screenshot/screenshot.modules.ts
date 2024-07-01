import { Module } from '@nestjs/common';
import { ScreenshotService } from './screenshot.service';
import { ScreenshotController } from './screenshot.controller';

@Module({
  providers: [ScreenshotService],
  controllers: [ScreenshotController],
})
export class ScreenshotModule {}

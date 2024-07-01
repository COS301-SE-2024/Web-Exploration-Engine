import { Controller, Get, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import { ScreenshotService } from './screenshot.service';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Screenshot')
@Controller('screenshot')
export class ScreenshotController {
  constructor(private readonly screenshotService: ScreenshotService) {}

  @ApiOperation({ summary: 'Capture a screenshot of a website' })
  @ApiQuery({
    name: 'url',
    description: 'URL of the website to capture',
    required: true,
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Returns the screenshot as an image',
  })
  @ApiResponse({ status: 403, description: 'URL not allowed by robots.txt' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  @Get()
  async getScreenshot(@Query('url') url: string, @Res() res: Response) {
    try {
      const isAllowed = await ScreenshotService.checkAllowed(url);
      if (!isAllowed) {
        return res
          .status(403)
          .json({ message: 'URL not allowed by robots.txt' });
      }

      const screenshotBuffer = await this.screenshotService.getScreenshot(url);
      res.setHeader('Content-Type', 'image/png');
      res.send(screenshotBuffer);
    } catch (error) {
      res
        .status(500)
        .json({ message: 'Internal Server Error', error: error.message });
    }
  }
}

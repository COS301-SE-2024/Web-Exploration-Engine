import { ScreenshotService } from '../scraper/screenshot-homepage/screenshot.service';
import { RobotsResponse } from '../scraper/models/ServiceModels';

describe('ScreenshotService', () => {
  let screenshotService: ScreenshotService;

  beforeEach(() => {
    screenshotService = new ScreenshotService();
  });

  it('should capture a screenshot', async () => {
    const url = 'https://example.com';
    const robots: RobotsResponse = {
      isUrlScrapable: true,
      baseUrl: '',
      allowedPaths: [],
      disallowedPaths: [],
      isBaseUrlAllowed: false
    };

    try {
      const result = await screenshotService.captureScreenshot(url, robots);
      expect(result).toBeDefined();
      expect(result).toHaveProperty('screenshot');
      expect(typeof result.screenshot).toBe('string');
    } catch (error) {
      fail(`Unexpected error: ${error.message}`);
    }
  });



});

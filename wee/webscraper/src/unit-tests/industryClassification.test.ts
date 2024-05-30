
import { ScrapingService } from '../industry-classification-app/industry.service';


// Test if the ScrapingController returns the correct industry on successful scrape
describe('ScrapingController', () => {

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should throw an error for a url that cannot be scrapped', async () => {
    const Url = 'https://www.amazon.com';
    const scrapingService = new ScrapingService();


    await expect(scrapingService.scrapeMetadata(Url)).rejects.toThrowError('cannot scrape this website');
  });

  it('should throw an error for an invalid URL', async () => {
    const Url = 'https://www.example.com';
    const scrapingService = new ScrapingService();


    await expect(scrapingService.scrapeMetadata(Url)).rejects.toThrowError('An error occurred while fetching allowed paths');
  });

  it('should return {"E-Commerce"} for a valid URL', async () => {
    const Url = 'https://www.takealot.com';
    const scrapingService = new ScrapingService();

    const result = await scrapingService.scrapeMetadata(Url);
    const industry = result.industry; // Extract the value of the 'industry' key

    expect(industry).toEqual("E-commerce"); // Compare the value with the expected value
  });


});


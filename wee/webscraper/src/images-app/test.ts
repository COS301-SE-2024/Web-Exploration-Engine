// import { ScrapingService } from './scraping.service';
// import * as puppeteer from 'puppeteer';

// // Mock the puppeteer module
// jest.mock('puppeteer', () => ({
//   launch: jest.fn(),
// }));

// describe('ScrapingService', () => {
//   let scrapingService: ScrapingService;

//   beforeEach(() => {
//     scrapingService = new ScrapingService();
//   });

//   afterEach(() => {
//     jest.clearAllMocks();
//   });

//   describe('scrapeImages', () => {
//     it('should scrape images from a given URL', async () => {
//       // Mock browser and page objects
//       const mockBrowser = {
//         newPage: jest.fn(),
//         close: jest.fn(),
//       };
//       const mockPage = {
//         goto: jest.fn(),
//         evaluate: jest.fn(() => ['image1.jpg', 'image2.jpg']),
//       };

//       // Mock puppeteer launch to resolve with mock browser
//       (puppeteer.launch as jest.Mock).mockResolvedValue(mockBrowser);
//       // Mock newPage method to resolve with mock page
//       mockBrowser.newPage.mockResolvedValue(mockPage);

//       // Call the method under test
//       const imageUrls = await scrapingService.scrapeImages('https://example.com');

//       // Assertions
//       expect(imageUrls).toEqual(['image1.jpg', 'image2.jpg']);
//       expect(puppeteer.launch).toHaveBeenCalled();
//       expect(mockBrowser.newPage).toHaveBeenCalled();
//       expect(mockPage.goto).toHaveBeenCalledWith('https://example.com');
//       expect(mockPage.evaluate).toHaveBeenCalled();
//       expect(mockBrowser.close).toHaveBeenCalled();
//     });

//     // Add more test cases for edge cases like authentication, empty pages, timeout, errors, etc.
//   });

//   describe('scrapeLogos', () => {
//     it('should scrape logos from a given URL if og:image contains "logo"', async () => {
//       // Mock browser and page objects
//       const mockBrowser = {
//         newPage: jest.fn(),
//         close: jest.fn(),
//       };
//       const mockPage = {
//         goto: jest.fn(),
//         evaluate: jest.fn(() => ({ ogImage: 'https://example.com/logo.png' })),
//       };

//       // Mock puppeteer launch to resolve with mock browser
//       (puppeteer.launch as jest.Mock).mockResolvedValue(mockBrowser);
//       // Mock newPage method to resolve with mock page
//       mockBrowser.newPage.mockResolvedValue(mockPage);

//       // Call the method under test
//       const logoUrl = await scrapingService.scrapeLogos('https://example.com');

//       // Assertions
//       expect(logoUrl).toBe('https://example.com/logo.png');
//       expect(puppeteer.launch).toHaveBeenCalled();
//       expect(mockBrowser.newPage).toHaveBeenCalled();
//       expect(mockPage.goto).toHaveBeenCalledWith('https://example.com');
//       expect(mockPage.evaluate).toHaveBeenCalled();
//       expect(mockBrowser.close).toHaveBeenCalled();
//     });

//     // Add more test cases for other scenarios like logos found through image tags, no logos found, etc.
//   });

//   describe('scrapeMetadata', () => {
//     it('should scrape metadata from a given URL', async () => {
//       // Mock browser and page objects
//       const mockBrowser = {
//         newPage: jest.fn(),
//         close: jest.fn(),
//       };
//       const mockPage = {
//         goto: jest.fn(),
//         evaluate: jest.fn(() => ({
//           title: 'Example',
//           description: 'Example description',
//           keywords: 'example, test',
//           ogTitle: 'Example',
//           ogDescription: 'Example description',
//           ogImage: 'https://example.com/image.png',
//         })),
//       };

//       // Mock puppeteer launch to resolve with mock browser
//       (puppeteer.launch as jest.Mock).mockResolvedValue(mockBrowser);
//       // Mock newPage method to resolve with mock page
//       mockBrowser.newPage.mockResolvedValue(mockPage);

//       // Call the method under test
//       const metadata = await scrapingService.scrapeMetadata('https://example.com');

//       // Assertions
//       expect(metadata).toEqual({
//         title: 'Example',
//         description: 'Example description',
//         keywords: 'example, test',
//         ogTitle: 'Example',
//         ogDescription: 'Example description',
//         ogImage: 'https://example.com/image.png',
//       });
//       expect(puppeteer.launch).toHaveBeenCalled();
//       expect(mockBrowser.newPage).toHaveBeenCalled();
//       expect(mockPage.goto).toHaveBeenCalledWith('https://example.com');
//       expect(mockPage.evaluate).toHaveBeenCalled();
//       expect(mockBrowser.close).toHaveBeenCalled();
//     });

//     // Add more test cases for scenarios like missing metadata, different types of metadata available, etc.
//   });

//   // Add more test cases for other methods or edge cases as needed
// });

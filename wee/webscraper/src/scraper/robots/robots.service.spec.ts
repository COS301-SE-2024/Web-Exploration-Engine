import { Test, TestingModule } from '@nestjs/testing';
import { RobotsService } from './robots.service';

describe('RobotsService', () => {
  let service: RobotsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RobotsService],
    }).compile();

    service = module.get<RobotsService>(RobotsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

describe('extractDomain', () => {
  let service: RobotsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RobotsService],
    }).compile();

    service = module.get<RobotsService>(RobotsService);
  });

  it('should return the domain for a valid URL with www subdomain', () => {
    const validUrl = 'https://www.example.com/path/to/resource';
    const expectedDomain = 'https://www.example.com';
    const actualDomain = service.extractDomain(validUrl);
    expect(actualDomain).toBe(expectedDomain);
  });

  it('should return the domain for a valid URL without www subdomain', () => {
    const validUrl = 'https://www.amazon.com/robots.txt';
    const expectedDomain = 'https://www.amazon.com';
    const actualDomain = service.extractDomain(validUrl);
    expect(actualDomain).toBe(expectedDomain);
  });

  it('should return the domain for a valid URL with non-standard port', () => {
    const validUrl = 'https://www.amazon.com/music/unlimited?ref_=nav_em__dm_hf_0_2_2_2';
    const expectedDomain = 'https://www.amazon.com';
    const actualDomain = service.extractDomain(validUrl);
    expect(actualDomain).toBe(expectedDomain);
  });

  it('should throw an error for an invalid URL', () => {
    const invalidUrl = 'invalid-url';
    const expectedError = 'Invalid URL';
    expect(() => service.extractDomain(invalidUrl)).toThrow(expectedError);
  });

  it('should throw an error for an incomplete URL', () => {
    const invalidUrl = 'example.com/path/to/resource';
    const expectedError = 'Invalid URL';
    expect(() => service.extractDomain(invalidUrl)).toThrow(expectedError);
  });
});

describe('extractAllowedPaths', () => {
  let service: RobotsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RobotsService],
    }).compile();

    service = module.get<RobotsService>(RobotsService);
  });

  it('should correctly parse Amazon robots.txt and return allowed paths for user agent *', async () => {
    const url = 'https://www.amazon.com';

    const expectedPaths = new Set<string>([
      '/',
      '/wishlist/universal*',
      '/wishlist/vendor-button*',
      '/wishlist/get-button*',
      '/gp/wishlist/universal*',
      '/gp/wishlist/vendor-button*',
      '/gp/wishlist/ipad-install*',
      '/gp/dmusic/promotions/PrimeMusic',
      '/gp/dmusic/promotions/AmazonMusicUnlimited',
      '/-/es/',
      '/-/en$',
      '/-/zh_TW/',
      '/-/zh_TW$',
      '/-/he/',
      '/-/he$',
      '/gp/offer-listing/B000',
      '/gp/offer-listing/9000',
      '/gp/aag/main?*seller=ABVFEJU8LS620',
    ]);

    const result = await service.extractAllowedPaths(url);
    expect(result).toEqual(expectedPaths);
  });

it('should correctly parse Takealot robots.txt and return allowed paths for user agent *', async () => {
    const url = 'https://www.takealot.com';

    const expectedPaths = new Set<string>(['/']);

    const result = await service.extractAllowedPaths(url);
    expect(result).toEqual(expectedPaths);
  });

  it('should throw an error for a site that returns no paths', async () => {
    const url = 'https://www.pnp.com';
    const expectedErrorMessage = 'An error occurred while fetching allowed paths';

    try {
      await service.extractAllowedPaths(url);
    } catch (error) {
      expect(error.message).toBe(expectedErrorMessage);
    }
  });
});

describe('isCrawlingAllowed', () => {
  let service: RobotsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RobotsService],
    }).compile();

    service = module.get<RobotsService>(RobotsService);
  });

  it('should return true if crawling is allowed', async () => {
    const url = 'https://www.amazon.com';
    const expectedResponse = true;
    const paths = new Set<string>(['/']);

    const result = await service.isCrawlingAllowed(url, paths);
    expect(result).toBe(expectedResponse);
  });

  it('should return false if crawling is not allowed', async () => {
    const url = 'https://www.amazon.com';
    const expectedResponse = false;
    const paths = new Set<string>([]);

    const result = await service.isCrawlingAllowed(url, paths);
    expect(result).toBe(expectedResponse);
  });
});
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
  
  it('should return the same domain if it is the root domain', () => {
    const validUrl = 'https://www.amazon.com';
    const expectedDomain = 'https://www.amazon.com';
    const actualDomain = service.extractDomain(validUrl);
    expect(actualDomain).toBe(expectedDomain);
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

    const expectedAllowedPaths = [
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
    ];

    const result = await service.extractAllowedPaths(url);
    expect(result.allowedPaths).toEqual(expectedAllowedPaths);
  });

  it('should correctly parse Takealot robots.txt and return allowed paths for user agent *', async () => {
      const url = 'https://www.takealot.com';

      const expectedAllowedPaths = ["/"];
      const expectedDisallowedPaths = [
          "/*gclid=",
          "/ajax/*.php",
          "/ajax/*.php*",
          "/help/page/",
          "/help/faq/*",
          "/account/*",
          "/*qsearch=",
          "/*custom=",
          "/*dcat=",
          "/*sort=ReleaseDate",
          "/*sort=Price",
          "/*sort=Rating",
          "/*filter=Price",
          "/*filter=Rating",
          "/*filter=Availability",
          "/*filter=Shipping",
          "/*filter=Binding",
          "/*filter=Promotions",
          "/*filter=Colour",
          "/*filter=CourseCode",
          "/*filter=Format",
          "/*filter=Manufacturer",
          "/*filter=Lens",
          "/*filter=ASScreenSize",
          "/*filter=ASTabletDisplaySizes",
          "/*filter=Size",
          "/*filter=BabyAgeSize",
          "/*filter=AlphaClothingSize",
          "/*filter=AgeSize",
          "/*filter=ASNappySize",
          "/*filter=AgeGroup",
          "/*filter=Ages",
          "/*filter=BraSize",
          "/*filter=TVScreenSize",
          "/*filter=ShoeSize",
          "/*filter=FashionSize",
          "/*filter=ASRamSize",
          "/*filter=LegwearSize",
          "/*filter=LinenSize",
          "/*filter=PaperSize",
          "/*filter=StationarySize",
          "/*filter=ASStorageCapacity",
          "/*filter=EbooksFormat",
          "/*filter=ASColours",
          "/*filter=ColourVariant",
          "/*filter=BasicColours",
          "/*filter=BooksFormat",
          "/*filter=ASCondition",
          "/*filter=ASDigitalAppliance",
          "/*rows="
      ];
      

      const result = await service.extractAllowedPaths(url);
      expect(result.allowedPaths).toEqual(expectedAllowedPaths);
      expect(result.disallowedPaths).toEqual(expectedDisallowedPaths);
    });

  it('should return empty allowed paths for a URL with no robots.txt', async () => {
    const url = 'https://www.pnp.com';

    const expectedAllowedPaths = [];
    const result = await service.extractAllowedPaths(url);
    expect(result.allowedPaths).toEqual(expectedAllowedPaths);
  });

  it('should handle network error during fetch', async () => {
    const url = 'https://www.nonexistent-url.com'; // This URL will simulate a network error

    await expect(service.extractAllowedPaths(url)).rejects.toThrow('An error occurred while interpreting robots.txt file');
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
    const allowedPaths = new Set<string>([]);
    const disallowedPaths = new Set<string>([]);


    const result = await service.isCrawlingAllowed(url, Array.from(disallowedPaths),Array.from(allowedPaths));
    expect(result).toBe(expectedResponse);
  });

  it('should return false if crawling is not allowed', async () => {
    const url = 'https://www.test.com';
    const expectedResponse = false;
    const allowedPaths = new Set<string>([]);
    const disallowedPaths = new Set<string>(['/']);

    const result = service.isCrawlingAllowed(url, Array.from(disallowedPaths),Array.from(allowedPaths));
    expect(result).toBe(expectedResponse);
  });

  it('should throw an error if the URL is invalid', async () => {
    const url = 'invalid-url';
    const expectedError = 'Invalid URL: invalid-url';

    expect(() => service.isCrawlingAllowed(url, [], [])).toThrow(expectedError);
  });

});

describe('isRootPathAllowed', () => {
  it ('should return true if the root path is allowed', () => {
    const disallowedPaths = new Set<string>(['/']);
    const expectedResponse = false;

    const service = new RobotsService();
    const result = service.isRootPathAllowed(disallowedPaths);
    expect(result).toBe(expectedResponse);
  });

  it ('should return false if the root path is disallowed', () => {
    const disallowedPaths = new Set<string>([]);
    const expectedResponse = true;

    const service = new RobotsService();
    const result = service.isRootPathAllowed(disallowedPaths);
    expect(result).toBe(expectedResponse);
  });
});

describe('readRobotsFile', () => {
  it ('should return an error response if the URL parameter is not provided', async () => {
    const url = '';
    const expectedResponse = {
      errorStatus: 400,
      errorCode: '400 Bad Request',
      errorMessage: 'URL parameter is required'
    };

    const service = new RobotsService();
    const result = await service.readRobotsFile(url);
    expect(result).toEqual(expectedResponse);
  });

  it ('should return a valid response if the URL parameter is provided', async () => {
    const url = 'https://www.takealot.com';
    const expectedResponse = {
      baseUrl: 'https://www.takealot.com',
      allowedPaths: ["/"],
      disallowedPaths: [
          "/*gclid=",
          "/ajax/*.php",
          "/ajax/*.php*",
          "/help/page/",
          "/help/faq/*",
          "/account/*",
          "/*qsearch=",
          "/*custom=",
          "/*dcat=",
          "/*sort=ReleaseDate",
          "/*sort=Price",
          "/*sort=Rating",
          "/*filter=Price",
          "/*filter=Rating",
          "/*filter=Availability",
          "/*filter=Shipping",
          "/*filter=Binding",
          "/*filter=Promotions",
          "/*filter=Colour",
          "/*filter=CourseCode",
          "/*filter=Format",
          "/*filter=Manufacturer",
          "/*filter=Lens",
          "/*filter=ASScreenSize",
          "/*filter=ASTabletDisplaySizes",
          "/*filter=Size",
          "/*filter=BabyAgeSize",
          "/*filter=AlphaClothingSize",
          "/*filter=AgeSize",
          "/*filter=ASNappySize",
          "/*filter=AgeGroup",
          "/*filter=Ages",
          "/*filter=BraSize",
          "/*filter=TVScreenSize",
          "/*filter=ShoeSize",
          "/*filter=FashionSize",
          "/*filter=ASRamSize",
          "/*filter=LegwearSize",
          "/*filter=LinenSize",
          "/*filter=PaperSize",
          "/*filter=StationarySize",
          "/*filter=ASStorageCapacity",
          "/*filter=EbooksFormat",
          "/*filter=ASColours",
          "/*filter=ColourVariant",
          "/*filter=BasicColours",
          "/*filter=BooksFormat",
          "/*filter=ASCondition",
          "/*filter=ASDigitalAppliance",
          "/*rows="
      ],
      isUrlScrapable: true,
      isBaseUrlAllowed: true,
    };

    const service = new RobotsService();
    const result = await service.readRobotsFile(url);
    expect(result).toEqual(expectedResponse);
  });

  it ('should return an error response if an error occurs while extracting allowed paths', async () => {
    const url = 'https://www.pnp.com';
    const expectedErrorMessage = 'An error occurred while fetching allowed paths';

    const service = new RobotsService();
    try {
      await service.readRobotsFile(url);
    } catch (error) {
      expect(error.message).toBe(expectedErrorMessage);
    }
  });
});
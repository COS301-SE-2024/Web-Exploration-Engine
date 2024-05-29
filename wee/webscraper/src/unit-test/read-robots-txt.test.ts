import { extractAllowedPaths ,extractDomain } from '../robots-app/robots';
import fetch from 'node-fetch';


//test if it can extract the domain name in the given url
describe('extractDomain', () => {

  afterEach(() => {
    jest.resetAllMocks();
});

  it('should return the domain for a valid URL with www subdomain', () => {
    const validUrl = 'https://www.example.com/path/to/resource';
    const expectedDomain = 'https://www.example.com';
    const actualDomain = extractDomain(validUrl);
    expect(actualDomain).toBe(expectedDomain);
  });

  it('should return the domain for a valid URL without www subdomain', () => {
    const validUrl = 'https://www.amazon.com/robots.txt';
    const expectedDomain = 'https://www.amazon.com';
    const actualDomain = extractDomain(validUrl);
    expect(actualDomain).toBe(expectedDomain);
  });

  it('should return the domain for a valid URL with non-standard port', () => {
    const validUrl = 'https://www.amazon.com/music/unlimited?ref_=nav_em__dm_hf_0_2_2_2';
    const expectedDomain = 'https://www.amazon.com';
    const actualDomain = extractDomain(validUrl);
    expect(actualDomain).toBe(expectedDomain);
  });

  it('should throw an error for an invalid URL', () => {
    const invalidUrl = 'invalid-url';
    const expectedError = 'Invalid URL';
    expect(() => extractDomain(invalidUrl)).toThrow(expectedError);
  });

  it('should throw an error for an invalid URL', () => {
    const invalidUrl = 'example.com/path/to/resource';
    const expectedError = 'Invalid URL';
    expect(() => extractDomain(invalidUrl)).toThrow(expectedError);
  });

});


//test if the it extracts the correct paths
describe('extractAllowedPaths', () => {
  it('should correctly parse Amazon robots.txt and return allowed paths for user agent *', async () => {
      // Define the URL to fetch the robots.txt file from
      const url = 'https://www.amazon.com';
      try {
          // Fetch the robots.txt file from the server
          const response = await fetch(url);

          if (!response.ok) {
              throw new Error('Failed to fetch robots.txt');
          }

          // Extract the text content from the response
          const robotsTxt = await response.text();

          // Call the extractAllowedPaths function with the fetched content
          const result = await extractAllowedPaths(robotsTxt);

          // Define the expected result
          const expectedPaths = [
            "/wishlist/universal*",
            "/wishlist/vendor-button*",
            "/wishlist/get-button*",
            "/gp/wishlist/universal*",
            "/gp/wishlist/vendor-button*",
            "/gp/wishlist/ipad-install*",
            "/gp/dmusic/promotions/PrimeMusic",
            "/gp/dmusic/promotions/AmazonMusicUnlimited",
            "/-/es/",
            "/-/en$",
            "/-/zh_TW/",
            "/-/zh_TW$",
            "/-/he/",
            "/-/he$",
            "/gp/offer-listing/B000",
            "/gp/offer-listing/9000",
            "/gp/aag/main?*seller=ABVFEJU8LS620"
        ];

          // Assert that the result matches the expectedPaths
          expect(result).toEqual(expectedPaths);
      } catch (error) {

        throw new Error(error);
      }
  });
});

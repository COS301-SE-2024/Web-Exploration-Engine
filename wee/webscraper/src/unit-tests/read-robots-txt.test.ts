import { extractAllowedPaths, extractDomain } from '../robots-app/robots';

// Test if it can extract the domain name in the given URL
describe('extractDomain', () => {

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

  it('should throw an error for an incomplete URL', () => {
    const invalidUrl = 'example.com/path/to/resource';
    const expectedError = 'Invalid URL';
    expect(() => extractDomain(invalidUrl)).toThrow(expectedError);
  });
});

// Test if it extracts the correct paths
describe('extractAllowedPaths', () => {
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

    const result = await extractAllowedPaths(url);
    expect(result).toEqual(expectedPaths);
  });

  it('should correctly parse ChatGPT robots.txt and return allowed paths for user agent *', async () => {
    jest.setTimeout(18000);
    const url = 'https://www.chatgpt.com';

    const expectedPaths = new Set<string>([
      '/$',
      '/api/share/og/*',
      '/auth/*',
      '/g/*',
      '/gpts$',
      '/images/*'
    ]);

    const result = await extractAllowedPaths(url);
    expect(result).toEqual(expectedPaths);
  });

  it('should correctly parse Takealot robots.txt and return allowed paths for user agent *', async () => {
    const url = 'https://www.takealot.com';

    const expectedPaths = new Set<string>(['/']);

    const result = await extractAllowedPaths(url);
    expect(result).toEqual(expectedPaths);
  });

  it('should throw an error for a site that returns no paths', async () => {
    const url = 'https://www.pnp.com';
    const expectedErrorMessage = 'An error occurred while fetching allowed paths';

    try {
      await extractAllowedPaths(url);
    } catch (error) {
      expect(error.message).toBe(expectedErrorMessage);
    }
  });
});

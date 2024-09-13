import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { middleware } from '../../src/middleware';
import { updateSession } from '../../src/app/utils/supabase/middleware';

jest.mock('../../src/app/utils/supabase/middleware', () => ({
  updateSession: jest.fn(),
}));

const mockNextRequest = (url: string) => {
    return {
        nextUrl: new URL(url),
    } as NextRequest;
};

describe('Src_Middleware', () => {
  let request: NextRequest;

  beforeEach(() => {
    request = {} as NextRequest; // Create a mock NextRequest object
  });

  afterEach(() => {
    jest.clearAllMocks(); // Clear mocks after each test
  });

  it('should call updateSession with the request object', async () => {
    await middleware(request);

    expect(updateSession).toHaveBeenCalledTimes(1);
    expect(updateSession).toHaveBeenCalledWith(request);
  });

  it('should handle static files and images correctly', async () => {
    const pathsToTest = [
      '/_next/static/some-file.js',
      '/_next/image/some-image.jpg',
      '/favicon.ico',
      '/some-image.svg',
      '/some-image.png',
      '/some-image.jpg',
      '/some-image.jpeg',
      '/some-image.gif',
      '/some-image.webp',
    ];

    for (const path of pathsToTest) {
      const request = mockNextRequest(`http://localhost${path}`);

      const response = await middleware(request);

      // Since the matcher excludes these paths, updateSession should not be called
      expect(response).toBeUndefined();
    }
  });

  it('should handle non-static paths correctly', async () => {
    const path = '/';
    const request = mockNextRequest(`http://localhost${path}`);

    await middleware(request);

    expect(updateSession).toHaveBeenCalledTimes(1);
    expect(updateSession).toHaveBeenCalledWith(request);
  });
});

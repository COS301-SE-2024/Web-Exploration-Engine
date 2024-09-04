import { createServerClient } from '@supabase/ssr';
import { updateSession } from '../../src/app/utils/supabase/middleware';
import { NextRequest, NextResponse } from 'next/server';

jest.mock('@supabase/ssr', () => ({
  createServerClient: jest.fn().mockReturnValue({
    auth: {
      getUser: jest.fn().mockResolvedValue({ data: { user: {} } }),
    },
  }),
}));

// Mock NextResponse
jest.mock('next/server', () => ({
  NextResponse: {
    status: jest.fn().mockReturnThis(),
    headers: {
      get: jest.fn(),
      set: jest.fn(),
    },
    cookies: {
      set: jest.fn(),
      getAll: jest.fn(),
      setAll: jest.fn(),
    },
    redirect: jest.fn().mockReturnThis(),
    next: jest.fn().mockReturnThis(),
  },
}));

const mockNextRequest = (url: string) => {
  return {
    nextUrl: {
      href: url,
      pathname: new URL(url).pathname,
      clone: jest.fn().mockImplementation(function () {
        return new URL(this.href); // Return a new URL object as a clone
      })
    },
    cookies: {
      getAll: jest.fn(),
      set: jest.fn(),
    },
  } as unknown as NextRequest;
};

describe("Utils_middleware", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return the supabaseResponse for an authenticated user', async () => {
    const mockGetUser = jest.fn().mockResolvedValue({
      data: {
        user: { id: '123' },
      },
    });

    (createServerClient as jest.Mock).mockReturnValue({
      auth: {
        getUser: mockGetUser,
      },
    });

    const request = mockNextRequest('http://localhost/savedreports');
    const response = await updateSession(request);

    expect(mockGetUser).toHaveBeenCalled();
    expect(NextResponse.next).toHaveBeenCalled();
    expect(NextResponse.cookies.set).not.toHaveBeenCalled();
    expect(response).toBe(NextResponse);
  });

  it("should allow access to unprotected routes without authentication", async () => {
    const mockGetUser = jest.fn().mockResolvedValue({
      data: {
        user: null,
      },
    });

    (createServerClient as jest.Mock).mockReturnValue({
      auth: {
        getUser: mockGetUser,
      },
    });

    const req = mockNextRequest("http://localhost/unprotected");
    const response = await updateSession(req);

    expect(response).toBe(NextResponse.next());
  });

  it("should redirect unauthenticated users trying to access protected routes", async () => {
    const mockGetUser = jest.fn().mockResolvedValue({
      data: {
        user: null,
      },
    });

    (createServerClient as jest.Mock).mockReturnValue({
      auth: {
        getUser: mockGetUser,
      },
    });

    const req = mockNextRequest("http://localhost/savedreports");
    const response = await updateSession(req);

    const expectedUrl = new URL('http://localhost/');
    expect(NextResponse.redirect).toHaveBeenCalled();
    expect(NextResponse.redirect).toHaveBeenCalledWith(expectedUrl);
    expect(response).toBe(NextResponse.redirect(expectedUrl));
  });

});

describe('updateSession', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should interact with cookieStore correctly', async () => {
    const mockRequest = {
      cookies: {
        getAll: jest.fn().mockReturnValue([]),
        set: jest.fn(),
      },
      nextUrl: {
        pathname: '/some-path',
      },
    } as unknown as NextRequest;

    await updateSession(mockRequest);

    const { getAll, setAll } = createServerClient.mock.calls[0][2].cookies;

    const cookies = getAll();
    expect(cookies).toEqual([]);
    expect(mockRequest.cookies.getAll).toHaveBeenCalled();

    setAll([{ name: 'test', value: 'value', options: {} }]);
    expect(mockRequest.cookies.set).toHaveBeenCalledWith('test', 'value');
    expect(NextResponse.cookies.set).toHaveBeenCalledWith('test', 'value', {});
  });

  it('should call createServerClient with the correct arguments', async () => {
    const mockUrl = 'https://your-supabase-url.supabase.co';
    const mockKey = 'your-supabase-key';
    process.env.NEXT_PUBLIC_SUPABASE_URL = mockUrl;
    process.env.NEXT_PUBLIC_SUPABASE_ANON_PUBLIC_KEY = mockKey;

    const mockRequest = {
      cookies: {
        getAll: jest.fn(),
        set: jest.fn(),
      },
      nextUrl: {
        pathname: '/some-path',
      },
    } as unknown as NextRequest;

    await updateSession(mockRequest);

    expect(createServerClient).toHaveBeenCalledWith(
      mockUrl,
      mockKey,
      {
        cookies: {
          getAll: expect.any(Function),
          setAll: expect.any(Function),
        },
      }
    );
  });
});

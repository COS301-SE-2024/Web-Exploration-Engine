import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { createServerClient } from '@supabase/ssr'
import { updateSession } from "../../src/app/utils/supabase/middleware";
import { update } from "cypress/types/lodash";

jest.mock('@supabase/ssr', () => ({
  createServerClient: jest.fn(),
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
      clone: jest.fn().mockImplementation(function() {
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

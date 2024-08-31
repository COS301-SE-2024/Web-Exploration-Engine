import { createClient } from '../../src/app/utils/supabase/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

jest.mock('@supabase/ssr', () => ({
  createServerClient: jest.fn(),
}));

jest.mock('next/headers', () => ({
  cookies: jest.fn(),
}));

describe('server utils - createClient', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call createServerClient with the correct arguments', () => {
    const mockUrl = 'https://your-supabase-url.supabase.co';
    const mockKey = 'your-supabase-key';
    process.env.NEXT_PUBLIC_SUPABASE_URL = mockUrl;
    process.env.NEXT_PUBLIC_SUPABASE_ANON_PUBLIC_KEY = mockKey;

    const mockGetAll = jest.fn().mockReturnValue([]);
    const mockSet = jest.fn();
    (cookies as jest.Mock).mockReturnValue({
      getAll: mockGetAll,
      set: mockSet,
    });

    createClient();

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

  it('should interact with cookieStore correctly', () => {
    const mockSetAll = jest.fn();
    const mockGetAll = jest.fn().mockReturnValue([]);
    (cookies as jest.Mock).mockReturnValue({
      getAll: mockGetAll,
      set: mockSetAll,
    });

    createClient();

    const { setAll } = createServerClient.mock.calls[0][2].cookies;
    setAll([{ name: 'test', value: 'value', options: {} }]);

    expect(mockSetAll).toHaveBeenCalledWith('test', 'value', {});
  });

  it('should handle errors when setting cookies', () => {
    const mockGetAll = jest.fn().mockReturnValue([]);
    const mockSetAll = jest.fn(() => { throw new Error('Test error'); });
    (cookies as jest.Mock).mockReturnValue({
      getAll: mockGetAll,
      set: mockSetAll,
    });

    createClient();

    const { setAll } = createServerClient.mock.calls[0][2].cookies;
    expect(() => setAll([{ name: 'test', value: 'value', options: {} }])).not.toThrow();
  });
});

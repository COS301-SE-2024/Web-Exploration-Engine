import { createClient } from '../../src/app/utils/supabase/client';
import { createBrowserClient } from '@supabase/ssr';

jest.mock('@supabase/ssr', () => ({
  createBrowserClient: jest.fn(),
}));

describe('createClient', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call createBrowserClient with the correct environment variables', () => {
    const mockUrl = 'https://your-supabase-url.supabase.co';
    const mockKey = 'your-supabase-key';
    process.env.NEXT_PUBLIC_SUPABASE_URL = mockUrl;
    process.env.NEXT_PUBLIC_SUPABASE_ANON_PUBLIC_KEY = mockKey;

    createClient();

    expect(createBrowserClient).toHaveBeenCalledWith(mockUrl, mockKey);
  });
});

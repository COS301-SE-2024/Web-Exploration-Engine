import { login, signUp, googleLogin } from '../../src/app/services/AuthService';
import { supabase, getSupabase } from '../../src/app/utils/supabase_anon_client';

jest.mock('../../src/app/utils/supabase_anon_client', () => {
  const mockSupabase = {
    auth: {
      signInWithPassword: jest.fn(),
      signInWithOAuth: jest.fn(),
      signUp: jest.fn(),
      getUser: jest.fn(),
    },
    from: jest.fn(() => ({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
    })),
  };

  return {
    getSupabase: jest.fn(() => mockSupabase),
    supabase: mockSupabase,
  };
});

describe('Auth functions', () => {
  describe('login', () => {
    it('should return accessToken and uuid on successful login', async () => {
      const mockResponse = {
        data: {
          session: { access_token: 'mockAccessToken' },
          user: { id: 'mockUuid', email_confirmed_at: '2021-01-01T00:00:00.000000', user_metadata: { name: 'John Doe' } },
        },
        error: null,
      };

      (supabase?.auth.signInWithPassword as jest.Mock).mockResolvedValue(mockResponse);

      const req = { email: 'test@example.com', password: 'password123' };
      const result = await login(req);

      expect(result).toEqual({
        uuid: 'mockUuid',
        emailVerified: true,
        name: 'John Doe',
      });
    });

    it('should return error code and message on login failure', async () => {
      const mockError = {
        data: null,
        error: { code: 'mockCode', message: 'mockMessage' },
      };

      (supabase?.auth.signInWithPassword as jest.Mock).mockResolvedValue(mockError);


      const req = { email: 'test@example.com', password: 'wrongpassword' };
      const result = await login(req);

      expect(result).toEqual({
        code: 'mockCode',
        message: 'mockMessage',
      });
    });
  });

  describe('signUp', () => {
    it('should return accessToken and uuid on successful signUp', async () => {
      const mockResponse = {
        data: {
          session: { access_token: 'mockAccessToken' },
          user: { id: 'mockUuid', email_confirmed_at: null},
        },
        error: null,
      };

      (supabase?.auth.signUp as jest.Mock).mockResolvedValue(mockResponse);

      const req = {
        email: 'test@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe',
      };
      const result = await signUp(req);

      expect(result).toEqual({
        uuid: 'mockUuid',
        emailVerified: false,
      });
    });

    it('should return error code and message on signUp failure', async () => {
      const mockError = {
        data: null,
        error: { code: 'mockCode', message: 'mockMessage' },
      };

      (supabase?.auth.signUp as jest.Mock).mockResolvedValue(mockError);

      const req = {
        email: 'test@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe',
      };
      const result = await signUp(req);

      expect(result).toEqual({
        code: 'mockCode',
        message: 'mockMessage',
      });
    });

    it ('should return error code and message if email is already in use', async () => {
      // Mock response for existing email check
    const mockUsersResponse = {
      data: [{ id: 'existingUserId', email: 'test@example.com' }],
      error: null,
    };

    // Mock response for Supabase signUp function
    (supabase?.from as jest.Mock).mockReturnValue({
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockResolvedValue(mockUsersResponse),
      }),
    });

    const req = {
      email: 'test@example.com',
      password: 'password123',
      firstName: 'John',
      lastName: 'Doe',
    };
    const result = await signUp(req);

    expect(result).toEqual({
      code: 'auth/email-already-in-use',
      message: 'Email already in use',
    });

    
    });
  });

  describe('googleLogin', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });
  
    it('should handle successful Google login and return user data', async () => {
      // Mock successful OAuth sign-in
      supabase?.auth.signInWithOAuth.mockResolvedValue({ error: null });
      
      // Mock user data
      supabase?.auth.getUser.mockResolvedValue({
        data: {
          user: {
            id: '123',
            email: 'test@example.com',
            user_metadata: {
              first_name: 'John',
              name: 'John Doe',
              fullname: 'John Doe'
            },
            email_confirmed_at: '2024-07-31T00:00:00Z',
          },
        },
      });
  
      const result = await googleLogin();
  
      expect(result).toEqual({
        uuid: '123',
        emailVerified: true,
        name: 'John',
      });
    });
  
    it('should handle Google login errors', async () => {
      // Mock OAuth sign-in error
      supabase?.auth.signInWithOAuth.mockResolvedValue({
        error: {
          code: 'auth/error',
          message: 'Login failed',
        },
      });
  
      const result = await googleLogin();
  
      expect(result).toEqual({
        code: 'auth/error',
        message: 'Login failed',
      });
    });
  
    it('should return an empty name if no user metadata is available', async () => {
      // Mock successful OAuth sign-in
      supabase?.auth.signInWithOAuth.mockResolvedValue({ error: null });
      
      // Mock user data without name metadata
      supabase?.auth.getUser.mockResolvedValue({
        data: {
          user: {
            id: '123',
            email: 'test@example.com',
            user_metadata: {},
            email_confirmed_at: '2024-07-31T00:00:00Z',
          },
        },
      });
  
      const result = await googleLogin();
  
      expect(result).toEqual({
        uuid: '123',
        emailVerified: true,
        name: 'test@example.com',
      });
    });
  });
  
});

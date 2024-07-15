import { login, signUp } from '../../src/app/services/AuthService';
import { supabase, getSupabase } from '../../src/app/utils/supabase_service_client';

jest.mock('../../src/app/utils/supabase_service_client', () => {
  const mockSupabase = {
    auth: {
      signInWithPassword: jest.fn(),
      signUp: jest.fn(),
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
          user: { id: 'mockUuid', email_confirmed_at: '2021-01-01T00:00:00.000000'},
        },
        error: null,
      };

      (supabase.auth.signInWithPassword as jest.Mock).mockResolvedValue(mockResponse);

      const req = { email: 'test@example.com', password: 'password123' };
      const result = await login(req);

      expect(result).toEqual({
        uuid: 'mockUuid',
        emailVerified: true,
      });
    });

    it('should return error code and message on login failure', async () => {
      const mockError = {
        data: null,
        error: { code: 'mockCode', message: 'mockMessage' },
      };

      (supabase.auth.signInWithPassword as jest.Mock).mockResolvedValue(mockError);


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

      (supabase.auth.signUp as jest.Mock).mockResolvedValue(mockResponse);

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

      (supabase.auth.signUp as jest.Mock).mockResolvedValue(mockError);

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
    (supabase.from as jest.Mock).mockReturnValue({
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
});

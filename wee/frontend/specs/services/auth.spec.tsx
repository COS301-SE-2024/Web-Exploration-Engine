import { login, signUp, forgotPassword, resetPassword } from '../../src/app/services/AuthService';
import { createClient } from '../../src/app/utils/supabase/server';

jest.mock('../../src/app/utils/supabase/server', () => ({
  createClient: jest.fn(),
}));

jest.mock('next/headers', () => ({
  cookies: jest.fn(),
}));

const mockSupabaseClient = {
  auth: {
    signInWithPassword: jest.fn(),
    signInWithOAuth: jest.fn(),
    signUp: jest.fn(),
    getUser: jest.fn(),
    resetPasswordForEmail: jest.fn(),
    updateUser: jest.fn(),
  },
  from: jest.fn(() => ({
    select: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
  })),
};

(createClient as jest.Mock).mockReturnValue(mockSupabaseClient);

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

      (mockSupabaseClient?.auth.signInWithPassword as jest.Mock).mockResolvedValue(mockResponse);

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

      (mockSupabaseClient?.auth.signInWithPassword as jest.Mock).mockResolvedValue(mockError);


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
          user: { id: 'mockUuid', email_confirmed_at: null },
        },
        error: null,
      };

      (mockSupabaseClient?.auth.signUp as jest.Mock).mockResolvedValue(mockResponse);

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

      (mockSupabaseClient?.auth.signUp as jest.Mock).mockResolvedValue(mockError);

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

    it('should return error code and message if email is already in use', async () => {
      const mockUsersResponse = {
        data: [{ id: 'existingUserId', email: 'test@example.com' }],
        error: null,
      };

      (mockSupabaseClient?.from as jest.Mock).mockReturnValue({
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

  describe('forgotPassword', () => {
    it('should return success message when email is valid', async () => {
      const mockResponse = {
        error: null,
      };

      (mockSupabaseClient.auth.resetPasswordForEmail as jest.Mock).mockResolvedValue(mockResponse);

      const result = await forgotPassword('test@example.com');

      expect(result).toEqual({
        message: 'Password reset email sent. Please check your inbox.',
      });
    });

    it('should return error code and message when email is invalid', async () => {
      const mockError = {
        code: 'mockCode',
        message: 'mockMessage',
      };

      (mockSupabaseClient.auth.resetPasswordForEmail as jest.Mock).mockResolvedValue({ error: mockError });

      const result = await forgotPassword('test@example.com');

      expect(result).toEqual({
        code: 'mockCode',
        message: 'mockMessage',
      });
    });
  });

  describe('resetPassword', () => {
    it('should return success message when password is updated successfully', async () => {
      const mockResponse = {
        data: { id: 'mockUserId' },
        error: null,
      };

      (mockSupabaseClient.auth.updateUser as jest.Mock).mockResolvedValue(mockResponse);

      const result = await resetPassword('newPassword123');

      expect(result).toEqual({
        message: 'Password reset successfully.',
        user: { id: 'mockUserId' },
      });
    });

    it('should return error code and message when password update fails', async () => {
      const mockError = {
        code: 'mockCode',
        message: 'mockMessage',
      };

      (mockSupabaseClient.auth.updateUser as jest.Mock).mockResolvedValue({ error: mockError });

      const result = await resetPassword('newPassword123');

      expect(result).toEqual({
        code: 'mockCode',
        message: 'mockMessage',
      });
    });
  });

});

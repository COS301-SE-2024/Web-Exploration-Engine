import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import ResetPassword from '../../src/app/(landing)/reset-password/page';
import { resetPassword } from '../../src/app/services/AuthService';
import { useRouter } from 'next/navigation';


jest.mock('../../src/app/services/AuthService', () => ({
  resetPassword: jest.fn(),
}));

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('../../src/app/utils/supabase_anon_client', () => ({
  getSupabase: () => ({
    auth: {
      updateUser: jest.fn().mockResolvedValue({}),
    },
  }),
}));

const mockRouter = {
  push: jest.fn(),
};

beforeEach(() => {
  (useRouter as jest.Mock).mockReturnValue(mockRouter);
});


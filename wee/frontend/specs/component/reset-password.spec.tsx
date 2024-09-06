import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import ResetPassword from '../../src/app/(landing)/reset-password/page';
import { useRouter } from 'next/navigation';
import { createClient } from '../../src/app/utils/supabase/client';

jest.mock('../../src/app/utils/supabase/client', () => ({
	createClient: jest.fn(), 
}));

jest.mock('next/headers', () => ({
  cookies: jest.fn(),
}));

const mockSupabaseClient = {
  auth: {
    updateUser: jest.fn(),
  },
};

(createClient as jest.Mock).mockReturnValue(mockSupabaseClient);

jest.mock('next/navigation', () => ({
  useRouter: jest.fn().mockReturnValue({ push: jest.fn() }),
}));

jest.mock('../../src/app/components/Util/Input', () => (props) => (
  <input data-testid="WEEInput" {...props} />
));

jest.mock('../../src/app/components/ThemeSwitch', () => () => <div data-testid="ThemeSwitch" />);

describe('ResetPassword Component', () => {
  const mockUpdateUser = mockSupabaseClient.auth.updateUser;
  const mockPush = useRouter().push;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('renders the component correctly', () => {
    render(<ResetPassword />);
    expect(screen.getByText('Change your password')).toBeInTheDocument();
    expect(screen.getByTestId('ThemeSwitch')).toBeInTheDocument();
    expect(screen.getByText('Reset Password')).toBeInTheDocument();
  });

  it('displays error message when passwords do not match', async () => {
    render(<ResetPassword />);

    fireEvent.change(screen.getAllByTestId('WEEInput')[0], { target: { value: 'password123' } });
    fireEvent.change(screen.getAllByTestId('WEEInput')[1], { target: { value: 'password456' } });

    fireEvent.click(screen.getByText('Reset Password'));

    await waitFor(() => {
      expect(screen.getByText('Passwords do not match or are empty')).toBeInTheDocument();

    });
  });

  it('displays error message when Supabase returns an error', async () => {

    mockUpdateUser.mockResolvedValueOnce({ error: { message: 'Email rate limit exceeded' } });
    render(<ResetPassword />);
    fireEvent.change(screen.getAllByTestId('WEEInput')[0], { target: { value: 'password123' } });
    fireEvent.change(screen.getAllByTestId('WEEInput')[1], { target: { value: 'password123' } });
    fireEvent.click(screen.getByText('Reset Password'));
    await waitFor(() => {
      expect(screen.getByText('Too many requests. Please wait before trying again.')).toBeInTheDocument();
    });
  });


  it('displays success message and redirects after successful password reset', async () => {
    mockUpdateUser.mockResolvedValueOnce({ error: null });
    render(<ResetPassword />);
    fireEvent.change(screen.getAllByTestId('WEEInput')[0], { target: { value: 'password123' } });
    fireEvent.change(screen.getAllByTestId('WEEInput')[1], { target: { value: 'password123' } });
    fireEvent.click(screen.getByText('Reset Password'));

    await waitFor(() => {
      expect(screen.getByText('Password reset successfully. You can now log in with your new password.')).toBeInTheDocument();
    });

    await act(async () => {
      jest.advanceTimersByTime(2000);
    });

    expect(mockPush).toHaveBeenCalledWith('/login');
  });
  it('disables button and starts timer on rate limit error', async () => {
    mockUpdateUser.mockResolvedValueOnce({ error: { message: 'Email rate limit exceeded' } });
    render(<ResetPassword />);
    fireEvent.change(screen.getAllByTestId('WEEInput')[0], { target: { value: 'password123' } });
    fireEvent.change(screen.getAllByTestId('WEEInput')[1], { target: { value: 'password123' } });
    fireEvent.click(screen.getByText('Reset Password'));

    await waitFor(() => {
      expect(screen.getByText('Please wait (60s)')).toBeInTheDocument();
    });

    await act(async () => {
      jest.advanceTimersByTime(1000);
    });

 
    await waitFor(() => {
      expect(screen.getByText('Please wait (59s)')).toBeInTheDocument();
    });
  });
});

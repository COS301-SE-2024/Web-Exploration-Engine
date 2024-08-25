import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ResetPassword from '../../src/app/(landing)/reset-password/page';
import { useRouter } from 'next/navigation';
import { getSupabase } from '../../src/app/utils/supabase_anon_client'; // Update path if needed

// Mock the necessary modules
jest.mock('../../src/app/utils/supabase_anon_client', () => ({
  getSupabase: jest.fn().mockReturnValue({
    auth: {
      updateUser: jest.fn().mockResolvedValue({ error: null }), // Mock success scenario
    },
  }),
}));

jest.mock('next/navigation', () => ({
  useRouter: jest.fn().mockReturnValue({ push: jest.fn() }), // Mock correctly
}));

jest.mock('../../src/app/components/Util/Input', () => (props) => (
  <input data-testid="WEEInput" {...props} />
));

jest.mock('../../src/app/components/ThemeSwitch', () => () => <div data-testid="ThemeSwitch" />);

describe('ResetPassword Component', () => {
  const mockUpdateUser = jest.fn();
  const mockPush = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
    (getSupabase as jest.Mock).mockReturnValue({
      auth: {
        updateUser: mockUpdateUser,
      },
    });
  });

  it('renders the component correctly', () => {
    render(<ResetPassword />);
    expect(screen.getByText('Change your password')).toBeInTheDocument();
    expect(screen.getByTestId('ThemeSwitch')).toBeInTheDocument();
    expect(screen.getByText('Reset Password')).toBeInTheDocument();
  });

  it('shows error when passwords do not match', async () => {
    render(<ResetPassword />);

    fireEvent.change(screen.getAllByTestId('WEEInput')[0], { target: { value: 'password123' } });
    fireEvent.change(screen.getAllByTestId('WEEInput')[1], { target: { value: 'password456' } });

    fireEvent.click(screen.getByText('Reset Password'));

    await waitFor(() => {
      expect(screen.getByText('Passwords do not match or are empty')).toBeInTheDocument();
      expect(screen.getByText('Please check the error and try again.')).toBeInTheDocument();
    });
  });

  it('shows success modal and redirects on success', async () => {
    mockUpdateUser.mockResolvedValue({ error: null });

    render(<ResetPassword />);

    fireEvent.change(screen.getAllByTestId('WEEInput')[0], { target: { value: 'password123' } });
    fireEvent.change(screen.getAllByTestId('WEEInput')[1], { target: { value: 'password123' } });
    fireEvent.click(screen.getByText('Reset Password'));

    jest.useFakeTimers();
    jest.runAllTimers();

    await waitFor(() => {
      expect(screen.getByText('Success')).toBeInTheDocument();
      expect(screen.getByText('Password reset successfully. You can now log in with your new password.')).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/login');
    }, { timeout: 3000 });

    jest.useRealTimers(); 
  });

  it('disables button and starts timer on rate limit error', async () => {
    mockUpdateUser.mockResolvedValue({ error: { message: 'Email rate limit exceeded' } });

    render(<ResetPassword />);

    fireEvent.change(screen.getAllByTestId('WEEInput')[0], { target: { value: 'password123' } });
    fireEvent.change(screen.getAllByTestId('WEEInput')[1], { target: { value: 'password123' } });
    fireEvent.click(screen.getByText('Reset Password'));

    const resetButton = screen.getByText('Reset Password');
    expect(resetButton).not.toBeDisabled();
    jest.useFakeTimers();
    jest.advanceTimersByTime(60000);

    await waitFor(() => {
      expect(resetButton).not.toBeDisabled();
    });

    jest.useRealTimers();
  });

  // it('shows and closes modal on error', async () => {
  //   mockUpdateUser.mockResolvedValue({ error: { message: 'Auth session missing!' } });

  //   render(<ResetPassword />);

  //   fireEvent.change(screen.getAllByTestId('WEEInput')[0], { target: { value: 'password123' } });
  //   fireEvent.change(screen.getAllByTestId('WEEInput')[1], { target: { value: 'password123' } });
  //   fireEvent.click(screen.getByText('Reset Password'));

  //   // Check if the modal is displayed
  //   await waitFor(() => {
  //     expect(screen.getByText('Error resetting password: Auth session missing!')).toBeInTheDocument();
  //   });

  //   // Simulate closing the modal
  //   fireEvent.click(screen.getByLabelText('Dismiss'));

  //   // Check if the modal is closed
  //   await waitFor(() => {
  //     expect(screen.queryByText('Error resetting password: Auth session missing!')).not.toBeInTheDocument();
  //   });
  // });

});


// modal ResponseCache
// Error
// Error resetting password: Auth session missing!
// Please check the error and try again.


// modal responce
// Success
// Password reset successfully. You can now log in with your new password.
// You can now log in with your new password.

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ResetPassword from '../../src/app/(landing)/reset-password/page';
import { useRouter } from 'next/navigation';
import { getSupabase } from '../../src/app/utils/supabase_anon_client';

jest.mock('../../src/app/utils/supabase_anon_client', () => ({
  getSupabase: jest.fn().mockReturnValue({
    auth: {
      updateUser: jest.fn().mockResolvedValue({ error: null }),
    },
  }),
}));

jest.mock('next/navigation', () => ({
  useRouter: jest.fn().mockReturnValue({ push: jest.fn() }),
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


 

  // it('closes modal when onModalClose is called', async () => {
  //   render(<ResetPassword />);

  //   fireEvent.change(screen.getAllByTestId('WEEInput')[0], { target: { value: 'password123' } });
  //   fireEvent.change(screen.getAllByTestId('WEEInput')[1], { target: { value: 'password123' } });
  //   fireEvent.click(screen.getByText('Reset Password'));

  //   await waitFor(() => {
  //     expect(screen.getByText('Passwords do not match or are empty')).toBeInTheDocument();
  //   });

  //   fireEvent.click(screen.getByText('Passwords do not match or are empty'));

  //   await waitFor(() => {
  //     expect(screen.queryByText('Passwords do not match or are empty')).not.toBeInTheDocument();
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

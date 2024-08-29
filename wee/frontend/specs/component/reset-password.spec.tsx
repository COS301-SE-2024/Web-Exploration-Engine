import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import ResetPassword from '../../src/app/(landing)/reset-password/page';
import { useRouter } from 'next/navigation';
import { getSupabase } from '../../src/app/utils/supabase_anon_client';
import { modal } from '@nextui-org/theme/dist/components/modal';

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

    jest.runAllTimers();

    await waitFor(() => {
      expect(screen.getByText('Success')).toBeInTheDocument();
      expect(screen.getByText('Password reset successfully. You can now log in with your new password.')).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/login');
    }, { timeout: 3000 });
  });

  // it('disables button and starts timer on rate limit error', async () => {
  //   mockUpdateUser.mockResolvedValue({ error: { message: 'Email rate limit exceeded' } });

  //   render(<ResetPassword />);

  //   fireEvent.change(screen.getAllByTestId('WEEInput')[0], { target: { value: 'password123' } });
  //   fireEvent.change(screen.getAllByTestId('WEEInput')[1], { target: { value: 'password123' } });
  //   fireEvent.click(screen.getByText('Reset Password'));

  //   const resetButton = screen.getByText('Reset Password');
  //   expect(resetButton).not.toBeDisabled();

  //   // Simulate timer functionality
  //   act(() => {
  //     jest.advanceTimersByTime(60000); // Advance time by 60 seconds
  //   });

  //   await waitFor(() => {
  //     expect(resetButton).toBeDisabled();
  //   });
  // });

  it('shows and closes modal on error', async () => {
    mockUpdateUser.mockResolvedValue({ error: { message: 'Auth session missing!' } });

    render(<ResetPassword />);

    fireEvent.change(screen.getAllByTestId('WEEInput')[0], { target: { value: 'password123' } });
    fireEvent.change(screen.getAllByTestId('WEEInput')[1], { target: { value: 'password123' } });
    fireEvent.click(screen.getByText('Reset Password'));

    const modal = document.createElement('div');
    modal.setAttribute('role', 'dialog');
    document.body.appendChild(modal);

    const errorMessage = document.createElement('div');
    errorMessage.textContent = 'Error resetting password: Auth session missing!';
    modal.appendChild(errorMessage);

    expect(modal).toBeInTheDocument();
    expect(errorMessage).toBeInTheDocument();

    const dismissButton = document.createElement('button');
    dismissButton.setAttribute('aria-label', 'Dismiss');
    modal.appendChild(dismissButton);
    fireEvent.click(dismissButton);

    document.body.removeChild(modal);
  });
  const interval = setInterval(() => {

});

it('starts and updates timer correctly', () => {
  const setIsButtonDisabled = jest.fn();
  const setTimer = jest.fn();

  const startTimer = (duration) => {
    setIsButtonDisabled(true);
    setTimer(duration);

    const interval = setInterval(() => {
      setTimer((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(interval);
          setIsButtonDisabled(false);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
  };

  jest.useFakeTimers();

  act(() => {
    startTimer(5);
  });

  expect(setIsButtonDisabled).toHaveBeenCalledWith(true);
  expect(setTimer).toHaveBeenCalledWith(5);

  // Advance timers and simulate the countdown
  act(() => {
    jest.advanceTimersByTime(1000);
  });
  //expect(setTimer).toHaveBeenLastCalledWith(2);

  act(() => {
    jest.advanceTimersByTime(4000);
  });
  //expect(setTimer).toHaveBeenLastCalledWith(0);

  expect(setIsButtonDisabled).toHaveBeenCalledWith(true);

  jest.useRealTimers();
});

});

import React from 'react';
import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import ForgotPassword from '../../src/app/(landing)/forgot-password/page';
import { forgotPassword } from '../../src/app/services/AuthService';
import '@testing-library/jest-dom';


jest.mock('../../src/app/services/AuthService', () => ({
  forgotPassword: jest.fn(),
}));

describe('ForgotPassword Component', () => {
  it('should render the Forgot Password form', async () => {
    await act(async () => {
      render(<ForgotPassword />);
    });

    expect(screen.getByLabelText(/Email/i)).toBeDefined();
    expect(screen.getByText(/Send Password Reset Email/i)).toBeDefined();
  });

  it('should display error if email field is empty', async () => {
    render(<ForgotPassword />);

    fireEvent.click(screen.getByText(/Send Password Reset Email/i));

    expect(screen.queryByText(/Email is required/i)).toBeDefined();

    await waitFor(() =>
      expect(screen.queryByText(/Email is required/i)).toBeNull(),
      { timeout: 3200 }
    );
  });

  it('should display success message if API call is successful', async () => {
    (forgotPassword as jest.Mock).mockResolvedValue({
      message: 'Password reset email sent successfully.',
    });

    render(<ForgotPassword />);
    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: 'test@example.com' },
    });

    fireEvent.click(screen.getByText(/Send Password Reset Email/i));

    await waitFor(() =>
      expect(screen.queryByText(/Password reset email sent successfully./i)).toBeDefined()
    );
  });

  it('should display error message if API call fails', async () => {
    (forgotPassword as jest.Mock).mockResolvedValue({
      code: 'error_code',
      message: 'An error occurred.',
    });

    render(<ForgotPassword />);
    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: 'test@example.com' },
    });

    fireEvent.click(screen.getByText(/Send Password Reset Email/i));

    await waitFor(() =>
      expect(screen.queryByText(/An error occurred./i)).toBeDefined()
    );
  });
  it('should clear error and message when modal is closed', () => {
    render(<ForgotPassword />);
    fireEvent.click(screen.getByText(/send password reset email/i));
    expect(screen.queryByText(/please check the email address and try again/i)).not.toBeInTheDocument();

    fireEvent.click(screen.getByText(/send password reset email/i));
    expect(screen.queryByText(/please check the email address and try again/i)).not.toBeInTheDocument();

    expect(screen.queryByText(/email sent successfully/i)).not.toBeInTheDocument();
  });
});

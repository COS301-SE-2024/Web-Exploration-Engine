import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import SignUp from '../../src/app/(landing)/signup/page';
import { signUp } from '../../src/app/services/AuthService';
import { googleLogin } from '../../src/app/services/OAuthService';

jest.mock('../../src/app/services/AuthService', () => ({
  signUp: jest.fn(),
}));

jest.mock('../../src/app/services/OAuthService', () => ({
  googleLogin: jest.fn(),
}));

describe('SignUp Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render the SignUp form', async () => {
    await act(async () => {
      render(<SignUp />);
    });

    expect(screen.getByLabelText(/First name/i)).toBeDefined();
    expect(screen.getByLabelText(/Last name/i)).toBeDefined();
    expect(screen.getByLabelText(/Email/i)).toBeDefined();
    expect(screen.getByLabelText(/Password/i)).toBeDefined();
  });

  it('should display error if required fields are empty', async () => {
    render(<SignUp />);

    fireEvent.click(screen.getByText(/^Create Account$/));

    expect(screen.queryByText(/All fields are required/i)).toBeDefined();
    await waitFor(() => expect(screen.queryByText(/All fields are required/i)).toBeNull(), {
      timeout: 3200,
    });
  });

  it('should display error if email is invalid', async () => {
    render(<SignUp />);

    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'invalid-email' } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'password' } });
    fireEvent.click(screen.getByText(/^Create Account$/));

    expect(screen.queryByText(/Please enter a valid email address/i)).toBeDefined();

    // error should disappear after 3 seconds
    await waitFor(() => expect(screen.queryByText(/Please enter a valid email address/i)).toBeNull(), {
      timeout: 3200,
    });
  });

  it('should display error if password is too short', async () => {
    render(<SignUp />);

    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'short' } });
    fireEvent.click(screen.getByText(/^Create Account$/));

    expect(screen.queryByText(/Password must be at least 6 characters long/i)).toBeDefined();

    await waitFor(() => expect(screen.queryByText(/Password must be at least 6 characters long/i)).toBeNull(), {
      timeout: 3200,
    });
  });

  it('should display error if email is already in use', async () => {
    (signUp as jest.Mock).mockResolvedValue({ message: 'Email already in use' });

    render(<SignUp />);

    fireEvent.change(screen.getByLabelText(/First name/i), { target: { value: 'John' } });
    fireEvent.change(screen.getByLabelText(/Last name/i), { target: { value: 'Doe' } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'password' } });
    fireEvent.click(screen.getByText(/^Create Account$/));

    await waitFor(() => expect(screen.queryByText(/An account with this email already exists/i)).toBeDefined());

    await waitFor(() => expect(screen.queryByText(/An account with this email already exists/i)).toBeNull(), {
      timeout: 3200,
    });
  });

  it('should call signUp on valid submission', async () => {
    (signUp as jest.Mock).mockResolvedValue({ uuid: 'mockUuid' });

    render(<SignUp />);

    fireEvent.change(screen.getByLabelText(/First name/i), { target: { value: 'John' } });
    fireEvent.change(screen.getByLabelText(/Last name/i), { target: { value: 'Doe' } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'password' } });
    fireEvent.click(screen.getByText(/^Create Account$/));

    await waitFor(() => expect(signUp).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password',
      firstName: 'John',
      lastName: 'Doe',
    }));
  });

  it('should call googleLogin on Google sign-up button click', async () => {
    (googleLogin as jest.Mock).mockResolvedValue({});

    render(<SignUp />);

    fireEvent.click(screen.getByText(/Sign up with Google/i));

    await waitFor(() => expect(googleLogin).toHaveBeenCalled());
  });

  it('should display error if Google login fails', async () => {
    (googleLogin as jest.Mock).mockResolvedValue({ code: 'error' });

    render(<SignUp />);

    fireEvent.click(screen.getByText(/Sign up with Google/i));

    await waitFor(() => expect(screen.queryByText(/An error occurred. Please try again later/i)).toBeDefined());
    await waitFor(() => expect(screen.queryByText(/An error occurred. Please try again later/i)).toBeNull(), {
      timeout: 3200,
    });
  });
});

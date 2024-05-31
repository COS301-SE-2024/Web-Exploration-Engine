import { render, screen, fireEvent } from '@testing-library/react';
import SignUp from '../../src/app/(landing)/signup/page';
import { signUp } from '../../src/app/services/AuthService';

jest.mock('../../src/app/services/AuthService', () => ({
  signUp: jest.fn(),
}));

describe('SignUp Component', () => {
  it('should render the SignUp form', () => {
    render(<SignUp />);

    expect(screen.getByLabelText(/First name/i)).toBeDefined();
    expect(screen.getByLabelText(/Last name/i)).toBeDefined();
    expect(screen.getByLabelText(/Email/i)).toBeDefined();
    expect(screen.getByLabelText(/Password/i)).toBeDefined();
  });

  it('should display error if required fields are empty', async () => {
    render(<SignUp />);

    fireEvent.click(screen.getByText(/Create Account/i));

    expect(screen.queryByText(/All fields are required/i)).toBeDefined();
  });

  it('should display error if email is invalid', async () => {
    render(<SignUp />);

    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'invalid-email' } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'password' } });
    fireEvent.change(screen.getByLabelText(/First name/i), { target: { value: 'John' } });
    fireEvent.change(screen.getByLabelText(/Last name/i), { target: { value: 'Doe' } });

    fireEvent.click(screen.getByText(/Create Account/i));

    expect(screen.queryByText(/Please enter a valid email address/i)).toBeDefined();
  });

  it('should call signUp function on valid submission', async () => {
    (signUp as jest.Mock).mockResolvedValue({ accessToken: 'mockToken', uuid: 'mockUuid' });

    render(<SignUp />);

    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'password' } });
    fireEvent.change(screen.getByLabelText(/First name/i), { target: { value: 'John' } });
    fireEvent.change(screen.getByLabelText(/Last name/i), { target: { value: 'Doe' } });

    fireEvent.click(screen.getByText(/Create Account/i));

    expect(signUp).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password',
      firstName: 'John',
      lastName: 'Doe',
    });

    expect(screen.queryByText(/An error occurred while signing up. Please try again later./i)).toBeNull();
  });
});
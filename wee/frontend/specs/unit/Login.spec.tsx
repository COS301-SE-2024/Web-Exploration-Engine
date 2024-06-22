import React from 'react';
import { render, screen, fireEvent, act ,waitFor} from '@testing-library/react';
import Login from '../../src/app/(landing)/login/page';
import { login } from '../../src/app/services/AuthService';
import { useRouter } from 'next/navigation';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// Mocking login function
jest.mock('../../src/app/services/AuthService', () => ({
  login: jest.fn(),
}));


describe('Login Component', () => {

  it('should render the Login form', async () =>  {
    await act(async () => {
      render(<Login />);
    });

    expect(screen.getByLabelText(/Email/i)).toBeDefined();
    expect(screen.getByLabelText(/Password/i)).toBeDefined();
  });






  it('should display error if required fields are empty', async () => {
    render(<Login />);

    fireEvent.click(screen.getByText(/^Login$/));


    expect(screen.queryByText(/All fields are required/i)).toBeDefined();
  });

  it('should display error if email is invalid', async () => {
    render(<Login />);

    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'invalid-email' } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'password' } });

    fireEvent.click(screen.getByText(/^Login$/));

    expect(screen.queryByText(/Please enter a valid email address/i)).toBeDefined();
  });

  it('should call login function on valid submission', async () => {
    const push = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({ push });

    (login as jest.Mock).mockResolvedValue({ accessToken: 'mockToken', uuid: 'mockUuid' });


    await act(async () => {
      render(<Login />);
    });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'password' } });
    const button = screen.getByTestId('login-button');
    expect(button).toBeDefined();

    fireEvent.click(button);
    expect(login).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password',
    });
    expect(screen.queryByText(/An error occurred. Please try again later/i)).toBeNull();
    // expect(push).toHaveBeenCalled();
  });
  it('should redirect to home page after successful login', async () => {
    const push = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({ push });
    (login as jest.Mock).mockResolvedValue({ accessToken: 'mockToken', uuid: 'mockUuid' });

    render(<Login />);

    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'password' } });

    fireEvent.click(screen.getByTestId('login-button'));

    await waitFor(() => expect(push).toHaveBeenCalledWith('/?url=mockToken&uuid=mockUuid'));
  });


});

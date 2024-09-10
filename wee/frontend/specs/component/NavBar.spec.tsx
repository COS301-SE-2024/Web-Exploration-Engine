import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import NavBar from '../../src/app/components/NavBar';
import { useUserContext } from '../../src/app/context/UserContext';
import { useRouter } from 'next/navigation';
import { getSupabase } from '../../src/app/utils/supabase_service_client';
import '@testing-library/jest-dom';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('../../src/app/context/UserContext', () => ({
  useUserContext: jest.fn(),
}));

jest.mock('../../src/app/utils/supabase_service_client', () => ({
  getSupabase: jest.fn(),
}));

describe('NavBar Component', () => {
  const mockPush = jest.fn();
  const mockSetUser = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
    (useUserContext as jest.Mock).mockReturnValue({
      user: null,
      setUser: mockSetUser,
    });
    (getSupabase as jest.Mock).mockReturnValue({
      auth: {
        signOut: jest.fn(),
      },
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render the NavBar component', () => {
    render(<NavBar />);
    expect(screen.getByTestId('navTitle')).toBeInTheDocument();
  });

  it('should navigate to home when Home link is clicked', () => {
    render(<NavBar />);
    fireEvent.click(screen.getByText('Home'));
    expect(mockPush).toHaveBeenCalledWith('/');
  });

  it('should navigate to help when Help link is clicked', () => {
    render(<NavBar />);
    fireEvent.click(screen.getByText('Help'));
    expect(mockPush).toHaveBeenCalledWith('/help');
  });

  it('should navigate to login when Login button is clicked', () => {
    render(<NavBar />);
    fireEvent.click(screen.getByText('Login'));
    expect(mockPush).toHaveBeenCalledWith('/login');
  });

  it('should navigate to signup when Sign Up button is clicked', () => {
    render(<NavBar />);
    fireEvent.click(screen.getByText('Sign Up'));
    expect(mockPush).toHaveBeenCalledWith('/signup');
  });

  it('should display user name when user is logged in', () => {
    (useUserContext as jest.Mock).mockReturnValue({
      user: { name: 'John Doe' },
      setUser: mockSetUser,
    });
    render(<NavBar />);
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });

  it('should display Log Out button when user is logged in', () => {
    (useUserContext as jest.Mock).mockReturnValue({
      user: { name: 'John Doe' },
      setUser: mockSetUser,
    });
    render(<NavBar />);
    expect(screen.getByText('Log Out')).toBeInTheDocument();
  });

  it('logs out the user and redirects to home', async () => {
    (useUserContext as jest.Mock).mockReturnValue({
      user: { name: 'John Doe' },
      setUser: mockSetUser,
    });
    render(<NavBar />);

    // Find the "Log Out" button and click it
    const logOutButton = screen.getByText(/Log Out/i);
    fireEvent.click(logOutButton);

    // Verify that the sign out function was called
    await waitFor(() => {
      expect(getSupabase().auth.signOut).toHaveBeenCalled();
    });

    // Verify that the user state is set to null
    expect(mockSetUser).toHaveBeenCalledWith(null);

    // Verify that the user is redirected to the home page
    expect(mockPush).toHaveBeenCalledWith('/');
  });

  it('should display Saved Reports link as disabled when user is not logged in', () => {
    render(<NavBar />);
    expect(screen.getByText('Saved Reports')).toHaveClass('cursor-not-allowed');
  });

  it('should navigate to saved reports when Saved Reports link is clicked and user is logged in', () => {
    (useUserContext as jest.Mock).mockReturnValue({
      user: { name: 'John Doe' },
      setUser: mockSetUser,
    });
    render(<NavBar />);
    fireEvent.click(screen.getByText('Saved Reports'));
    expect(mockPush).toHaveBeenCalledWith('/savedreports');
  });
});
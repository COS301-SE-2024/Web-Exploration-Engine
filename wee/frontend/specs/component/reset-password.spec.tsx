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

describe('ResetPassword Component', () => {
  it('renders reset password form', () => {
    render(<ResetPassword />);
    const newPasswordFields = screen.getAllByLabelText(/New Password/i);
    expect(newPasswordFields.length).toBeGreaterThanOrEqual(1);
    expect(newPasswordFields[0]).toHaveAttribute('type', 'password');
    const confirmPasswordFields = screen.getAllByLabelText(/Confirm New Password/i);
    expect(confirmPasswordFields.length).toBeGreaterThanOrEqual(1);
    expect(confirmPasswordFields[0]).toHaveAttribute('type', 'password');
    expect(screen.getByText(/Reset Password/i)).toBeInTheDocument();
  });
  it('handles successful password reset', async () => {
    render(<ResetPassword />);
    const [newPasswordInput] = screen.getAllByLabelText(/New Password/i);
    const [confirmPasswordInput] = screen.getAllByLabelText(/Confirm New Password/i);

    fireEvent.change(newPasswordInput, { target: { value: 'NewPassword123!' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'NewPassword123!' } });

    fireEvent.click(screen.getByRole('button', { name: /Reset Password/i }));
    await act(async () => {
      await waitFor(() => {
        expect(screen.getByText(/You can now log in with your new password./i)).toBeInTheDocument();
      });
    });
  });
});


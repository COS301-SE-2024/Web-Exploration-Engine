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


});

'use client';
import React, { useState } from 'react';
import {
  Button,
  Input,
  Spacer,
  Modal,
  ModalContent,
  ModalBody,
  Divider,
} from '@nextui-org/react';
import { forgotPassword } from '../../services/AuthService';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    // Call API
    const response = await forgotPassword(email);

    if ('code' in response) {
      setError(response.message);
      setIsOpen(true);
    } else {
      setMessage(response.message);
      setIsOpen(true);
    }
  };

  const onOpenChange = (isOpen: boolean) => {
    setIsOpen(isOpen);
    if (!isOpen) {
      setError('');
      setMessage('');
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center">
      <h1 className="text-2xl font-bold mb-4">Forgot Your Password?</h1>
      <form
        onSubmit={handleForgotPassword}
        data-testid="forgot-password-form"
        className="w-full max-w-md"
      >
        <Input
          type="email"
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mb-4"
          required
        />
        <Button type="submit" className="w-full bg-jungleGreen-700">
          Send Password Reset Email
        </Button>
        <Spacer y={2} />
      </form>

      {/* Success/Failure Modal */}
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        isDismissable={true}
        isKeyboardDismissDisabled={true}
        className="font-poppins-regular"
      >
        <ModalContent>
          <ModalBody>
            <h1 className="text-center my-4 font-poppins-bold text-2xl text-jungleGreen-800 dark:text-dark-primaryTextColor">
              {error ? 'Error' : 'Success'}
            </h1>

            <h3 className="text-center font-poppins-semibold text-lg text-jungleGreen-700 dark:text-jungleGreen-100">
              {error || message}
            </h3>

            <div className="flex justify-center">
              <Divider className="w-[5rem]" />
            </div>

            <p className="text-center text-xs text-jungleGreen-700 dark:text-jungleGreen-100 my-5">
              {error
                ? 'Please check the email address and try again.'
                : 'If you did not receive the email, please check your spam folder or try again later.'}
            </p>
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
}

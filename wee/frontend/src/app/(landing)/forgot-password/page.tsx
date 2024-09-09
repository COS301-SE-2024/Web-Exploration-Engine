'use client';
import React, { useState } from 'react';
import ThemeSwitch from '../../components/ThemeSwitch';
import {
  Button,
  Spacer,
  Modal,
  ModalContent,
  ModalBody,
  Divider,
} from '@nextui-org/react';
import { forgotPassword } from '../../services/AuthService'
import Link from 'next/link';;
import WEEInput from '../../components/Util/Input';

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
    <>    
      <div className="min-h-[calc(100vh-13rem)] w-full flex flex-col justify-between sm:min-h-[calc(100vh-18rem)] md:min-h-full font-poppins-regular">        
        <div >
          <ThemeSwitch />

          <h1 className="text-center mt-4 font-poppins-bold text-2xl text-jungleGreen-800 dark:text-dark-primaryTextColor">
            Forgot Password?
          </h1>

          <h3 className="text-center font-poppins-semibold text-lg text-jungleGreen-700 dark:text-jungleGreen-100">
            Enter your email and we will send you a link to reset your password.
          </h3>
        </div>

        <form
          onSubmit={handleForgotPassword}
          data-testid="forgot-password-form"
          className="flex flex-col justify-center items-center"
        >
          <WEEInput
            type="email"
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="my-3 sm:w-4/5 md:w-full lg:w-4/5"
            required
          />
          <Button 
            type="submit" 
            className="my-3 font-poppins-semibold text-lg bg-jungleGreen-700 text-dark-primaryTextColor dark:bg-jungleGreen-400 dark:text-primaryTextColor w-full sm:w-4/5 md:w-full lg:w-4/5"
          >
            Send Password Reset Email
          </Button>
          <Spacer y={2} />
        </form>

        <div className="text-center font-poppins-regular text-jungleGreen-800 dark:text-dark-primaryTextColor">
          <span>Back to</span>
          <span className="font-poppins-medium underline underline-offset-4 decoration-2 ml-2 hover:cursor-pointer dark:text-jungleGreen-150">
              <Link href={'/login'}>Log in</Link>
          </span>
        </div>

      </div>

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
    </>
  );
}

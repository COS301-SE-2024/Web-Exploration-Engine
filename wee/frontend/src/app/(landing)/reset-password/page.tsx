'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input, Button, Spacer, Modal, ModalContent, ModalBody, Divider } from '@nextui-org/react';
import { getSupabase } from '../../utils/supabase_anon_client';

const supabase = getSupabase();

export default function ResetPassword() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [timer, setTimer] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Function to start the timer
  const startTimer = (duration: number) => {
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

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!password || password !== confirmPassword) {
      setError('Passwords do not match or are empty');
      setIsModalOpen(true);
      return;
    }

    // Call Supabase to update password
    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      if (error.message === 'Email rate limit exceeded') {
        setError('Too many requests. Please wait before trying again.');
        startTimer(60); // Start a 60-second timer
      } else {
        setError(`Error resetting password: ${error.message}`);
      }
      setIsModalOpen(true);
    } else {
      setSuccess('Password reset successfully. You can now log in with your new password.');
      setIsModalOpen(true);
      setTimeout(() => router.push('/login'), 2000); // Redirect after a short delay
    }
  };

  const onModalClose = () => {
    setIsModalOpen(false);
    setError('');
    setSuccess('');
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center">
      <h1 className="text-2xl font-bold mb-4">Reset Your Password</h1>
      <form onSubmit={handleResetPassword} className="w-full max-w-md">
        <Input
          type="password"
          label="New Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mb-4"
          required
        />
        <Input
          type="password"
          label="Confirm New Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="mb-4"
          required
        />
        <Button
          type="submit"
          className="w-full bg-jungleGreen-700"
          disabled={isButtonDisabled}
        >
          {isButtonDisabled ? `Please wait (${timer}s)` : 'Reset Password'}
        </Button>
        <Spacer y={2} />
      </form>

      {/* Success/Failure Modal */}
      <Modal
        isOpen={isModalOpen}
        onOpenChange={onModalClose}
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
              {error || success}
            </h3>

            <div className="flex justify-center">
              <Divider className="w-[5rem]" />
            </div>

            <p className="text-center text-xs text-jungleGreen-700 dark:text-jungleGreen-100 my-5">
              {error
                ? 'Please check the error and try again.'
                : 'You can now log in with your new password.'}
            </p>
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
}

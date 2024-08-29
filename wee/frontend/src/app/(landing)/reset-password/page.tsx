'use client';
import React, { useState } from 'react';
import { Button, Spacer } from '@nextui-org/react';
import { getSupabase } from '../../utils/supabase_anon_client';
import Link from 'next/link';
import WEEInput from '../../components/Util/Input';
import ThemeSwitch from '../../components/ThemeSwitch';
import { useRouter } from 'next/navigation';
import { MdErrorOutline } from "react-icons/md"
const supabase = getSupabase();

export default function ResetPassword() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [timer, setTimer] = useState(0);

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
    } else {
      setSuccess('Password reset successfully. You can now log in with your new password.');
      setTimeout(() => router.push('/login'), 2000); // Redirect after a short delay
    }
  };

  return (
    <div className='min-h-[calc(100vh-13rem)] w-full flex flex-col justify-between sm:min-h-[calc(100vh-18rem)] md:min-h-full font-poppins-regular'>
      <div>
        <ThemeSwitch />

        <h1 className="text-center mt-4 font-poppins-bold text-2xl text-jungleGreen-800 dark:text-dark-primaryTextColor">
          Change your password
        </h1>

        <h3 className="text-center font-poppins-semibold text-lg text-jungleGreen-700 dark:text-jungleGreen-100">
          Enter a new password below to change your password
        </h3>
      </div>

      <form
        onSubmit={handleResetPassword}
        className="flex flex-col justify-center items-center"
      >
        {error && (
          <span className="mt-4 p-2 text-white bg-red-600 rounded-lg transition-opacity duration-300 ease-in-out flex justify-center items-center">
            <MdErrorOutline className="m-auto mx-1" />
            <p>{error}</p>
          </span>
        )}
        {success && (
          <span className="mt-4 p-2 text-white bg-green-600 rounded-lg transition-opacity duration-300 ease-in-out flex justify-center items-center">
            <p>{success}</p>
          </span>
        )}
        <WEEInput
          type="password"
          label="New Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="my-3 sm:w-4/5 md:w-full lg:w-4/5"
          required
        />
        <WEEInput
          type="password"
          label="Confirm New Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="my-3 sm:w-4/5 md:w-full lg:w-4/5"
          required
        />
        <Button
          type="submit"
          className="my-3 font-poppins-semibold text-lg bg-jungleGreen-700 text-dark-primaryTextColor dark:bg-jungleGreen-400 dark:text-primaryTextColor w-full sm:w-4/5 md:w-full lg:w-4/5"
          disabled={isButtonDisabled}
        >
          {isButtonDisabled ? `Please wait (${timer}s)` : 'Reset Password'}
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
  );
}

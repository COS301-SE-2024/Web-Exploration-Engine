'use client'
import React from "react";
import ThemeSwitch from "../../components/ThemeSwitch";
import Link from 'next/link';
import { Modal, ModalContent, ModalBody, Button, useDisclosure, Divider } from "@nextui-org/react";
import { useState } from "react";
import { SignUpRequest } from "../../models/AuthModels";
import { signUp } from "../../services/AuthService";
import { MdErrorOutline } from "react-icons/md"
import WEEInput from '../../components/Util/Input';
import { googleLogin } from '../../services/OAuthService';

export default function SignUp() {
    const { isOpen, onOpenChange } = useDisclosure();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [error, setError] = useState('');

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // Basic validation
        if (!firstName || !lastName || !email || !password) {
            setError('All fields are required');
            const timer = setTimeout(() => {
                setError('');
            }, 3000);

            return () => clearTimeout(timer);
        }

        // Email validation with regex
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError('Please enter a valid email address');
            const timer = setTimeout(() => {
                setError('');
            }, 3000);

            return () => clearTimeout(timer);
        }

        // Password validation
        if (password.length < 6) {
            setError('Password must be at least 6 characters long');
            const timer = setTimeout(() => {
                setError('');
            }, 3000);

            return () => clearTimeout(timer);
        }

        // Create request object
        const request: SignUpRequest = {
            email,
            password,
            firstName,
            lastName
        };

        // Call API
        const response = await signUp(request);

        // Error if user already exists
        // Check is this the correct message
        if ('message' in response && response.message === 'Email already in use') {
            setError('An account with this email already exists.');
            const timer = setTimeout(() => {
                setError('');
            }, 3000);

            return () => clearTimeout(timer);
        }

        if ('code' in response) {
            setError('An error occurred while signing up. Please try again later.');
            const timer = setTimeout(() => {
                setError('');
            }, 3000);

            return () => clearTimeout(timer);
        }

        if ('uuid' in response) {
            onOpenChange();
        }

    };

    const handleGoogleSignUp = async () => {
        const response = await googleLogin();
        if ('code' in response) {
            setError('An error occurred. Please try again later');
            const timer = setTimeout(() => {
                setError('');
            }, 3000);

            return () => clearTimeout(timer);
        }
    }


    return (
        <>
            <div className="min-h-[calc(100vh-13rem)] w-full flex flex-col justify-between sm:min-h-[calc(100vh-15rem)] md:min-h-full font-poppins-regular">
                <div >
                    <ThemeSwitch />

                    <h1 className="text-center font-poppins-bold text-2xl text-jungleGreen-800 dark:text-dark-primaryTextColor">
                        Become a Member!
                    </h1>
                    <h3 className="hidden sm:block text-center font-poppins-semibold text-lg text-jungleGreen-700 dark:text-jungleGreen-100">
                        Sign up to unlock all the benefits and features we offer.
                    </h3>
                </div>
                <form onSubmit={handleSignUp} className="flex flex-col justify-center items-center">
                    {error ? <span className="mt-4 p-2 text-white bg-red-600 rounded-lg transition-opacity duration-300 ease-in-out flex justify-center align-middle"><MdErrorOutline className="m-auto mx-1" /><p>{error}</p></span> : <p className="hidden"></p>}
                    <WEEInput
                        type="text"
                        label="First name"
                        className="mb-3 mt-2 sm:my-3 w-full sm:w-4/5 md:w-full lg:w-4/5"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                    />
                    <WEEInput
                        type="text"
                        label="Last name"
                        className="my-3 sm:w-4/5 md:w-full lg:w-4/5"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                    />
                    <WEEInput
                        type="email"
                        label="Email"
                        className="my-3 sm:w-4/5 md:w-full lg:w-4/5"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <WEEInput
                        type="password"
                        label="Password"
                        className="my-3 mb-6 sm:w-4/5 md:w-full lg:w-4/5"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <Button type="submit" className="mb-0 md:mb-3 font-poppins-semibold text-lg bg-jungleGreen-700 text-dark-primaryTextColor dark:bg-jungleGreen-400 dark:text-primaryTextColor w-full sm:w-4/5 md:w-full lg:w-4/5">
                        Create Account
                    </Button>
                    <Divider className='hidden md:block my-4' />
                    <Button
                        className='my-3 font-poppins-semibold text-lg w-full sm:w-4/5 md:w-full lg:w-4/5 border-primaryTextColor dark:border-dark-primaryTextColor'
                        variant="bordered"
                          onClick={handleGoogleSignUp}
                        startContent={
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 533.5 544.3"
                                width="24"
                                height="24"
                            >
                                <path
                                    fill="#4285F4"
                                    d="M533.5 278.6c0-18.8-1.5-37-4.4-54.7H272.1v103.8h144.1c-6.1 33.8-25.4 62.6-53.7 81.8v68h86.9c51.1-47.3 80.3-116.9 80.3-199.9z"
                                />
                                <path
                                    fill="#34A853"
                                    d="M272.1 544.3c73 0 134.2-24.1 178.6-65.7l-86.9-68c-24.2 16.4-55.4 26-91.7 26-70 0-129.4-47.3-150.8-111.1H29.7v68c45.5 89.8 137 151.8 242.4 151.8z"
                                />
                                <path
                                    fill="#FBBC05"
                                    d="M121.3 324.7c-11.3-33.8-11.3-69.9 0-103.8V152H29.7c-24.5 44.3-38.5 95.5-38.5 148.7s14 104.4 38.5 148.7l91.6-68.7z"
                                />
                                <path
                                    fill="#EA4335"
                                    d="M272.1 106.2c39.3-2.7 76 13.8 103.8 41.7l77-77C406.3 12.3 342.1-5.1 272.1 0 167.9 0 75.3 62.1 29.7 152l91.6 68.7c21.4-63.8 81-111.1 150.8-114.5z"
                                />
                            </svg>
                        }>
                        Sign up with Google
                    </Button>
                </form>
                <div className="text-center font-poppins-regular text-jungleGreen-800 dark:text-dark-primaryTextColor">
                    <span>Already have an account?</span>
                    <span className="font-poppins-medium underline underline-offset-4 decoration-2 ml-2 hover:cursor-pointer dark:text-jungleGreen-150">
                        <Link href={'/login'}>Log in</Link>
                    </span>
                </div>
            </div>

            {/* Verify email popup */}
            <Modal isOpen={isOpen} onOpenChange={onOpenChange} isDismissable={false} isKeyboardDismissDisabled={true} className="font-poppins-regular">
                <ModalContent>
                    <ModalBody>
                        <h1 className="text-center my-4 font-poppins-bold text-2xl text-jungleGreen-800 dark:text-dark-primaryTextColor">
                            Verify your email address
                        </h1>

                        <h3 className="text-center font-poppins-semibold text-lg text-jungleGreen-700 dark:text-jungleGreen-100">
                            In order to start using your Web Exploration Engine account, you need to confirm your email address
                        </h3>

                        <div className="flex justify-center">

                            <Divider className="w-[5rem]" />
                        </div>

                        <p className="text-center text-xs text-jungleGreen-700 dark:text-jungleGreen-100 my-5">
                            If you did not sign up for this account you can ignore this email and the account will be deleted
                        </p>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    )
}
'use client'
import React from "react";
import ThemeSwitch from "../../components/ThemeSwitch";
import Link from 'next/link';
import {Modal, ModalContent, ModalBody, Button, useDisclosure, Input, Divider} from "@nextui-org/react";
import { useState } from "react";
import { SignUpRequest } from "../../models/AuthModels";
import { signUp } from "../../services/AuthService";
import { MdErrorOutline } from "react-icons/md"


export default function SignUp() {
    const {isOpen, onOpenChange} = useDisclosure();

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

    
    return (
        <>
            <div className="min-h-[calc(100vh-13rem)] w-full flex flex-col justify-between sm:min-h-[calc(100vh-18rem)] md:min-h-full font-poppins-regular">
                <div >
                    <ThemeSwitch />

                    <h1 className="text-center mt-4 font-poppins-bold text-2xl text-jungleGreen-800 dark:text-dark-primaryTextColor">
                        Become a Member!
                    </h1>
                    <h3 className="text-center font-poppins-semibold text-lg text-jungleGreen-700 dark:text-jungleGreen-100">
                        Sign up to unlock all the benefits and features we offer.
                    </h3>
                </div>
                <form onSubmit={handleSignUp} className="flex flex-col justify-center items-center">
                    {error ? <span className="mt-4 p-2 text-white bg-red-600 rounded-lg transition-opacity duration-300 ease-in-out flex justify-center align-middle"><MdErrorOutline className="m-auto mx-1"/><p>{error}</p></span> : <p className="mt-4 p-2 min-h-[2.5rem]"></p>}
                    <Input type="text" label="First name" className="my-3 w-full sm:w-4/5 md:w-full lg:w-4/5"
                        value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                    <Input type="text" label="Last name" className="my-3 sm:w-4/5 md:w-full lg:w-4/5"
                        value={lastName} onChange={(e) => setLastName(e.target.value)} />
                    <Input type="email" label="Email" className="my-3 sm:w-4/5 md:w-full lg:w-4/5"
                        value={email} onChange={(e) => setEmail(e.target.value)} />
                    <Input type="password" label="Password" className="my-3 sm:w-4/5 md:w-full lg:w-4/5"
                        value={password} onChange={(e) => setPassword(e.target.value)} />
                    <Button type="submit" className="font-poppins-semibold text-lg bg-jungleGreen-700 text-dark-primaryTextColor dark:bg-jungleGreen-400 dark:text-primaryTextColor w-full sm:w-4/5 md:w-full lg:w-4/5">
                        Create Account
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

                            <Divider className="w-[5rem]"/>
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
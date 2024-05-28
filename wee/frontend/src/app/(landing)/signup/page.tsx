'use client'
import React from "react";
import ThemeSwitch from "../../components/ThemeSwitch";
import { Button } from '@nextui-org/react';
import {Input} from "@nextui-org/react";
import Link from 'next/link';

export default function SignUp() {
    return (
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
            <div className="flex flex-col justify-center items-center">
                <Input type="text" label="First name" className="my-3 w-full sm:w-4/5 md:w-full"/>
                <Input type="text" label="Last name" className="my-3 sm:w-4/5 md:w-full"/>
                <Input type="email" label="Email" className="my-3 sm:w-4/5 md:w-full"/>
                <Input type="password" label="Password" className="my-3 sm:w-4/5 md:w-full"/>              
            </div>

            <div className="flex flex-col justify-center items-center">
                <Button className="font-poppins-semibold text-lg bg-jungleGreen-700 text-dark-primaryTextColor dark:bg-jungleGreen-400 dark:text-primaryTextColor w-full sm:w-4/5 md:w-full">
                    Create Account
                </Button>
            </div>
    
            <div className="text-center font-poppins-regular text-jungleGreen-800 dark:text-dark-primaryTextColor">
                <span>Already have an account?</span>
                <span className="font-poppins-medium underline underline-offset-4 decoration-2 ml-2 hover:cursor-pointer dark:text-jungleGreen-150">
                    <Link href={'/login'}>Sign in</Link>
                </span>
            </div>
        </div>
    )
}
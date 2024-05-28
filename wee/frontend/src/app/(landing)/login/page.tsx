'use client'
import React from "react";
import ThemeSwitch from "../../components/ThemeSwitch";
import Link from 'next/link'

export default function Login() {
    return (

            <div className="min-h-[calc(100vh-13rem)] w-full flex flex-col justify-between sm:min-h-[calc(100vh-18rem)] md:min-h-full">
                <div className="">
                    <ThemeSwitch/>
                    <h1 className="text-center mt-4 font-poppins-bold text-2xl text-jungleGreen-800 dark:text-dark-primaryTextColor">Ready to Dive Back In?</h1>
                    <h3 className="text-center font-poppins-semibold text-lg text-jungleGreen-700 dark:text-jungleGreen-100">Log in to your account and let's get started!</h3>

                    <p>Input</p>
                    <p>Input</p>
                    <p>Button</p>
                </div>
                

                <div className="text-center font-poppins-regular text-jungleGreen-800 dark:text-dark-primaryTextColor">
                    <span>
                        Don't have an account?
                    </span> 
                    <span className="font-poppins-medium underline underline-offset-4 decoration-2 ml-2 hover:cursor-pointer dark:text-jungleGreen-150">
                        <Link href={"/signup"}>
                            Sign up
                        </Link>
                    </span>
                </div>

            </div>
        
    )
}
{/* <svg
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
</svg> */}
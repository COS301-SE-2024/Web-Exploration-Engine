'use client'
import React from "react";
import ThemeSwitch from "../../components/ThemeSwitch";

export default function SignUp() {
    return (

            <div className="min-h-[calc(100vh-13rem)] w-full sm:min-h-[calc(100vh-18rem)] md:min-h-full">
                <div className="">
                    <ThemeSwitch/>
                    <h1 className="text-center mt-4 font-poppins-bold text-2xl text-jungleGreen-800 dark:text-dark-primaryTextColor">Become a Member!</h1>
                    <h3 className="text-center font-poppins-semibold text-lg text-jungleGreen-700 dark:text-jungleGreen-100">Sign up to unlock all the benefits and features we offer.</h3>

                    <p>Input</p>
                    <p>Input</p>
                    <p>Button</p>
                </div>
                

            </div>
        
    )
}
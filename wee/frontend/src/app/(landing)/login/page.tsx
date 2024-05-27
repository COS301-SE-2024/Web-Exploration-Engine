'use client'
import React from "react";
import ThemeSwitch from "../../components/ThemeSwitch";
import { FlipWords } from "../../components/FlipWords";

export default function Login() {
    return (
        <div className='h-screen'>
            
            <ThemeSwitch/>
            <div className="w-full">
                <h1 className="text-center m-4 font-poppins-bold text-2xl text-jungleGreen-800">Welcome back!</h1>
                {/* <Input type="email" label="Email" className="mb-3"/> */}
                {/* <Input type="password" label="Password" className="mt-3"/> */}
                {/* <Button className="w-full mt-3">
                    Sign in
                </Button> */}
                <p>Input</p>
                <p>Input</p>
            </div>

        </div>
    )
}
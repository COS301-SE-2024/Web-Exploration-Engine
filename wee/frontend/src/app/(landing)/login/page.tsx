'use client'
import React from "react";
import ThemeSwitch from "../../components/ThemeSwitch";

export default function Login() {
    return (
        <div className='h-screen'>
            login!!!!!
            <ThemeSwitch/>
            <div className="bg-jungleGreen-200 dark:bg-jungleGreen-800">
                Test light darkmode
            </div>
        </div>
    )
}
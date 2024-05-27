'use client'
import React from "react";
import ThemeSwitch from "../../components/ThemeSwitch";

export default function Home() {
    return (
        <div className='h-screen'>
            homeee!!!!!
            <ThemeSwitch/>
            <div className="bg-jungleGreen-200 dark:bg-jungleGreen-800">
                Test light darkmode
            </div>
        </div>
    )
}
'use client'
import React from "react";
import {Input} from "@nextui-org/react";
import { FiSearch } from "react-icons/fi";
import { Button } from '@nextui-org/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
    const router = useRouter();
    const [url, setUrl] = useState('');

  const handleScraping = () => {
    // Navigate to Results page with the entered URL as query parameter
    router.push(`/results?url=${encodeURIComponent(url)}`);
  };


    return (
        <div className='h-screen p-4 flex flex-col items-center'>
            <div className="mb-8 text-center">
                <h1 className="mt-4 font-poppins-bold text-2xl text-jungleGreen-800 dark:text-dark-primaryTextColor">
                    Ready to start scraping?
                </h1>
                <h3 className="font-poppins-semibold text-lg text-jungleGreen-700 dark:text-jungleGreen-100">
                    Start by entering the URL of the website you wish to scrape
                </h3>
            </div>
            <div className="flex flex-col sm:flex-row w-full justify-center items-center">
                <Input
                    type="text"
                    placeholder="https://www.takealot.com/"
                    labelPlacement="outside"
                    className="py-3 sm:pr-3 w-full md:w-4/5"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    startContent={
                        <FiSearch className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                    }
                    />
                <Button className="w-full sm:w-auto mt-4 sm:mt-0 sm:ml-4 font-poppins-semibold text-lg bg-jungleGreen-700 text-dark-primaryTextColor dark:bg-jungleGreen-400 dark:text-primaryTextColor"
                    onClick={handleScraping}
                >
                    Start scraping
                </Button>
            </div>
        </div>
    )
}
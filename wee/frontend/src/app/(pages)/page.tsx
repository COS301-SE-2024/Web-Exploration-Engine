'use client'
import React, { useState } from "react";
import { Button, Checkbox } from '@nextui-org/react';
import { useRouter } from 'next/navigation';
import { MdErrorOutline } from "react-icons/md";
import {Textarea} from "@nextui-org/input";

export default function Home() {
    const router = useRouter();
    const [url, setUrl] = useState('');
    const [error, setError] = useState('');
   
    const isValidUrl = (urlString: string) => {
        try {
            new URL(urlString);
            return true;
        } catch (_) {
            return false;
        }
    };

    const handleScraping = () => {
        if (!url) {
            setError('URL cannot be empty');

            const timer = setTimeout(() => {
                setError('');
            }, 3000);

            return () => clearTimeout(timer);
        }

        const urls = url.split(',').map(u => u.trim());
        for (const singleUrl of urls) {

            if (!isValidUrl(singleUrl)) {
                setError('Please enter valid URLs');
    
                const timer = setTimeout(() => {
                    setError('');
                }, 3000);
    
                return () => clearTimeout(timer);
            }
        }
        setError('');
        // Navigate to Results page with the entered URL as query parameter
        router.push(`/scraperesults?urls=${encodeURIComponent(url)}`)
    };

    return (
        <div className='p-4 flex flex-col items-center'>
            <div className="mb-8 text-center">
                <h1 className="mt-4 font-poppins-bold text-2xl text-jungleGreen-800 dark:text-dark-primaryTextColor">
                    Ready to start scraping?
                </h1>
                <h3 className="font-poppins-semibold text-lg text-jungleGreen-700 dark:text-jungleGreen-100">
                    Start by entering the URL of the website you wish to scrape
                </h3>
            </div>
            <div className="flex flex-col sm:flex-row w-full justify-center items-center">
                <Textarea
                    minRows={1}
                    label="URLs to scrape"
                    placeholder="Enter the URLs you want to scrape comma seperated"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                />
                <Button className="w-full sm:w-auto mt-4 sm:mt-0 sm:ml-4 font-poppins-semibold text-lg bg-jungleGreen-700 text-dark-primaryTextColor dark:bg-jungleGreen-400 dark:text-primaryTextColor"
                    onClick={handleScraping}
                >
                    Start scraping
                </Button>
            </div>
            {error ? <span className="mt-4 mb-2 p-2 text-white bg-red-600 rounded-lg transition-opacity duration-300 ease-in-out flex justify-center align-middle"><MdErrorOutline className="m-auto mx-1"/><p>{error}</p></span> : <p className="mt-4 p-2 min-h-[3.5rem]"></p>}

            <div className="bg-zinc-200 dark:bg-zinc-700 w-full md:w-5/6 p-4 rounded-xl">
                <h3 className="font-poppins-semibold text-lg text-jungleGreen-700 dark:text-jungleGreen-100 mb-4">
                    Scraping criteria
                </h3>

                <div className="gap-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                    <Checkbox radius="md" color={"default"}>Addresses</Checkbox>
                    <Checkbox radius="md" color={"default"}>Fraud detection</Checkbox>
                    <Checkbox defaultSelected radius="md" color={"default"}>Images</Checkbox>
                    <Checkbox defaultSelected radius="md" color={"default"}>Industry classifications</Checkbox>
                    <Checkbox radius="md" color={"default"}>Locations</Checkbox>
                    <Checkbox defaultSelected radius="md" color={"default"}>Logo</Checkbox>
                    <Checkbox radius="md" color={"default"}>Sentiment analysis</Checkbox>
                    <Checkbox radius="md" color={"default"}>Slogans</Checkbox>
                    <Checkbox defaultSelected radius="md" color={"default"}>Website status</Checkbox>
                </div>
            </div>
            
        </div>
    )
}

'use client'
import React, { useEffect, Suspense } from 'react';
import { Input } from "@nextui-org/react";
import { FiSearch } from "react-icons/fi";
import {Pagination} from "@nextui-org/react";
import ScrapeResultsCard from '../../components/ScrapeResultCard';
import { useSearchParams } from 'next/navigation';

interface CrawlableStatus {
    [url: string]: boolean;
}

function ResultsComponent() {
    const searchParams = useSearchParams();
    const urls = searchParams.get('urls');
    const [decodedUrls, setDecodedUrls] = React.useState<string[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);

    const [isCrawlable, setIsCrawlable] =  React.useState<CrawlableStatus>({});

    useEffect(() => {
        if (urls) {
            const decoded = decodeURIComponent(urls).split(',');
            setDecodedUrls(decoded);
            console.log(decoded); 

            fetchIsCrawlingAllowed(urls);
        }
    }, [urls])

    const fetchIsCrawlingAllowed = async (url: string) => {
        try {
            const response = await fetch(`http://localhost:3000/api/isCrawlingAllowed?urls=${encodeURIComponent(url)}`);
            const data = await response.json();
            console.log(data);
            setIsCrawlable(data);
        }
        catch (error) {
            console.error('Error fetching whether website is crawlable:', error);
        }
        finally {
            setIsLoading(false);
        }
    }

    if (isLoading) {
        return (
            <div className='min-h-screen flex justify-center items-center'>
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-white" role="status">
                    <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
                        Loading...
                    </span>
                </div>
            </div>
        );
    }

    return (
        <div className='p-4'>
            <div className='flex justify-center'>
                <Input
                    type="text"
                    placeholder="https://www.takealot.com/"
                    labelPlacement="outside"
                    className="py-3 sm:pr-3 w-full md:w-4/5 md:px-5"
                    startContent={
                        <FiSearch className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                    } 
                />
            </div>

            <div className="gap-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {decodedUrls && decodedUrls.map((link, index) => (
                    <ScrapeResultsCard key={link + index} url={link} isCrawlable={isCrawlable[link]}/>
                ))}
            </div>

            <div className='flex justify-center'>
                <Pagination loop showControls color="default" total={5} initialPage={1} />
            </div>
        </div>
    )
}
export default function ScrapeResults() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
          <ResultsComponent />
        </Suspense>
    )
}
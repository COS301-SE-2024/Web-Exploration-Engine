'use client'
import React, { useEffect, Suspense } from 'react';
import { FiSearch } from "react-icons/fi";
import { SelectItem } from "@nextui-org/react";
import ScrapeResultsCard from '../../components/ScrapeResultCard';
import { useSearchParams } from 'next/navigation';
import WEEInput from '../../components/Util/Input';
import WEESelect from '../../components/Util/Select';
import WEEPagination from '../../components/Util/Pagination';

interface CrawlableStatus {
    [url: string]: boolean;
}

interface Industry {
    url: string;
    industry : string;
}

function ResultsComponent() {
    const searchParams = useSearchParams();
    const urls = searchParams.get('urls');
    const [decodedUrls, setDecodedUrls] = React.useState<string[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);

    const [isCrawlable, setIsCrawlable] =  React.useState<CrawlableStatus>({});
    const [websiteStatus, setWebsiteStatus] = React.useState<boolean[]>([]);
    const [industryClassification, setIndustryClassification] = React.useState<Industry[]>([]);

    useEffect(() => {
        if (urls) {
            const decoded = decodeURIComponent(urls).split(',');
            setDecodedUrls(decoded);
            console.log(decoded); 

            fetchIsCrawlingAllowed(urls);
            fetchWebsiteStatus(urls);
            fetchIndustryClassifications(urls);
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
    };

    const fetchWebsiteStatus = async (url: string) => {
        try {
            const response = await fetch(`http://localhost:3000/api/status?urls=${encodeURIComponent(url)}`);
            const data = await response.json();
            console.log(data);
            setWebsiteStatus(data);
        }
        catch (error) {
            console.error('Error fetching website status:', error);
        }
    };

    const fetchIndustryClassifications = async (url: string) => {
        try {
            const response = await fetch(`http://localhost:3000/api/scrapeIndustry?urls=${encodeURIComponent(url)}`);
            const data = await response.json();
            console.log('industry classification', data);
            data.forEach((item:any) => {
                setIndustryClassification(prev => [
                    ...prev, 
                    { url: item.url, industry: item.metadata.industry }
                ]);
            })
        }
        catch (error) {
            console.error('Error fetching industry classifications:', error);
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
                <WEEInput
                    type="text"
                    placeholder="https://www.takealot.com/"
                    labelPlacement="outside"
                    className="py-3  w-full md:w-4/5 md:px-5"
                    startContent={
                        <FiSearch className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                    } 
                />
            </div>
            <div className='md:flex md:justify-between md:w-4/5 md:m-auto md:px-5'>
                <WEESelect
                    label="Live/Parked"
                    className="w-full pb-3 md:w-1/3"
                >
                    <SelectItem key={"Parked"}>Parked</SelectItem>
                    <SelectItem key={"Live"}>Live</SelectItem>
                </WEESelect>

                <WEESelect
                    label="Crawlable"
                    className="w-full pb-3 md:w-1/3"
                >
                    <SelectItem key={"Yes"}>Yes</SelectItem>
                    <SelectItem key={"No"}>No</SelectItem>
                </WEESelect>
            </div>

            <h1 className="my-4 font-poppins-bold text-2xl text-jungleGreen-800 dark:text-dark-primaryTextColor">
                Results
            </h1>
            <div className="gap-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {decodedUrls && decodedUrls.map((link, index) => (
                    <ScrapeResultsCard key={link + index} url={link} isCrawlable={isCrawlable[link]} websiteStatus={websiteStatus[index]} industryClassification={industryClassification[index].industry}/>
                ))}
            </div>

            <div className='flex justify-center pt-3'>
                <WEEPagination loop showControls color="stone" total={5} initialPage={1}/>
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
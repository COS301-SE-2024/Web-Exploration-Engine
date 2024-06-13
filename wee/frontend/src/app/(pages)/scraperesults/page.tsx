'use client'
import React, { useEffect, Suspense, useState } from 'react';
import { FiSearch } from "react-icons/fi";
import { SelectItem } from "@nextui-org/react";
import ScrapeResultsCard from '../../components/ScrapeResultCard';
import { useSearchParams } from 'next/navigation';
import WEEInput from '../../components/Util/Input';
import WEESelect from '../../components/Util/Select';
import WEEPagination from '../../components/Util/Pagination';
import {Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Pagination, Spinner, getKeyValue, Chip, Button} from "@nextui-org/react";

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

    // arrays that holds results returned from API
    const [isCrawlable, setIsCrawlable] =  React.useState<CrawlableStatus>({});
    const [websiteStatus, setWebsiteStatus] = React.useState<boolean[]>([]);
    const [industryClassification, setIndustryClassification] = React.useState<Industry[]>([]);

    // Pagination
    const [page, setPage] = React.useState(1);
    const [resultsPerPage, setResultsPerPage] = React.useState(2);
    const pages = Math.ceil(decodedUrls.length/resultsPerPage);

    const handleResultsPerPageChange = (keys:any) => {
        const newResultsPerPage = parseInt(keys.values().next().value, 10);
        setResultsPerPage(newResultsPerPage);
        setPage(1);
    };

    const items = React.useMemo(() => {
        const start = (page - 1) * resultsPerPage;
        const end = start + resultsPerPage;

        return decodedUrls.slice(start,end);
    }, [page, decodedUrls, resultsPerPage])

    useEffect(() => {
        if (urls) {
            const decoded = decodeURIComponent(urls).split(',');
            setDecodedUrls(decoded);
            console.log(decoded); 

            fetchIsCrawlingAllowed(urls);
            fetchWebsiteStatus(urls);
            // fetchIndustryClassifications(urls);
        }
    }, [urls])

    const fetchIsCrawlingAllowed = async (url: string) => {
        try {
            const response = await fetch(`http://localhost:3000/api/isCrawlingAllowed?urls=${encodeURIComponent(url)}`);
            const data = await response.json();
            console.log('Crawling allowed', data);
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
        finally {
            setIsLoading(false);
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

            <div className='md:flex md:justify-between'>
                <h1 className="my-4 font-poppins-bold text-2xl text-jungleGreen-800 dark:text-dark-primaryTextColor">
                    Results
                </h1>
                <div className='flex my-auto md:w-1/3 w-full'>
                    <span className='m-2 text-xs'>Number of results per page:</span>
                    <span className='w-[5rem]'>
                        <WEESelect
                            defaultSelectedKeys={["2"]}    
                            aria-label="Number of results per page"      
                            onSelectionChange={handleResultsPerPageChange}                   
                        >
                            <SelectItem key={"2"}>2</SelectItem>
                            <SelectItem key={"5"}>5</SelectItem>
                            <SelectItem key={"7"}>7</SelectItem>
                            <SelectItem key={"9"}>9</SelectItem>
                        </WEESelect>
                    </span>
                </div>
            </div>
            {/* <div className="gap-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((link, index) => (
                    <ScrapeResultsCard key={link + index} url={link} isCrawlable={isCrawlable[link]} websiteStatus={websiteStatus[index]} industryClassification={industryClassification[index].industry}/>
                ))}
            </div> */}

            <Table 
                aria-label="Example table with client side pagination"
                bottomContent={
                    <div className="flex w-full justify-center">
                        <WEEPagination 
                            loop 
                            showControls 
                            color="stone" 
                            page={page}
                            total={pages}
                            onChange={(page) => setPage(page)}
                            aria-label="Pagination"
                        />
                    </div>
                }
                classNames={{
                    wrapper: "min-h-[222px]",
                }}
                >
                <TableHeader>
                    <TableColumn key="name">
                        URL
                    </TableColumn>
                    <TableColumn key="role" className='hidden md:table-cell'>
                        CRAWLABLE
                    </TableColumn>
                    <TableColumn key="status">
                        RESULT &amp; REPORT
                    </TableColumn>
                </TableHeader>

                <TableBody>
                    {items.map((item, index) => (
                    <TableRow key={index}>
                        <TableCell>
                            {item}
                        </TableCell>
                        <TableCell className='hidden md:table-cell'>
                            <Chip radius="sm" color={isCrawlable[item]? 'success' : 'warning'} variant="flat">{isCrawlable[item] ? 'Yes' : 'No'}</Chip>
                        </TableCell>
                        <TableCell>
                            <Button className="font-poppins-semibold bg-jungleGreen-700 text-dark-primaryTextColor dark:bg-jungleGreen-400 dark:text-primaryTextColor"
                                // onClick={handleResultPage}
                            >
                                View
                            </Button>
                        </TableCell>
                    </TableRow>
                    ))}
                </TableBody>
            </Table>

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
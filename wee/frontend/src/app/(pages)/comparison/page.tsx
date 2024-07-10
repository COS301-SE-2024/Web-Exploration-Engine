'use client';
import React, { useEffect } from "react";
import WEETable from '../../components/Util/Table';
import WEESelect from "../../components/Util/Select";
import { Image, Button, Chip, TableHeader, TableColumn, TableBody, TableRow, TableCell, SelectItem } from '@nextui-org/react';
import { useScrapingContext } from '../../context/ScrapingContext';
import { useRouter } from 'next/navigation';
import Scraping from "../../models/ScrapingModel";
import { FiClock, FiCheck, FiSearch, FiEye } from "react-icons/fi";

export default function ComparisonReport() {
    const { results } = useScrapingContext();
    const router = useRouter();
    const [websiteOne, setWebsiteOne] = React.useState<Scraping>();
    const [websiteTwo, setWebsiteTwo] = React.useState<Scraping>();

    useEffect(() => {

    }, []);

    const backToScrapeResults = () => {
        router.push(`/scraperesults`);
    };

    const handleWebsiteOne = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const website1: number = parseInt(event.target.value, 10);
        setWebsiteOne(results[website1]);
    }

    const handleWebsiteTwo = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const website2: number = parseInt(event.target.value, 10);
        setWebsiteTwo(results[website2]);
    }

    return (
        <div className="min-h-screen p-4"> 
            <Button
                className="text-md font-poppins-semibold bg-jungleGreen-700 text-dark-primaryTextColor dark:bg-jungleGreen-400 dark:text-primaryTextColor"
                onClick={backToScrapeResults}
            >
                Back
            </Button>
            <div className="mb-8 text-center">
                <h1 className="mt-4 font-poppins-bold text-2xl text-jungleGreen-800 dark:text-dark-primaryTextColor">
                    Website Comparison
                </h1>
            </div>

            <div className="mb-4">
                <WEESelect
                    label="Website 1"
                    className="w-1/2 pr-3 pb-3"
                    onChange={handleWebsiteOne}
                >
                    {results.map((item, index) => (
                        <SelectItem key={index}>{item.url}</SelectItem>
                    ))}
                </WEESelect>

                <WEESelect
                    label="Website 2"
                    className="w-1/2 pl-3 pb-3"
                    onChange={handleWebsiteTwo}
                >
                    {results.map((item, index) => (
                        <SelectItem key={index}>{item.url}</SelectItem>
                    ))}
                </WEESelect>
            </div>

            {/* Website Status */}
            <div className="bg-zinc-200 dark:bg-zinc-700 sm:bg-pink-200 rounded-xl flex justify-between p-4 my-3">
                <div className='text-center font-poppins-bold text-5xl text-jungleGreen-800 dark:text-jungleGreen-400 pt-4 w-1/3'>
                    Live
                </div>

                <div className="text-center m-auto">
                    <div className='text-5xl flex justify-center'>
                        <FiSearch />
                    </div>
                    <div className='font-poppins-semibold text-lg'>
                        Website Status
                    </div>
                </div>

                <div className='text-center font-poppins-bold text-5xl text-jungleGreen-800 dark:text-jungleGreen-400 pt-4 w-1/3'>
                    Parked
                </div>
            </div>

            {/* Industry Classification */}
            <div className="bg-zinc-200 dark:bg-zinc-700 rounded-xl flex justify-between p-4 my-3">
                {/* <div className='text-center font-poppins-bold text-5xl text-jungleGreen-800 dark:text-jungleGreen-400 pt-4 w-1/3'>
                    Live
                </div> */}
                <div className="text-center w-1/3">
                    <div className='font-poppins-bold text-5xl text-jungleGreen-800 dark:text-jungleGreen-400 pt-4'>
                       99.16%
                    </div>
                    <div className='font-poppins-semibold text-lg'>
                        Regional Banking
                    </div>
                </div>

                <div className="text-center m-auto">
                    <div className='text-5xl flex justify-center'>
                        <FiEye />
                    </div>
                    <div className='font-poppins-semibold text-lg'>
                        Industry Classification
                    </div>
                </div>

                <div className="text-center w-1/3">
                    <div className='font-poppins-bold text-5xl text-jungleGreen-800 dark:text-jungleGreen-400 pt-4'>
                       46.66%
                    </div>
                    <div className='font-poppins-semibold text-lg'>
                        Application Software
                    </div>
                </div>
            </div>
        {/* 
            <div className='gap-4 grid sm:grid-cols-3 bg-pink-400'>
                <div className='bg-zinc-200 dark:bg-zinc-700 p-4 rounded-xl text-center'>
                    <div className='text-5xl flex justify-center'>
                        <FiSearch />
                    </div>
                    <div className='font-poppins-bold text-6xl text-jungleGreen-800 dark:text-jungleGreen-400 pt-4'>
                       Urls
                    </div>
                    <div className='font-poppins-semibold text-lg'>
                        Scraped
                    </div>
                </div>

                <div className='bg-zinc-200 dark:bg-zinc-700 p-4 rounded-xl text-center'>
                    <div className='text-5xl flex justify-center'>
                        <FiCheck />
                    </div>
                    <div className='font-poppins-bold text-6xl text-jungleGreen-800 dark:text-jungleGreen-400 pt-4'>
                         Urls
                    </div>
                    <div className='font-poppins-semibold text-lg'>
                        Crawlable
                    </div>
                </div>

                <div className='bg-zinc-200 dark:bg-zinc-700 p-4 rounded-xl text-center'>
                    <div className='text-5xl flex justify-center'>
                        <FiClock />
                    </div>
                    <div className='font-poppins-bold text-6xl text-jungleGreen-800 dark:text-jungleGreen-400 pt-4'>
                        sec
                    </div>
                    <div className='font-poppins-semibold text-lg'>
                        Avg scrape time
                    </div>
                </div>
            </div> */}


            <WEETable isStriped aria-label="Example static collection table">
                <TableHeader>
                    <TableColumn>WEBSITE 1</TableColumn>
                    <TableColumn>WEBSITE 2</TableColumn>
                </TableHeader>
                <TableBody>                  
                    <TableRow key="1">
                        <TableCell>{websiteOne ? websiteOne.url : 'Url'}</TableCell>
                        <TableCell>{websiteTwo ? websiteTwo.url : 'Url'}</TableCell>
                    </TableRow>
                    <TableRow key="2">
                        <TableCell>
                            {websiteOne 
                            ? 
                            <>
                                <Chip
                                    radius="sm"
                                    color={websiteOne && websiteOne.domainStatus === 'live' ? 'success' : 'warning'}
                                    variant="flat"
                                >
                                    {websiteOne && websiteOne.domainStatus === 'live' ? 'Live' : 'Parked'}
                                </Chip>
                            </>
                            : 'Domain Status'}
                        </TableCell>
                        <TableCell>
                            {websiteTwo 
                            ? 
                            <>
                                <Chip
                                    radius="sm"
                                    color={websiteTwo && websiteTwo.domainStatus === 'live' ? 'success' : 'warning'}
                                    variant="flat"
                                >
                                    {websiteTwo && websiteTwo.domainStatus === 'live' ? 'Live' : 'Parked'}
                                </Chip>
                            </>
                            : 'Domain Status'}
                        </TableCell>
                    </TableRow>
                    <TableRow key="3">
                        <TableCell>
                            {/* <div className="flex justify-center"> */}
                                {/* <div className="flex justify-center"> */}
                                    <Image
                                        alt="Logo"
                                        src={websiteOne?.logo}
                                        className="centered-image max-h-48 shadow-md shadow-zinc-150 dark:shadow-zinc-900"
                                    />
                                {/* </div> */}
                            {/* </div> */}
                    
                        </TableCell>
                        <TableCell>
                            <Image
                                alt="Logo"
                                src={websiteTwo?.logo}
                                className="centered-image max-h-48 shadow-md shadow-zinc-150 dark:shadow-zinc-900"
                            />
                        </TableCell>
                    </TableRow>
                    <TableRow key="4">
                        <TableCell>abc</TableCell>
                        <TableCell>abc</TableCell>
                    </TableRow>
                </TableBody>
            </WEETable>
        </div>
    );
}
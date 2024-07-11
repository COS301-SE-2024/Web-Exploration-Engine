'use client';
import React, { useEffect } from "react";
import WEESelect from "../../components/Util/Select";
import { Button, SelectItem } from '@nextui-org/react';
import { useScrapingContext } from '../../context/ScrapingContext';
import { useRouter } from 'next/navigation';
import Scraping from "../../models/ScrapingModel";
import { FiCheck, FiSearch, FiEye } from "react-icons/fi";

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
                        <SelectItem key={index} textValue={item.url}>{item.url}</SelectItem>
                    ))}
                </WEESelect>

                <WEESelect
                    label="Website 2"
                    className="w-1/2 pl-3 pb-3"
                    onChange={handleWebsiteTwo}
                >
                    {results.map((item, index) => (
                        <SelectItem key={index} textValue={item.url}>{item.url}</SelectItem>
                    ))}
                </WEESelect>
            </div>

            <div className="bg-jungleGreen-800 dark:bg-jungleGreen-400 text-dark-primaryTextColor dark:text-primaryTextColor rounded-xl flex justify-between p-2 px-3">
                <div className="text-xs my-auto sm:text-lg">
                    {websiteOne ? websiteOne.url : 'Website 1'}
                </div>

                <div className="text-xs my-auto sm:text-lg">
                    {websiteTwo ? websiteTwo.url : 'Website 2'}
                </div>
            </div>

            {/* Website Status */}
            <div className="bg-zinc-200 dark:bg-zinc-700 rounded-xl flex justify-between p-4 my-3">
                <div className='text-center font-poppins-bold text-3xl sm:text-5xl text-jungleGreen-800 dark:text-jungleGreen-400 pt-4 w-1/3'>
                    {!websiteOne ? '-' : (websiteOne.domainStatus === 'live' ? 'Live' : 'Parked')}
                </div>

                <div className="text-center m-auto">
                    <div className='hidden text-5xl sm:flex justify-center'>
                        <FiSearch />
                    </div>
                    <div className='font-poppins-semibold text-md sm:text-lg'>
                        Website Status
                    </div>
                </div>

                <div className='text-center font-poppins-bold text-3xl sm:text-5xl text-jungleGreen-800 dark:text-jungleGreen-400 pt-4 w-1/3'>
                    {!websiteTwo ? '-' : (websiteTwo.domainStatus === 'live' ? 'Live' : 'Parked')}
                </div>
            </div>

            {/* Industry Classification */}
            <div className="bg-zinc-200 dark:bg-zinc-700 rounded-xl flex justify-between p-4 my-3">
                <div className="text-center w-1/3">
                    <div className='font-poppins-bold text-3xl sm:text-5xl text-jungleGreen-800 dark:text-jungleGreen-400 pt-4'>
                       {!websiteOne ? '-' : (websiteOne.industryClassification.metadataClass.score ? (websiteOne.industryClassification.metadataClass.score * 100).toFixed(2) + '%' : '0%')}
                    </div>
                    <div className='font-poppins-semibold text-sm sm:text-lg'>
                        {!websiteOne ? '-' : (websiteOne.industryClassification.metadataClass.label ? websiteOne.industryClassification.metadataClass.label : 'N/A')}
                    </div>
                </div>

                <div className="text-center m-auto">
                    <div className='hidden text-5xl sm:flex justify-center'>
                        <FiEye />
                    </div>
                    <div className='font-poppins-semibold text-sm sm:text-lg'>
                        Industry Classification
                    </div>
                </div>

                <div className="text-center w-1/3">
                    <div className='font-poppins-bold text-3xl sm:text-5xl text-jungleGreen-800 dark:text-jungleGreen-400 pt-4'>
                        {!websiteTwo ? '-' : (websiteTwo.industryClassification.metadataClass.score ? (websiteTwo.industryClassification.metadataClass.score * 100).toFixed(2) + '%' : '0%')}
                    </div>
                    <div className='font-poppins-semibold text-sm sm:text-lg'>
                        {!websiteTwo ? '-' : (websiteTwo.industryClassification.metadataClass.label ? websiteTwo.industryClassification.metadataClass.label : 'N/A')}
                    </div>
                </div>
            </div>

            {/* Domain match */}
            <div className="bg-zinc-200 dark:bg-zinc-700 rounded-xl flex justify-between p-4 my-3">
                <div className="text-center w-1/3">
                    <div className='font-poppins-bold text-3xl sm:text-5xl text-jungleGreen-800 dark:text-jungleGreen-400 pt-4'>
                       {!websiteOne ? '-' : (websiteOne.industryClassification.domainClass.score ? (websiteOne.industryClassification.domainClass.score * 100).toFixed(2) + '%' : '0%')}
                    </div>
                    <div className='font-poppins-semibold text-sm sm:text-lg'>
                        {!websiteOne ? '-' : (websiteOne.industryClassification.domainClass.label ? websiteOne.industryClassification.domainClass.label : 'N/A')}
                    </div>
                </div>

                <div className="text-center m-auto">
                    <div className='hidden text-5xl sm:flex justify-center'>
                        <FiCheck />
                    </div>
                    <div className='font-poppins-semibold text-sm sm:text-lg'>
                        Domain Match
                    </div>
                </div>

                <div className="text-center w-1/3">
                    <div className='font-poppins-bold text-3xl sm:text-5xl text-jungleGreen-800 dark:text-jungleGreen-400 pt-4'>
                        {!websiteTwo ? '-' : (websiteTwo.industryClassification.domainClass.score ? (websiteTwo.industryClassification.domainClass.score * 100).toFixed(2) + '%' : '0%')}
                    </div>
                    <div className='font-poppins-semibold text-sm sm:text-lg'>
                        {!websiteTwo ? '-' : (websiteTwo.industryClassification.domainClass.label ? websiteTwo.industryClassification.domainClass.label : 'N/A')}
                    </div>
                </div>
            </div>
        </div>
    );
}
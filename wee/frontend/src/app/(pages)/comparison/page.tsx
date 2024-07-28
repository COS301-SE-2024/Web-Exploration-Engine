'use client';
import React from "react";
import WEESelect from "../../components/Util/Select";
import { Button, SelectItem } from '@nextui-org/react';
import { useScrapingContext } from '../../context/ScrapingContext';
import { useRouter } from 'next/navigation';
import { ScraperResult } from '../../models/ScraperModels';
import { FiCheck, FiSearch, FiEye, FiSmartphone, FiClock, FiActivity } from "react-icons/fi";
import CircularProgressComparison from "../../components/CircularProgressComparison";
import { LightHouseAnalysis, SEOError } from "../../models/ScraperModels";

function isLightHouse(data: LightHouseAnalysis | SEOError): data is LightHouseAnalysis {
    return 'scores' in data || 'diagnostics' in data;
}

export default function Comparison() {
    const { results } = useScrapingContext();
    const router = useRouter();
    const [websiteOne, setWebsiteOne] = React.useState<ScraperResult>();
    const [websiteTwo, setWebsiteTwo] = React.useState<ScraperResult>();

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
                    data-testid="website1-select"
                >
                    {results.map((item, index) => (
                        <SelectItem key={index} textValue={item.url}>{item.url}</SelectItem>
                    ))}
                </WEESelect>

                <WEESelect
                    label="Website 2"
                    className="w-1/2 pl-3 pb-3"
                    onChange={handleWebsiteTwo}
                    data-testid="website2-select"
                >
                    {results.map((item, index) => (
                        <SelectItem key={index} textValue={item.url}>{item.url}</SelectItem>
                    ))}
                </WEESelect>
            </div>

            <div className="bg-jungleGreen-800 dark:bg-jungleGreen-400 text-dark-primaryTextColor dark:text-primaryTextColor rounded-xl flex justify-around p-2 px-3">
                <div className="text-xs my-auto sm:text-lg">
                    {websiteOne ? websiteOne.url : 'Website 1'}
                </div>

                <div className="text-xs my-auto sm:text-lg">
                    {websiteTwo ? websiteTwo.url : 'Website 2'}
                </div>
            </div>

            {/* Website Status */}
            <div className="bg-zinc-200 dark:bg-zinc-700 rounded-xl p-4 my-3">
                <div className="sm:hidden font-poppins-semibold text-lg text-center pb-2">
                    Website Status
                </div>
                <div className="flex justify-between ">
                    <div className='text-center font-poppins-bold text-4xl sm:text-5xl text-jungleGreen-800 dark:text-jungleGreen-400 my-auto w-1/3'>
                        {!websiteOne ? '-' : (websiteOne.domainStatus === 'live' ? 'Live' : 'Parked')}
                    </div>

                    <div className="text-center m-auto">
                        <div className='flex text-5xl justify-center'>
                            <FiSearch />
                        </div>
                        <div className='hidden font-poppins-semibold text-md sm:text-lg sm:flex'>
                            Website Status
                        </div>
                    </div>

                    <div className='text-center font-poppins-bold text-4xl sm:text-5xl text-jungleGreen-800 dark:text-jungleGreen-400 my-auto w-1/3'>
                        {!websiteTwo ? '-' : (websiteTwo.domainStatus === 'live' ? 'Live' : 'Parked')}
                    </div>
                </div>
            </div>

            {/* Industry Classification */}
            <div className="bg-zinc-200 dark:bg-zinc-700 rounded-xl p-4 my-3">
                <div className="sm:hidden font-poppins-semibold text-lg text-center pb-2">
                    Industry Classification
                </div>
                <div className="flex justify-between ">
                    <div className="text-center w-1/3">
                        <div className='font-poppins-bold text-3xl sm:text-5xl text-jungleGreen-800 dark:text-jungleGreen-400 pt-4'>
                            {!websiteOne ? '-' : (websiteOne.industryClassification.metadataClass.score ? (websiteOne.industryClassification.metadataClass.score * 100).toFixed(2) + '%' : '0%')}
                        </div>
                        <div className='font-poppins-semibold text-sm sm:text-lg'>
                            {!websiteOne ? '-' : (websiteOne.industryClassification.metadataClass.label ? websiteOne.industryClassification.metadataClass.label : 'N/A')}
                        </div>
                    </div>

                    <div className="text-center m-auto">
                        <div className='flex text-5xl justify-center'>
                            <FiEye />
                        </div>
                        <div className='hidden font-poppins-semibold text-md sm:text-lg sm:flex'>
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
            </div>

            {/* Domain match */}
            <div className="bg-zinc-200 dark:bg-zinc-700 rounded-xl p-4 my-3">
                <div className="sm:hidden font-poppins-semibold text-lg text-center pb-2">
                    Domain Match
                </div>
                <div className="flex justify-between ">
                    <div className="text-center w-1/3">
                        <div className='font-poppins-bold text-3xl sm:text-5xl text-jungleGreen-800 dark:text-jungleGreen-400 pt-4'>
                            {!websiteOne ? '-' : (websiteOne.industryClassification.domainClass.score ? (websiteOne.industryClassification.domainClass.score * 100).toFixed(2) + '%' : '0%')}
                        </div>
                        <div className='font-poppins-semibold text-sm sm:text-lg'>
                            {!websiteOne ? '-' : (websiteOne.industryClassification.domainClass.label ? websiteOne.industryClassification.domainClass.label : 'N/A')}
                        </div>
                    </div>

                    <div className="text-center m-auto">
                        <div className='flex text-5xl justify-center'>
                            <FiCheck />
                        </div>
                        <div className='hidden font-poppins-semibold text-md sm:text-lg sm:flex'>
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

            {/* Site Speed */}
            <div className="bg-zinc-200 dark:bg-zinc-700 rounded-xl p-4 my-3">
                <div className="sm:hidden font-poppins-semibold text-lg text-center pb-2">
                    Site Speed
                </div>
                <div className="flex justify-between ">
                    <div className="text-center w-1/3">
                        <div className='font-poppins-bold text-3xl sm:text-5xl text-jungleGreen-800 dark:text-jungleGreen-400 pt-4'>
                            9.54
                        </div>
                        <div className='font-poppins-semibold text-sm sm:text-lg'>
                            seconds
                        </div>
                    </div>

                    <div className="text-center m-auto">
                        <div className='flex text-5xl justify-center sm:pb-1'>
                            <FiClock />
                        </div>
                        <div className='hidden font-poppins-semibold text-md sm:text-lg sm:flex'>
                            Site Speed
                        </div>
                    </div>

                    <div className="text-center w-1/3">
                        <div className='font-poppins-bold text-3xl sm:text-5xl text-jungleGreen-800 dark:text-jungleGreen-400 pt-4'>
                            2.87
                        </div>
                        <div className='font-poppins-semibold text-sm sm:text-lg'>
                            seconds
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Friendly */}
            <div className="bg-zinc-200 dark:bg-zinc-700 rounded-xl p-4 my-3">
                <div className="sm:hidden font-poppins-semibold text-lg text-center pb-2">
                    Mobile Friendly
                </div>
                <div className="flex justify-between ">
                    <div className='text-center font-poppins-bold text-4xl sm:text-5xl text-jungleGreen-800 dark:text-jungleGreen-400 my-auto w-1/3'>
                        Yes
                    </div>

                    <div className="text-center m-auto">
                        <div className='flex text-5xl justify-center sm:pb-1'>
                            <FiSmartphone />
                        </div>
                        <div className='hidden font-poppins-semibold text-md sm:text-lg sm:flex'>
                            Mobile Friendly
                        </div>
                    </div>

                    <div className='text-center font-poppins-bold text-4xl sm:text-5xl text-jungleGreen-800 dark:text-jungleGreen-400 my-auto w-1/3'>
                        No
                    </div>
                </div>
            </div>

            {/* LightHouseAnalysis */}
            <div className="bg-zinc-200 dark:bg-zinc-700 rounded-xl p-4 my-3">
                <div className="sm:hidden font-poppins-semibold text-lg text-center pb-2">
                    Light House
                </div>
                <div className="flex justify-between ">
                    <div className='text-center font-poppins-bold text-4xl sm:text-5xl text-jungleGreen-800 dark:text-jungleGreen-400 my-auto w-1/3'>
                        <div className='gap-3 grid md:grid-cols-2 lg:grid-cols-3 '>
                            <div className="flex justify-center">
                                {websiteOne?.seoAnalysis.lighthouseAnalysis && isLightHouse(websiteOne?.seoAnalysis.lighthouseAnalysis) ?
                                    <CircularProgressComparison label="Performance" value={websiteOne?.seoAnalysis.lighthouseAnalysis.scores.performance}/>
                                    :
                                    <CircularProgressComparison label="Performance" value={0}/>
                                }
                            </div>
                            <div className="flex justify-center">
                                {websiteOne?.seoAnalysis.lighthouseAnalysis && isLightHouse(websiteOne?.seoAnalysis.lighthouseAnalysis) ?
                                    <CircularProgressComparison label="Accessibility" value={websiteOne?.seoAnalysis.lighthouseAnalysis.scores.accessibility}/>
                                    :
                                    <CircularProgressComparison label="Accessibility" value={0}/>
                                }
                            </div>
                            <div className="flex justify-center">
                                {websiteOne?.seoAnalysis.lighthouseAnalysis && isLightHouse(websiteOne?.seoAnalysis.lighthouseAnalysis) ?
                                    <CircularProgressComparison label="Best Practices" value={websiteOne?.seoAnalysis.lighthouseAnalysis.scores.bestPractices}/>
                                    :
                                    <CircularProgressComparison label="Best Practices" value={0}/>
                                }
                            </div>
                        </div>
                    </div>

                    <div className="text-center m-auto">
                        <div className='flex text-5xl justify-center sm:pb-1'>
                            <FiActivity />
                        </div>
                        <div className='hidden font-poppins-semibold text-md sm:text-lg sm:flex'>
                            Light House
                        </div>
                    </div>

                    <div className='text-center font-poppins-bold text-4xl sm:text-5xl text-jungleGreen-800 dark:text-jungleGreen-400 my-auto w-1/3'>
                    <div className='gap-3 grid md:grid-cols-2 lg:grid-cols-3 '>
                            <div className="flex justify-center">
                                {websiteTwo?.seoAnalysis.lighthouseAnalysis && isLightHouse(websiteTwo?.seoAnalysis.lighthouseAnalysis) ?
                                    <CircularProgressComparison label="Performance" value={websiteTwo?.seoAnalysis.lighthouseAnalysis.scores.performance}/>
                                    :
                                    <CircularProgressComparison label="Performance" value={0}/>
                                }
                            </div>
                            <div className="flex justify-center">
                                {websiteTwo?.seoAnalysis.lighthouseAnalysis && isLightHouse(websiteTwo?.seoAnalysis.lighthouseAnalysis) ?
                                    <CircularProgressComparison label="Accessibility" value={websiteTwo?.seoAnalysis.lighthouseAnalysis.scores.accessibility}/>
                                    :
                                    <CircularProgressComparison label="Accessibility" value={0}/>
                                }
                            </div>
                            <div className="flex justify-center">
                                {websiteTwo?.seoAnalysis.lighthouseAnalysis && isLightHouse(websiteTwo?.seoAnalysis.lighthouseAnalysis) ?
                                    <CircularProgressComparison label="Best Practices" value={websiteTwo?.seoAnalysis.lighthouseAnalysis.scores.bestPractices}/>
                                    :
                                    <CircularProgressComparison label="Best Practices" value={0}/>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
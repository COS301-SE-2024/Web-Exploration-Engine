'use client'
import React, { useEffect, useState } from 'react';
import { PieChart } from '../../components/Graphs';
import { BarChart } from '../../components/Graphs';
import { TableHeader, TableColumn, TableBody, TableRow, TableCell, Chip, Button, Link } from "@nextui-org/react";
import { RadialBar } from '../../components/Graphs';
import { useScrapingContext } from '../../context/ScrapingContext';
import { useRouter } from 'next/navigation';
import WEETable from '../../components/Util/Table';
import { FiClock, FiCheck, FiSearch } from "react-icons/fi";
import { InfoPopOver } from '../../components/InfoPopOver';


interface industryPercentages {
    industries: string[];
    percentages: number[];
}

interface weakClassification {
    url: string;
    metadataClass: string;
    score: number;
}

interface mismatchedUrls {
    url: string;
    metadataClass: string;
    domainClass: string;
}

export default function SummaryReport() {
    const router = useRouter();

    const { summaryReport } = useScrapingContext();

    const [domainStatus, setDomainStatus] = useState<number[]>([]);
    const [domainErrorStatus, setDomainErrorStatus] = useState<number>(0);
    const [unclassifiedUrls, setUnclassifiedUrls] = useState<string[]>([]);
    const [industries, setIndustries] = useState<string[]>([]);
    const [industryPercentages, setIndustryPercentages] = useState<number[]>([]);
    const [weakClassification, setWeakClassification] = useState<weakClassification[]>();
    const [percentageMatch, setPercentageMatch] = useState<number>(0);
    const [mismatchedUrls, setMismatchedUrls] = useState<mismatchedUrls[]>();
    const [totalUrls, setTotalUrls] = useState<number>(0);
    const [parkedUrls, setParkedUrls] = useState<string[]>([]);
    const [scrapableUrls, setscrapableUrls] = useState<number>(0);
    const [avgTime, setAvgTime] = useState<number>(0);
    useEffect(() => {
        
        if (summaryReport) {
            //console.log("Summary Report:", summaryReport);
            setDomainStatus(summaryReport.domainStatus ?? []);
            setDomainErrorStatus(summaryReport.domainErrorStatus ?? 0);
            setUnclassifiedUrls(summaryReport.industryClassification?.unclassifiedUrls ?? []);
            setIndustries(summaryReport.industryClassification?.industryPercentages?.industries ?? []);
            setIndustryPercentages(summaryReport.industryClassification?.industryPercentages?.percentages ?? []);
            setWeakClassification(summaryReport.industryClassification?.weakClassification ?? []);
            setPercentageMatch(summaryReport.domainMatch?.percentageMatch ?? 0);
            setMismatchedUrls(summaryReport.domainMatch?.mismatchedUrls ?? []);
            setTotalUrls(summaryReport.totalUrls ?? 0); 
            setParkedUrls(summaryReport.parkedUrls ?? []); 
            setscrapableUrls(summaryReport.scrapableUrls ?? 0); 
            setAvgTime(summaryReport.avgTime ?? 0);
        }

    }, [summaryReport]);

    const backToScrapeResults = () => {
        router.push(`/scraperesults`);
    };

    return (
        <div className='min-h-screen p-4'>
            <Button
                className="text-md font-poppins-semibold bg-jungleGreen-700 text-dark-primaryTextColor dark:bg-jungleGreen-400 dark:text-primaryTextColor"
                onClick={backToScrapeResults}
            >
                Back
            </Button>

            <div className="mb-8 text-center">
                <h1 className="mt-4 font-poppins-bold text-2xl text-jungleGreen-800 dark:text-dark-primaryTextColor">
                    Scraping Dashboard/Summary
                </h1>
            </div>

            {/* General stats */}
            <h3 className="font-poppins-semibold text-2xl text-jungleGreen-700 dark:text-jungleGreen-100 pb-2">
                General stats
            </h3>
            <div className='gap-4 grid sm:grid-cols-3'>

                {/* Scraped stats */}
                <div className='bg-zinc-200 dark:bg-zinc-700 p-4 rounded-xl text-center'>
                    <div className='text-5xl flex justify-center'>
                        <FiSearch />
                    </div>
                    <div className='font-poppins-bold text-6xl text-jungleGreen-800 dark:text-jungleGreen-400 pt-4'>
                        {summaryReport.totalUrls} Urls
                    </div>
                    <div className='font-poppins-semibold text-lg'>
                        Scraped
                    </div>
                </div>

                {/* Crawlable stats */}
                <div className='bg-zinc-200 dark:bg-zinc-700 p-4 rounded-xl text-center'>
                    <div className='text-5xl flex justify-center'>
                        <FiCheck />
                    </div>
                    <div className='font-poppins-bold text-6xl text-jungleGreen-800 dark:text-jungleGreen-400 pt-4'>
                    {summaryReport.scrapableUrls} Urls
                    </div>
                    <div className='font-poppins-semibold text-lg'>
                        Crawlable
                    </div>
                </div>

                {/* Avg scrape stats */}
                <div className='bg-zinc-200 dark:bg-zinc-700 p-4 rounded-xl text-center'>
                    <div className='text-5xl flex justify-center'>
                        <FiClock />
                    </div>
                    <div className='font-poppins-bold text-6xl text-jungleGreen-800 dark:text-jungleGreen-400 pt-4'>
                    {summaryReport.avgTime} sec
                    </div>
                    <div className='font-poppins-semibold text-lg'>
                        Avg scrape time
                    </div>
                </div>
            </div>

            {/* Industry classification */}
            <h3 className="font-poppins-semibold text-2xl text-jungleGreen-700 dark:text-jungleGreen-100 pb-2 mt-10">
                Industry classification
            </h3>
            <div className='gap-4 grid md:grid-cols-2'>
                <div className='bg-zinc-200 dark:bg-zinc-700 p-4 rounded-xl text-center md:col-span-1 flex flex-col justify-center'>
                    <h3 className="font-poppins-semibold text-lg text-jungleGreen-700 dark:text-jungleGreen-100 mb-4 text-center">
                        Classification Distribution
                        <InfoPopOver 
                            heading="Industry classification" 
                            content="The classification of industries is based on machine learning models. WEE cannot guarantee the accuracy of the classifications." 
                            placement="right-end" 
                        />
                    </h3>
                    <PieChart dataLabel={industries} dataSeries={industryPercentages}/>
                </div>

                <div className='bg-zinc-200 dark:bg-zinc-700 p-4 rounded-xl md:col-span-1'>
                    <h3 className="font-poppins-semibold text-lg text-jungleGreen-700 dark:text-jungleGreen-100 mb-4 text-center">
                        Weak classifications
                        <InfoPopOver 
                            heading="Industry classification" 
                            content="Weak classifications are those that have a low confidence score (below 50%). WEE cannot guarantee the accuracy of the classifications." 
                            placement="right-end" 
                        />
                    </h3>
                    <WEETable 
                        isHeaderSticky
                        className='max-h-[15rem]'
                        aria-label="Industry classification table"
                    >
                        <TableHeader>
                            <TableColumn key="name" className='rounded-lg sm:rounded-none'>
                                URL
                            </TableColumn>
                            <TableColumn key="role" className='hidden sm:table-cell'>
                                SCORE
                            </TableColumn>
                        </TableHeader>

                        <TableBody emptyContent={"There was no weak classifications"}>
                            {   (weakClassification || []).map((item, index) => (
                                    <TableRow key={index}>
                                        <TableCell>
                                            <Link href={`/results?url=${encodeURIComponent(item.url)}`}>                               
                                                {item.url}
                                            </Link>
                                        </TableCell>
                                        <TableCell className='hidden sm:table-cell'>
                                            {(item.score * 100).toFixed(2)}%
                                        </TableCell>
                                    </TableRow>
                                ))
                            }
                        </TableBody>
                    </WEETable>
                </div>
            </div> {/* Grid */}

            {/* Domain match */}
            <h3 className="font-poppins-semibold text-2xl text-jungleGreen-700 dark:text-jungleGreen-100 pb-2 mt-10">
                Domain match
                <InfoPopOver 
                    heading="Domain Match" 
                    content="Domain match refers to the percentage of URLs that have the same domain classification as the metadata classification. WEE cannot guarantee the accuracy of the classifications." 
                    placement="right-end" 
                />
            </h3>
            <div className='gap-4 grid md:grid-cols-3'>
                <div className='bg-zinc-200 dark:bg-zinc-700 p-4 rounded-xl text-center md:col-span-1 flex flex-col justify-center'>
                    <RadialBar dataLabel={['Match']} dataSeries={[percentageMatch]}/>
                </div>

                <div className='bg-zinc-200 dark:bg-zinc-700 p-4 rounded-xl md:col-span-2'>
                    <h3 className="font-poppins-semibold text-lg text-jungleGreen-700 dark:text-jungleGreen-100 mb-4 text-center">
                        Domain mismatch information
                    </h3>
                    <WEETable 
                        isHeaderSticky
                        className='max-h-[15rem]'
                        aria-label="Domain mismatch information table"
                    >
                        <TableHeader>
                            <TableColumn key="name" className='rounded-lg sm:rounded-none'>
                                URL
                            </TableColumn>
                            <TableColumn key="role" className='hidden sm:table-cell'>
                                CLASSIFICATION - META
                            </TableColumn>
                            <TableColumn key="status" className='hidden sm:table-cell'>
                                DOMAIN MATCH
                            </TableColumn>
                        </TableHeader>

                        <TableBody emptyContent={"There was no mismatch"}>
                            {   (mismatchedUrls || []).map((item, index) => (
                                    <TableRow key={index}>
                                        <TableCell>
                                            <Link href={`/results?url=${encodeURIComponent(item.url)}`}>                               
                                                {item.url}
                                            </Link>
                                        </TableCell>
                                        <TableCell className='hidden sm:table-cell'>
                                            {item.metadataClass}
                                        </TableCell>
                                        <TableCell className='hidden sm:table-cell'>
                                            {item.domainClass}
                                        </TableCell>
                                    </TableRow>
                                ))
                            }
                        </TableBody>
                    </WEETable>
                </div>
            </div> {/* Grid */}

            {/* Website status */}
            <h3 className="font-poppins-semibold text-2xl text-jungleGreen-700 dark:text-jungleGreen-100 pb-2 mt-10">
                Website status
            </h3>
            <div className='gap-4 grid md:grid-cols-3'>
                <div className='bg-zinc-200 dark:bg-zinc-700 p-4 rounded-xl text-center md:col-span-2 flex flex-col justify-center'>
                    <BarChart dataLabel={['Live', 'Parked']} dataSeries={domainStatus}/> 
                </div>

                <div className='bg-zinc-200 dark:bg-zinc-700 p-4 rounded-xl md:col-span-1'>
                    <h3 className="font-poppins-semibold text-lg text-jungleGreen-700 dark:text-jungleGreen-100 mb-4 text-center">
                        Parked sites
                    </h3>
                    <WEETable 
                        isHeaderSticky
                        className='max-h-[15rem]'
                        aria-label="Parked sites table"
                    >
                        <TableHeader>
                            <TableColumn key="name" className='rounded-lg sm:rounded-none'>
                                URL
                            </TableColumn>
                        </TableHeader>

                        <TableBody emptyContent={"There were no parked websites"}>
                            {   (parkedUrls || []).map((url, index) => (
                             <TableRow key={index}>
                                 <TableCell>
                                        <Link href={`/results?url=${encodeURIComponent(url)}`}>                               
                                            {url}
                                        </Link>
                                </TableCell>
                            </TableRow>
                             ))
                            }
</TableBody>

                    </WEETable>
                </div>
            </div> {/* Grid */}

        </div>
    );
}
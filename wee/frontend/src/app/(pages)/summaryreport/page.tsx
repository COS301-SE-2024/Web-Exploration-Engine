'use client'
import React, { useEffect, useState } from 'react';
import { PieChart } from '../../components/Graphs';
import { BarChart } from '../../components/Graphs';
import { TableHeader, TableColumn, TableBody, TableRow, TableCell, Chip, Button, Link } from "@nextui-org/react";
import { RadialBar } from '../../components/Graphs';
import { useScrapingContext } from '../../context/ScrapingContext';
import { useRouter } from 'next/navigation';
import WEETable from '../../components/Util/Table';


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
    
    useEffect(() => {
        
        if (summaryReport) {
            setDomainStatus(summaryReport.domainStatus);
            setDomainErrorStatus(summaryReport.domainErrorStatus);
            setUnclassifiedUrls(summaryReport.industryClassification.unclassifiedUrls);
            setIndustries(summaryReport.industryClassification.industryPercentages.industries);
            setIndustryPercentages(summaryReport.industryClassification.industryPercentages.percentages);
            setWeakClassification(summaryReport.industryClassification.weakClassification);
            setPercentageMatch(summaryReport.domainMatch.percentageMatch);
            setMismatchedUrls(summaryReport.domainMatch.mismatchedUrls);
        }
        console.log(industryPercentages)
        console.log(industries)

    }, [summaryReport, industryPercentages, industries]);

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

            <h3 className="font-poppins-semibold text-2xl text-jungleGreen-700 dark:text-jungleGreen-100 pb-2">
                General stats
            </h3>
            <div className='gap-4 grid sm:grid-cols-3'>
                <div className='bg-zinc-200 dark:bg-zinc-700 p-4 rounded-xl text-center'>
                        Scraped
                </div>
                <div className='bg-zinc-200 dark:bg-zinc-700 p-4 rounded-xl text-center'>
                        Crawlable
                </div>
                <div className='bg-zinc-200 dark:bg-zinc-700 p-4 rounded-xl text-center'>
                        Avg scrape time
                </div>
            </div>

            {/* <div className='gap-4 grid md:grid-cols-2'>
                <div className='bg-zinc-200 dark:bg-zinc-700 p-4 rounded-xl text-center'>
                    <h3 className="font-poppins-semibold text-lg text-jungleGreen-700 dark:text-jungleGreen-100 mb-4">
                        Industry classification
                    </h3>
                    <PieChart dataLabel={industries} dataSeries={industryPercentages}/>
                </div>
            </div> 

            <div className='gap-4 grid md:grid-cols-2'>
                <div className='bg-zinc-200 dark:bg-zinc-700 p-4 rounded-xl text-center'>
                    <h3 className="font-poppins-semibold text-lg text-jungleGreen-700 dark:text-jungleGreen-100 mb-4">
                        Live/Parked Status
                    </h3>
                    <BarChart dataLabel={['Live', 'Parked']} dataSeries={domainStatus}/> 
                </div>
            </div>  */}
            <h3 className="font-poppins-semibold text-2xl text-jungleGreen-700 dark:text-jungleGreen-100 pb-2 mt-10">
                Industry classification
            </h3>
            <div className='gap-4 grid md:grid-cols-2'>
                <div className='bg-zinc-200 dark:bg-zinc-700 p-4 rounded-xl text-center md:col-span-1 flex flex-col justify-center'>
                    <PieChart dataLabel={industries} dataSeries={industryPercentages}/>
                </div>

                <div className='bg-zinc-200 dark:bg-zinc-700 p-4 rounded-xl md:col-span-1'>
                    <h3 className="font-poppins-semibold text-lg text-jungleGreen-700 dark:text-jungleGreen-100 mb-4 text-center">
                        Weak classifications
                    </h3>
                    <WEETable 
                        isHeaderSticky
                        className='max-h-[15rem]'
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
                                            {item.score}
                                        </TableCell>
                                    </TableRow>
                                ))
                            }
                        </TableBody>
                    </WEETable>
                </div>
            </div> {/* Grid */}

            <h3 className="font-poppins-semibold text-2xl text-jungleGreen-700 dark:text-jungleGreen-100 pb-2 mt-10">
                Domain watch
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
                    >
                        <TableHeader>
                            <TableColumn key="name" className='rounded-lg sm:rounded-none'>
                                URL
                            </TableColumn>
                        </TableHeader>

                        <TableBody emptyContent={"There was no parked websites"}>
                            {/* {   (weakClassification || []).map((item, index) => (
                                    <TableRow key={index}>
                                        <TableCell>
                                            <Link href={`/results?url=${encodeURIComponent(item.url)}`}>                               
                                                {item.url}
                                            </Link>
                                        </TableCell>
                                    </TableRow>
                                ))
                            } */}
                            <TableRow>
                                <TableCell>
                                    https://randomwebsite.com
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </WEETable>
                </div>
            </div> {/* Grid */}

        </div>
    );
}
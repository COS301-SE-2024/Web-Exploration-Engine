'use client'
import React, { useEffect, useState, Suspense } from 'react';
import { PieChart } from '../../components/Graphs';
import { BarChart } from '../../components/Graphs';
import { 
    TableHeader, TableColumn, TableBody, TableRow, TableCell, 
    Button,
    Dropdown, DropdownItem, DropdownMenu, DropdownTrigger
} from "@nextui-org/react";
import { RadialBar } from '../../components/Graphs';
import { useRouter, useSearchParams } from 'next/navigation';
import WEETable from '../../components/Util/Table';
import { FiClock, FiCheck, FiSearch} from "react-icons/fi";
import { InfoPopOver } from '../../components/InfoPopOver';
import Link from 'next/link';
import { FiShare, FiDownload, FiSave } from "react-icons/fi";
import { useUserContext } from '../../context/UserContext';
import { saveReport } from '../../services/SaveReportService';
import { set } from 'cypress/types/lodash';


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
    return (
      <Suspense fallback={<div>Loading...</div>}>
        <SummaryComponent />
      </Suspense>
    );
}
function SummaryComponent() {
    const iconClasses = "text-xl text-default-500 pointer-events-none flex-shrink-0";

    const router = useRouter();

    const { summaries } = useUserContext();

    const searchParams = useSearchParams();
    const id = searchParams.get('id') as number | null;

    const [summaryName, setSummaryName] = useState<string>("");
    const [summaryDate, setSummaryDate] = useState<string>("");
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
        if (id) {
          const savedSummary = summaries.filter((res) => res.id == id);
          let summaryData;
          if(savedSummary && savedSummary[0]) {
            summaryData = savedSummary[0].reportData as any;
          }
          if(summaryData) {
            // format timestamp
            const date = new Date(savedSummary[0].savedAt ?? "");
            setSummaryDate(date.toDateString());
            setSummaryName(savedSummary[0].reportName);
            setDomainStatus(summaryData.domainStatus ?? []);
            setDomainErrorStatus(summaryData.domainErrorStatus ?? 0);
            setUnclassifiedUrls(summaryData.industryClassification?.unclassifiedUrls ?? []);
            setIndustries(summaryData.industryClassification?.industryPercentages?.industries ?? []);
            setIndustryPercentages(summaryData.industryClassification?.industryPercentages?.percentages ?? []);
            setWeakClassification(summaryData.industryClassification?.weakClassification ?? []);
            setPercentageMatch(summaryData.domainMatch?.percentageMatch ?? 0);
            setMismatchedUrls(summaryData.domainMatch?.mismatchedUrls ?? []);
            setTotalUrls(summaryData.totalUrls ?? 0);
            setParkedUrls(summaryData.parkedUrls ?? []);
            setscrapableUrls(summaryData.scrapableUrls ?? 0);
            setAvgTime(summaryData.avgTime ?? 0);
          }
        }
    }, [id, summaries]);

    const backToScrapeResults = () => {
        router.back();
    };

    const handleDownload = () => {
        console.log("Download");
    };

    return (
        <div className='min-h-screen p-4'>
            <Button
                className="text-md font-poppins-semibold bg-jungleGreen-700 text-dark-primaryTextColor dark:bg-jungleGreen-400 dark:text-primaryTextColor"
                onClick={backToScrapeResults}
                data-testid="btn-back"
            >
                Back
            </Button>

            <div className="mt-4 mb-8 text-center">
                <h1 className="font-poppins-bold text-4xl text-jungleGreen-800 dark:text-dark-primaryTextColor">
                  {summaryName}
                </h1>
                <h2 className="mt-4 font-poppins-semibold text-xl text-jungleGreen-800 dark:text-dark-primaryTextColor">
                  {summaryDate}
                </h2>
                <div className="mt-4 mr-4 flex justify-end">
                    <Dropdown>
                        <DropdownTrigger>
                            <Button 
                            data-testid="dropdown-export"
                            variant="flat" 
                            startContent={<FiShare className={iconClasses}/>}
                            >
                            Export
                            </Button>
                        </DropdownTrigger>
                          <DropdownMenu variant="flat" aria-label="Dropdown menu with icons" disabledKeys={["save"]}>
                            <DropdownItem
                                key="download"
                                data-testid="dropdown-save"
                                startContent={<FiDownload className={iconClasses}/>}
                                description="Download the report to your device"
                                onAction={handleDownload}
                            >
                                Download
                            </DropdownItem>
                          </DropdownMenu> 
                    </Dropdown>
                </div>
            </div>
            

            {/* General stats */}
            <h3 className="font-poppins-semibold text-2xl text-jungleGreen-700 dark:text-jungleGreen-100 pb-2">
                General stats
            </h3>
            <div className='gap-4 grid sm:grid-cols-3'>

                {/* Scraped stats */}
                <div data-testid="visual-scraped-stats" className='bg-zinc-200 dark:bg-zinc-700 p-4 rounded-xl text-center'>
                    <div className='text-5xl flex justify-center'>
                        <FiSearch />
                    </div>
                    <div className='font-poppins-bold text-6xl text-jungleGreen-800 dark:text-jungleGreen-400 pt-4'>
                        {totalUrls} Urls
                    </div>
                    <div className='font-poppins-semibold text-lg'>
                        Scraped
                    </div>
                </div>

                {/* Crawlable stats */}
                <div data-testid="visual-crawlable-stats" className='bg-zinc-200 dark:bg-zinc-700 p-4 rounded-xl text-center'>
                    <div className='text-5xl flex justify-center'>
                        <FiCheck />
                    </div>
                    <div className='font-poppins-bold text-6xl text-jungleGreen-800 dark:text-jungleGreen-400 pt-4'>
                    {scrapableUrls} Urls
                    </div>
                    <div className='font-poppins-semibold text-lg'>
                        Crawlable
                    </div>
                </div>

                {/* Avg scrape stats */}
                <div data-testid="visual-avg-scrape-stats" className='bg-zinc-200 dark:bg-zinc-700 p-4 rounded-xl text-center'>
                    <div className='text-5xl flex justify-center'>
                        <FiClock />
                    </div>
                    <div className='font-poppins-bold text-6xl text-jungleGreen-800 dark:text-jungleGreen-400 pt-4'>
                    {avgTime} sec
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
            <div data-testid="visual-industry-classification" className='gap-4 grid md:grid-cols-2'>
                <div className='bg-zinc-200 dark:bg-zinc-700 p-4 rounded-xl text-center md:col-span-1 flex flex-col justify-center'>
                    <h3 className="font-poppins-semibold text-lg text-jungleGreen-700 dark:text-jungleGreen-100 mb-4 text-center">
                        Classification Distribution
                        <InfoPopOver 
                            data-testid="popup-industry-classification"
                            heading="Industry classification" 
                            content="The classification of industries is based on machine learning models. WEE cannot guarantee the accuracy of the classifications." 
                            placement="top" 
                        />
                    </h3>

                    <span className='sm:hidden'>
                        <PieChart dataLabel={industries} dataSeries={industryPercentages} legendPosition={"bottom"}/>
                    </span>
                    <span className='hidden sm:block'>
                        <PieChart dataLabel={industries} dataSeries={industryPercentages} legendPosition={"right"}/>
                    </span>
                </div>

                <div className='bg-zinc-200 dark:bg-zinc-700 p-4 rounded-xl md:col-span-1'>
                    <h3 className="font-poppins-semibold text-lg text-jungleGreen-700 dark:text-jungleGreen-100 mb-4 text-center">
                        Weak classifications
                        <InfoPopOver 
                            data-testid="popup-weak-classification"
                            heading="Industry classification" 
                            content="Weak classifications are those that have a low confidence score (below 50%). WEE cannot guarantee the accuracy of the classifications." 
                            placement="top" 
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
                    data-testid="popup-domain-match"
                    heading="Domain Match" 
                    content="Domain match refers to the percentage of URLs that have the same domain classification as the metadata classification. WEE cannot guarantee the accuracy of the classifications." 
                    placement="right-end" 
                />
            </h3>
            <div data-testid="visual-domain-match" className='gap-4 grid md:grid-cols-3'>
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
            <div data-testid="visual-website-status" className='gap-4 grid md:grid-cols-3'>
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
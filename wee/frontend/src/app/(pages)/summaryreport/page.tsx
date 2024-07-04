'use client'
import React, { useEffect, useState } from 'react';
import { PieChart } from '../../components/Graphs';
import { BarChart } from '../../components/Graphs';
import { TableHeader, TableColumn, TableBody, TableRow, TableCell, Button } from "@nextui-org/react";
import { RadialBar } from '../../components/Graphs';
import { useScrapingContext } from '../../context/ScrapingContext';
import { useRouter } from 'next/navigation';
import WEETable from '../../components/Util/Table';
import { FiClock, FiCheck, FiSearch} from "react-icons/fi";
import { InfoPopOver } from '../../components/InfoPopOver';
import { ExportDropdown } from '../../components/ExportDropdown';
import Link from 'next/link';
import jsPDF from 'jspdf';

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

    const handleDownloadReport = () => {
        console.log("Download report triggered");
    
        if (!summaryReport) {
            console.error("Summary report is undefined");
            return;
        }
    
        const doc = new jsPDF();
        
        // Title
        doc.setFontSize(20);
        const title = 'Web Exploration Engine Summary Report';
        const titleWidth = doc.getStringUnitWidth(title) * 20 / doc.internal.scaleFactor;
        const x = (doc.internal.pageSize.width - titleWidth) / 2;
        doc.text(title, x, 20);
      
        // Define table positions and dimensions
        const startY = 30;
        const margin = 14;
        const headerHeight = 10;
        const rowHeight = 10;
        const columnWidth = [60, 190];
        
        // Function to draw a horizontal line
        const drawLine = (lineY: number): void => {
          doc.setDrawColor(200, 200, 200); // Light grey color
          doc.line(0, lineY - 1, margin + columnWidth[0] + columnWidth[1], lineY - 1); 
        };
        
        // Draw Table Header
        const darkTealGreenR = 47; 
        const darkTealGreenG = 139; 
        const darkTealGreenB = 87; 
        doc.setFontSize(14);
        doc.setFillColor(darkTealGreenR, darkTealGreenG, darkTealGreenB); // Set header background color
        doc.rect(0, startY, columnWidth[0] + columnWidth[1], headerHeight, 'F');
        doc.setTextColor(255, 255, 255);
        doc.text('Category', margin + 2, startY + 7);
        doc.text('Information', margin + columnWidth[0] + 2, startY + 7);
      
        // Function to split text into lines that fit within a max width
        const splitText = (text: string, maxWidth: number): string[] => {
          const lines = [];
          let line = '';
          const words = text.split(' ');
      
          for (const word of words) {
            const testLine = line + (line.length > 0 ? ' ' : '') + word;
            const testWidth = doc.getStringUnitWidth(testLine) * 20 / doc.internal.scaleFactor;
      
            if (testWidth > maxWidth) {
              lines.push(line);
              line = word;
            } else {
              line = testLine;
            }
          }
          if (line.length > 0) {
            lines.push(line);
          }
          
          return lines;
        };
      
        // Draw Table Rows
        const rows = [
          ['Total URLs', summaryReport.totalUrls?.toString() || 'N/A'],
          ['Scrapable URLs', summaryReport.scrapableUrls?.toString() || 'N/A'],
          ['Average Time', summaryReport.avgTime?.toString() || 'N/A'],
        ];
      
        let y = startY + headerHeight;
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
      
        rows.forEach(row => {
          const [category, info] = row;
          const categoryLines = splitText(category, columnWidth[0] - 4);
          const infoLines = splitText(info, columnWidth[1] - 4);
          
          categoryLines.forEach((line, i) => {
            doc.text(line, margin + 2, y + (i * rowHeight) + 7);
          });
          infoLines.forEach((line, i) => {
            doc.text(line, margin + columnWidth[0] + 2, y + (i * rowHeight) + 7);
          });
          
          // Draw line after each row
          drawLine(y + Math.max(categoryLines.length, infoLines.length) * rowHeight + 3);
          
          y += Math.max(categoryLines.length, infoLines.length) * rowHeight;
          
          if (y > 270) { // Check if the y position exceeds the page limit
            doc.addPage();
            y = 20; // Reset y position on the new page
            doc.text('Category', margin + 2, y + 7);
            doc.text('Information', margin + columnWidth[0] + 2, y + 7);
            y += headerHeight;
          }
        });
      
        // Clean Filename
        const cleanFilename = (url: string | null): string => {
          if (!url) return 'website-summary-report';
          let filename = url.replace('http://', '').replace('https://', '');
          filename = filename.split('').map(char => {
            return ['/', ':', '*', '?', '"', '<', '>', '|'].includes(char) ? '_' : char;
          }).join('');
          return filename.length > 50 ? filename.substring(0, 50) : filename;
        };
      
        doc.save(`website-summary-report.pdf`);
    };
    

    return (
        <div className='min-h-screen p-4'>
            <Button
                className="text-md font-poppins-semibold bg-jungleGreen-700 text-dark-primaryTextColor dark:bg-jungleGreen-400 dark:text-primaryTextColor"
                onClick={backToScrapeResults}
            >
                Back
            </Button>

            <div className="mt-4 mb-8 text-center">
                <h1 className="font-poppins-bold text-4xl text-jungleGreen-800 dark:text-dark-primaryTextColor">
                    Summary Report
                </h1>
                <div className="mt-4 mr-4 flex justify-end">
                    <ExportDropdown onDownloadReport={handleDownloadReport} />
                </div>
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
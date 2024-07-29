'use client'
import React, { useEffect, useState } from 'react';
import { PieChart } from '../../components/Graphs';
import { BarChart } from '../../components/Graphs';
import { 
    TableHeader, TableColumn, TableBody, TableRow, TableCell, 
    Button,
    Dropdown, DropdownItem, DropdownMenu, DropdownTrigger,
    Modal, ModalContent, ModalBody, useDisclosure, Input, ModalFooter,
} from "@nextui-org/react";
import { RadialBar } from '../../components/Graphs';
import { useScrapingContext } from '../../context/ScrapingContext';
import { useRouter } from 'next/navigation';
import WEETable from '../../components/Util/Table';
import { FiClock, FiCheck, FiSearch} from "react-icons/fi";
import { InfoPopOver } from '../../components/InfoPopOver';
import Link from 'next/link';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';import { FiShare, FiDownload, FiSave } from "react-icons/fi";
import { useUserContext } from '../../context/UserContext';
import { saveReport } from '../../services/SaveReportService';
import { RadarChart } from '../../components/Graphs/RadarChart';

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

interface RadarInterface {
    categories: string[],
    series: RadarSeries[]
}

export interface RadarSeries {
    name: string,
    data: number[]
}

export default function SummaryReport() {
    const iconClasses = "text-xl text-default-500 pointer-events-none flex-shrink-0";

    const router = useRouter();

    const { summaryReport } = useScrapingContext();
    const { user } = useUserContext();

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
    const [metaRadar, setMetaRadar] = useState<RadarInterface>();
    const [domainRadar, setDomainRadar] = useState<RadarInterface>();
   
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
            setMetaRadar(summaryReport.metaRadar ?? {categories: [], series: []});
            setDomainRadar(summaryReport.domainRadar ?? {categories: [], series: []});
        }

    }, [summaryReport]);

    const backToScrapeResults = () => {
        router.back();
    };

    // Save and Download Logic
    const [reportName, setReportName] = useState('');
    const [isInvalid, setIsInvalid] = useState(false);
    const [isDisabled, setIsDisabled] = useState(true);
    const {isOpen, onOpenChange} = useDisclosure();
    const { isOpen: isSuccessOpen, onOpenChange: onSuccessOpenChange } = useDisclosure();

    const handleInputChange = (e: { target: { value: React.SetStateAction<string>; }; }) => {
        setReportName(e.target.value);
        if(e.target.value.length > 0) {
          setIsInvalid(false);
          setIsDisabled(false);
        }
        else {
          setIsInvalid(true);
          setIsDisabled(true);
        }
    };

    const handleSave = async (reportName: string) => {
        if (summaryReport) {
            try {
                await saveReport({
                reportName,
                reportData: summaryReport,
                userId: user?.uuid,
                isSummary: true,
                });
                onOpenChange();
                // report saved successfully popup
                onSuccessOpenChange();
            } catch (error) {
                console.error("Error saving report:", error);
            }
        }
    };

    // clear the input field when the modal is closed
    useEffect(() => {
        if (!isOpen) {
          setReportName('');
          setIsInvalid(false);
          setIsDisabled(true);
        }
    }, [isOpen]);


    const handleDownloadReport = async () => {
        if (!summaryReport) {
            console.error("Summary report is undefined");
            return;
        }
    
        const doc = new jsPDF();
        let currentPage = 1;
    
        // Function to add page number to the footer
        const addPageNumber = (pageNumber: number) => {
            doc.setFontSize(10);
            doc.text(`Page ${pageNumber-1}`, doc.internal.pageSize.width - 30, doc.internal.pageSize.height - 10);
        };
    
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
            doc.setDrawColor(200, 200, 200); // Set line color to light grey
            doc.line(0, lineY - 1, margin + columnWidth[0] + columnWidth[1], lineY - 1); // Draw horizontal line
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
            ['Average Time',  `${summaryReport.avgTime?.toString() || 'N/A'} seconds`],
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
                addPageNumber(++currentPage); // Add page number before the new content
                y = 20; // Reset y position on the new page
                doc.text('Category', margin + 2, y + 7);
                doc.text('Information', margin + columnWidth[0] + 2, y + 7);
                y += headerHeight;
            }
        });
    
        // Add page number to the last page
        addPageNumber(++currentPage);
    
        // Function to add chart to PDF
        const addChartToPDF = async () => {
            const captureChart = async (chartId: string, title: string, yPosition: number) => {
                const chartElement = document.getElementById(chartId);
                if (chartElement) {
                    const canvas = await html2canvas(chartElement);
                    const imgData = canvas.toDataURL('image/png');
                    doc.addPage();
                    addPageNumber(++currentPage); // Add page number before the new content
                    doc.setFontSize(18);
                    doc.text(title, 20, 20);
        
                    // Calculate image dimensions based on aspect ratio
                    const width = doc.internal.pageSize.width - 40; // Adjust as needed
                    const height = canvas.height * (width / canvas.width);
        
                    doc.addImage(imgData, 'PNG', 20, yPosition, width, height);
    
                }
            };
        
            // Example usage
            await captureChart('pie-chart', 'Industry Classification Distribution', 30);
            // Add list of low confidence URLs
            if (weakClassification && weakClassification.length > 0) {
                const lowConfidenceUrls = weakClassification
                    .filter(item => item.score < 0.5) // Adjust threshold as needed
                    .map(item => item.url);
        
                if (lowConfidenceUrls.length > 0) {
                    doc.addPage();
                    addPageNumber(++currentPage); // Add page number before the new content
                    doc.setFontSize(18);
                    doc.text('Low Confidence URLs (Confidence Score < 50%)', 20, 20);
                    doc.setFontSize(12);
                    lowConfidenceUrls.forEach((url, index) => {
                        const y = 30 + index * 10; // Adjust as needed for spacing
                        doc.text(`${index + 1}. ${url}`, 20, y);
                    });
                }
            }

            await captureChart('bar-chart', 'Website Status Distribution', 30);
            if (parkedUrls && parkedUrls.length > 0) {
                doc.addPage();
                addPageNumber(++currentPage); // Add page number before the new content
                doc.setFontSize(12);
                doc.text('Parked URLs', 20, 20);
        
                parkedUrls.forEach((url, index) => {
                    const y = 30 + index * 10; // Adjust as needed for spacing
                    doc.text(`${index + 1}. ${url}`, 20, y);
                });
            }


            await captureChart('radial-chart', 'Domain Match Distribution', 30);
             // Add list of mismatched URLs
             if (mismatchedUrls && mismatchedUrls.length > 0) {
                doc.addPage();
                addPageNumber(++currentPage); // Add page number before the new content
                doc.setFontSize(12);
                doc.text('Mismatched URLs', 20, 20);
        
                mismatchedUrls.forEach((item, index) => {
                    const startY = 30;
                    const lineHeight = 10; // Line height for each item
                    const maxLinesPerPage = Math.floor((doc.internal.pageSize.height - startY) / lineHeight); // Calculate max lines per page
                    const lines: string[] | undefined = doc.splitTextToSize(`${index + 1}. ${item.url} - Meta: ${item.metadataClass}, Domain: ${item.domainClass}`, doc.internal.pageSize.width - 40);
                
                    if (lines) {
                        if (index > 0 && (startY + lines.length * lineHeight) > doc.internal.pageSize.height - 20) {
                            doc.addPage();
                            addPageNumber(++currentPage);
                            doc.setFontSize(12);
                            doc.text('Mismatched URLs (Continued)', 20, 20);
                        }
                
                        lines.forEach((line: string, i: number) => {
                            const y: number = startY + i * lineHeight;
                            doc.text(line, 20, y);
                        });
                    } else {
                        console.error('splitTextToSize returned undefined for item:', item);
                    }
                });
                
            }
        
            // Save the PDF
            doc.save('website-summary-report.pdf');
        };        
    
        // Add charts and save the PDF
        await addChartToPDF();
        doc.save('website-summary-report.pdf');
    };

    return (
        <>
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
                        <Dropdown>
                            <DropdownTrigger>
                                <Button 
                                variant="flat" 
                                startContent={<FiShare className={iconClasses}/>}
                                >
                                Export/Save
                                </Button>
                            </DropdownTrigger>
                            {user ? (
                                <DropdownMenu variant="flat" aria-label="Dropdown menu with icons">
                                <DropdownItem
                                    key="save"
                                    startContent={<FiSave className={iconClasses}/>}
                                    description="Save the report on our website"
                                    onAction={onOpenChange}
                                    data-testid="save-report-button"
                                >
                                    Save
                                </DropdownItem>
                                <DropdownItem
                                    key="download"
                                    startContent={<FiDownload className={iconClasses}/>}
                                    description="Download the report to your device"
                                    onAction={handleDownloadReport}
                                    data-testid="download-report-button"
                                >
                                    Download
                                </DropdownItem>
                                </DropdownMenu> 
                            ) : (
                                <DropdownMenu variant="flat" aria-label="Dropdown menu with icons" disabledKeys={["save"]}>
                                <DropdownItem
                                    key="save"
                                    startContent={<FiSave className={iconClasses}/>}
                                    description="Sign up or log in to save the report on our website"
                                >
                                    Save
                                </DropdownItem>
                                <DropdownItem
                                    key="download"
                                    startContent={<FiDownload className={iconClasses}/>}
                                    description="Download the report to your device"
                                    onAction={handleDownloadReport}
                                    data-testid="download-report-button"
                                >
                                    Download
                                </DropdownItem>
                                </DropdownMenu> 
                            )}
                        </Dropdown>
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
                    <div id="pie-chart" className='bg-zinc-200 dark:bg-zinc-700 p-4 rounded-xl text-center md:col-span-1 flex flex-col justify-center'>
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
                <div id="radial-chart" className='bg-zinc-200 dark:bg-zinc-700 p-4 rounded-xl text-center md:col-span-1 flex flex-col justify-center'>
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

            {/* Classification Distribution */}
            <h3 className="font-poppins-semibold text-2xl text-jungleGreen-700 dark:text-jungleGreen-100 pb-2 mt-10">
                Industry Classification Distribution
                <InfoPopOver 
                    heading="Industry Classification Distribution" 
                    content="Our Industry Classification Distribution relies on a zeroshot machine learning model. WEE cannot guarantee the accuracy of the classifications." 
                    placement="right-end" 
                />
            </h3>
            <div className='gap-4 grid md:grid-cols-2'>
                <div className='bg-zinc-200 dark:bg-zinc-700 p-4 rounded-xl md:col-span-1'>
                    <h3 className="font-poppins-semibold text-lg text-jungleGreen-700 dark:text-jungleGreen-100 mb-4 text-center">
                        Metadata
                    </h3>
                    {metaRadar && metaRadar.categories.length > 0 && metaRadar.series.length > 0 ? (
                        <RadarChart radarCategories={metaRadar.categories} radarSeries={metaRadar.series} />
                    ) : (<></>)}
                </div>
                <div className='bg-zinc-200 dark:bg-zinc-700 p-4 rounded-xl md:col-span-1'>
                    <h3 className="font-poppins-semibold text-lg text-jungleGreen-700 dark:text-jungleGreen-100 mb-4 text-center">
                        Domain
                    </h3>
                    {domainRadar && domainRadar.categories.length > 0 && domainRadar.series.length > 0 ? (
                        <RadarChart radarCategories={domainRadar.categories} radarSeries={domainRadar.series} />
                    ) : (<></>)}
                </div>
            </div>

            {/* Website status */}
            <h3 className="font-poppins-semibold text-2xl text-jungleGreen-700 dark:text-jungleGreen-100 pb-2 mt-10">
                Website status
            </h3>
            <div className='gap-4 grid md:grid-cols-3'>
                <div id="bar-chart" className='bg-zinc-200 dark:bg-zinc-700 p-4 rounded-xl text-center md:col-span-2 flex flex-col justify-center'>
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

        {/* Confirm save */}
      <Modal 
        isOpen={isOpen} 
        onOpenChange={onOpenChange}
        placement="top-center"
        data-testid="save-report-modal"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalBody>
                <h1 className="text-center my-4 font-poppins-bold text-2xl text-jungleGreen-800 dark:text-dark-primaryTextColor">
                    Save Report
                </h1>
                <Input
                  autoFocus
                  label="Report Name"
                  placeholder="Enter a name for the report"
                  variant="bordered"
                  isInvalid={isInvalid}
                  color={isInvalid ? "danger" : "default"}
                  errorMessage="Please provide a report name"
                  value={reportName}
                  onChange={handleInputChange}
                />
              </ModalBody>
              <ModalFooter>
                <Button className="text-md font-poppins-semibold bg-jungleGreen-700 text-dark-primaryTextColor dark:bg-jungleGreen-400 dark:text-primaryTextColor" onPress={onClose}>
                  Close
                </Button>
                <Button 
                  className="text-md font-poppins-semibold bg-jungleGreen-700 text-dark-primaryTextColor dark:bg-jungleGreen-400 dark:text-primaryTextColor" 
                  onPress={() => handleSave(reportName)}
                  disabled={isDisabled}
                  >
                  Save
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

       {/* successfull save */}
       <Modal isOpen={isSuccessOpen} onOpenChange={onSuccessOpenChange} className="font-poppins-regular">
          <ModalContent>
              <ModalBody>
                  <h1 className="text-center my-4 font-poppins-bold text-2xl text-jungleGreen-800 dark:text-dark-primaryTextColor">
                      Report saved successfully
                  </h1>
              </ModalBody>
          </ModalContent>
      </Modal>
        </>
    );
} 
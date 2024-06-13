'use client'
import React, { useEffect, Suspense } from 'react';
import { FiSearch } from "react-icons/fi";
import { SelectItem } from "@nextui-org/react";
import { useSearchParams } from 'next/navigation';
import WEEInput from '../../components/Util/Input';
import WEESelect from '../../components/Util/Select';
import WEEPagination from '../../components/Util/Pagination';
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Chip, Button } from "@nextui-org/react";
import { useRouter } from 'next/navigation';
import Link from 'next/link'
import WEETable from '../../components/Util/Table';

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

    const [searchValue, setSearchValue] = React.useState("");
    const hasSearchFilter = Boolean(searchValue);

    const filteredItems = React.useMemo(() => {
        let filteredUrls = [...decodedUrls];

        if (hasSearchFilter) {
            filteredUrls = filteredUrls.filter((url) =>
                url.toLowerCase().includes(searchValue.toLowerCase()),
            );
        }
    
        return filteredUrls;
      }, [decodedUrls, searchValue]);
    
    const router = useRouter();

    const handleResultPage = (url:string, status:boolean, crawlable:boolean) => {
        router.push(`/results?url=${encodeURIComponent(url)}&websiteStatus=${encodeURIComponent(status)}&isCrawlable=${encodeURIComponent(crawlable)}`);
    };
    
    // arrays that holds results returned from API
    const [isCrawlable, setIsCrawlable] =  React.useState<CrawlableStatus>({});
    const [websiteStatus, setWebsiteStatus] = React.useState<boolean[]>([]);
    const [industryClassification, setIndustryClassification] = React.useState<Industry[]>([]);
    
    // Pagination
    const [page, setPage] = React.useState(1);
    const [resultsPerPage, setResultsPerPage] = React.useState(5);
    const pages = Math.ceil(filteredItems.length/resultsPerPage);
    
    const handleResultsPerPageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const newResultsPerPage = parseInt(event.target.value, 10);
        setResultsPerPage(newResultsPerPage);
        setPage(1);
    };

    const items = React.useMemo(() => {
        const start = (page - 1) * resultsPerPage;
        const end = start + resultsPerPage;

        return filteredItems.slice(start,end);
    }, [page, filteredItems, resultsPerPage])

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

    const onSearchChange = (value: string) => {
        if (value) {
          setSearchValue(value);
          setPage(1);
        } else {
          setSearchValue("");
        }
    };

    const handleSummaryPage = () => {
        router.push(`/summaryreport`);
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
                    value={searchValue}
                    onValueChange={onSearchChange}
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

            <div className="flex justify-between items-center mb-2">
                <span className="text-default-400 text-small">Total {filteredItems.length} results</span>
                <label className="flex items-center text-default-400 text-small">
                    Results per page:
                    <select
                        value={resultsPerPage}
                        className="bg-transparent outline-none text-default-400 text-small"
                        onChange={handleResultsPerPageChange}
                        aria-label="Number of results per page" 
                    >
                        <option value="2">2</option>
                        <option value="5">5</option>
                        <option value="7">7</option>
                        <option value="9">9</option>
                    </select>
                </label>
            </div>

            <WEETable 
                aria-label="Scrape result table"
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
                    <TableColumn key="name" className='rounded-lg sm:rounded-none'>
                        URL
                    </TableColumn>
                    <TableColumn key="role" className='text-center hidden sm:table-cell'>
                        CRAWLABLE
                    </TableColumn>
                    <TableColumn key="status" className='text-center hidden sm:table-cell'>
                        RESULT &amp; REPORT
                    </TableColumn>
                </TableHeader>

                <TableBody>
                    {items.map((item, index) => (
                        <TableRow key={index}>
                            <TableCell>
                                <Link href={`/results?url=${encodeURIComponent(item)}&websiteStatus=${encodeURIComponent(websiteStatus[index])}&isCrawlable=${encodeURIComponent(isCrawlable[item])}`}>                               
                                    {item}
                                </Link>
                            </TableCell>
                            <TableCell className='text-center hidden sm:table-cell'>
                                <Chip radius="sm" color={isCrawlable[item]? 'success' : 'warning'} variant="flat">{isCrawlable[item] ? 'Yes' : 'No'}</Chip>
                            </TableCell>
                            <TableCell className='text-center hidden sm:table-cell'>
                                <Button className="font-poppins-semibold bg-jungleGreen-700 text-dark-primaryTextColor dark:bg-jungleGreen-400 dark:text-primaryTextColor"
                                   onClick={() => handleResultPage(item, websiteStatus[index], isCrawlable[item])}
                                >
                                    View
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </WEETable>

            <h1 className="my-4 mt-6 font-poppins-bold text-2xl text-jungleGreen-800 dark:text-dark-primaryTextColor">
                Summary
            </h1>
            <Button 
                className="text-md font-poppins-semibold bg-jungleGreen-700 text-dark-primaryTextColor dark:bg-jungleGreen-400 dark:text-primaryTextColor"
                onClick={handleSummaryPage}
            >
                View overall summary report
            </Button>

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
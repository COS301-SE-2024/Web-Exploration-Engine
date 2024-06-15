'use client';
import React, { useEffect, useState, Suspense } from 'react';
import { Card, CardBody, Image } from "@nextui-org/react";
import { Button, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@nextui-org/react";
import { Chip } from "@nextui-org/react";
import { useSearchParams } from 'next/navigation';
import WEETable from '../../components/Util/Table';
import { useRouter } from 'next/navigation';
import { useScrapingContext } from '../../context/ScrapingContext';

interface Classifications {
    label: string;
    score: number;
}

export default function Results() {
    return (
      <Suspense fallback={<div>Loading...</div>}>
        <ResultsComponent />
      </Suspense>
    )
}

function ResultsComponent() {
    const searchParams = useSearchParams();
    const url = searchParams.get('url');
    const {urls, setUrls, results, setResults} = useScrapingContext();

    const router = useRouter();
    // const websiteStatusUrl = searchParams.get('websiteStatus');
    // const isCrawlableUrl = searchParams.get('isCrawlable');
    // const industryUrl = searchParams.get('industry');
    const [websiteStatus, setWebsiteStatus] = useState('');
    const [isCrawlable, setIsCrawlable] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [industryClassification, setIndustryClassification] = useState<Classifications>();
    const [domainClassification, setDomainClassification] = useState<Classifications>();
    const [logo, setLogo] = useState('');
    const [imageList, setImageList] = useState<string[]>([]);

    useEffect(() => {
        if (url) {
            console.log('URL on the individual report page', url);
            const urlResults = results.filter((res) => res.url === url);
            console.log('URL RESULTS TO DISPLAY', urlResults);
            if (urlResults && urlResults[0]) {
                setIsCrawlable(urlResults[0].robots.isUrlScrapable)
                setWebsiteStatus(urlResults[0].domainStatus);
                setLogo(urlResults[0].logo);
                setImageList(urlResults[0].images);
                setIndustryClassification(urlResults[0].industryClassification.metadataClass);
                setDomainClassification(urlResults[0].industryClassification.domainClass);
            }
        }
    }, [url]);

    // const fetchLogo = async (url: string) => {
    //     try {
    //         const response = await fetch(`http://localhost:3000/api/scrapeLogos?url=${encodeURIComponent(url)}`);
    //         setLogo(await response.text());
    //     } catch (error) {
    //         console.error('Error fetching logo:', error);
    //     } 
    // }

    // const fetchImages = async (url: string) => {
    //     try {
    //         const response = await fetch(`http://localhost:3000/api/scrapeImages?url=${encodeURIComponent(url)}`);
    //         const data = await response.json();
    //         console.log(data);
    //         setImageList(data);
    //     } catch (error) {
    //         console.error('Error fetching images:', error);
    //     } finally { 
    //         setIsLoading(false);
    //     }
    // }

    const backToScrapeResults = () => {
        router.push(`/scraperesults`);
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
        <div className='min-h-screen p-4'>
            <Button 
                className="text-md font-poppins-semibold bg-jungleGreen-700 text-dark-primaryTextColor dark:bg-jungleGreen-400 dark:text-primaryTextColor"
                onClick={backToScrapeResults}
            >
                Back
            </Button>

            <div className="mb-8 text-center">
                <h1 className="mt-4 font-poppins-bold text-2xl text-jungleGreen-800 dark:text-dark-primaryTextColor">
                    Results of {url}
                </h1>
            </div>

            <div className='py-3'>
                <h3 className="font-poppins-semibold text-lg text-jungleGreen-700 dark:text-jungleGreen-100 pb-2">
                    General overview
                </h3>
                <WEETable isStriped aria-label="Example static collection table">
                    <TableHeader>
                        <TableColumn>SCRAPING CATEGORY</TableColumn>
                        <TableColumn>INFORMATION</TableColumn>
                    </TableHeader>
                    <TableBody>
                        <TableRow key="1">
                            <TableCell>Crawlable</TableCell>
                            <TableCell>
                                <Chip radius="sm" color={isCrawlable === true ? 'success' : 'warning'} variant="flat">{isCrawlable === true ? 'Yes' : 'No'}</Chip>
                            </TableCell>
                        </TableRow>
                        <TableRow key="2">
                            <TableCell>Status</TableCell>
                            <TableCell>
                                <Chip radius="sm" color={websiteStatus === 'live' ? 'success' : 'warning'} variant="flat">{websiteStatus === 'true' ? 'Live' : 'Parked'}</Chip>
                            </TableCell>
                        </TableRow>
                        <TableRow key="3">
                            <TableCell>Industry</TableCell>
                            <TableCell>
                                <Chip radius="sm" color="secondary" variant="flat">
                                    {isCrawlable ? `${industryClassification?.label} - ${industryClassification?.score}` : 'N/A'}
                                </Chip>                            
                            </TableCell>
                        </TableRow>
                        <TableRow key="4">
                            <TableCell>Domain</TableCell>
                            <TableCell>
                                <Chip radius="sm" color="secondary" variant="flat">
                                    {isCrawlable ? `${domainClassification?.label} - ${domainClassification?.score}` : 'N/A'}
                                </Chip>   
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </WEETable>
            </div>

            {logo && (
            <div className='py-3'>
                <h3 className="font-poppins-semibold text-lg text-jungleGreen-700 dark:text-jungleGreen-100 pb-2">
                    Logo
                </h3>
                <div className="gap-2 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5">
                    <Card shadow="sm">
                        <CardBody className="overflow-visible p-0">
                            <Image
                                shadow="sm"
                                radius="lg"
                                width="100%"
                                alt={"Logo"}
                                className="w-full object-cover h-[140px]"
                                src={logo}
                            />
                        </CardBody>
                    </Card>
                </div>
            </div>
            )}
            {!logo && (
                <p className='p-4 rounded-lg mb-2 bg-zinc-200 dark:bg-zinc-700'>No logo available.</p>
            )}

            {imageList.length > 0 && (
                    <div className='py-3'>
                        <h3 className="font-poppins-semibold text-lg text-jungleGreen-700 dark:text-jungleGreen-100 pb-2">
                            Images
                        </h3>
                        <div className="gap-2 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5">
                            {imageList.map((item, index) => (
                                <Card shadow="sm" key={index} >
                                    <CardBody className="overflow-visible p-0">
                                        <Image
                                            shadow="sm"
                                            radius="lg"
                                            width="100%"
                                            alt={"Image"}
                                            className="w-full object-cover h-[140px]"
                                            src={item}
                                        />
                                    </CardBody>
                                </Card>
                            ))}
                        </div>
                    </div>
            )}

            {imageList.length === 0 && (
                <p className='p-4 rounded-lg mb-2 bg-zinc-200 dark:bg-zinc-700'>No images available.</p>
            )}

        </div>
    )
}

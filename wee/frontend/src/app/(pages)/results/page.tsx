'use client';
import React, { useEffect, useState, Suspense } from 'react';
import { Card, CardBody, Image } from "@nextui-org/react";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@nextui-org/react";
import { Chip } from "@nextui-org/react";
import { useSearchParams } from 'next/navigation';
import { IndustryClassification } from '../../models/IndustryModel';

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
    const [websiteStatus, setWebsiteStatus] = useState('');
    const [isCrawlable, setIsCrawlable] = useState('No');
    const [isLoading, setIsLoading] = useState(true);
    const [industryClassification, setIndustryClassification] = useState('');
    const [logo, setLogo] = useState('');
    const [imageList, setImageList] = useState([]);

    useEffect(() => {
        if (url) {
            // Fetch website status when component mounts or URL changes
            fetchIsCrawlingAllowed(url);
            fetchWebsiteStatus(url);
            fetchIndustryClassifications(url);
            fetchLogo(url);
            fetchImages(url);
        }
    }, [url]);

    const fetchIsCrawlingAllowed = async (url: string) => {
        try {
            const response = await fetch(`http://localhost:3000/api/isCrawlingAllowed?url=${encodeURIComponent(url)}`);
            const data = await response.json();
            console.log(data);
            if (data == true) {
                setIsCrawlable('Yes');
            }
            else {
                setIsCrawlable('No');
            }
        }
        catch (error) {
            console.error('Error fetching whether website is crawlable:', error);
            setIsCrawlable('Unknown')
        }
    }

    const fetchWebsiteStatus = async (url: string) => {
        try {
            const response = await fetch(`http://localhost:3000/api/status?url=${encodeURIComponent(url)}`);
            const data = await response.json();
            if (data === false) {
                setWebsiteStatus('Parked');
            } else {
                setWebsiteStatus('Live');
            }
        } catch (error) {
            console.error('Error fetching website status:', error);
            setWebsiteStatus('Unknown');
        } 
    };

    const fetchIndustryClassifications = async (url: string) => {
        try {
          const response = await fetch(`http://localhost:3000/api/scrapeIndustry?url=${encodeURIComponent(url)}`);
          const data = await response.json() as IndustryClassification;
          setIndustryClassification(data.industry);
        } catch (error) {
          console.error('Error fetching industry classifications:', error);
        }
    };

    const fetchLogo = async (url: string) => {
        try {
            const response = await fetch(`http://localhost:3000/api/scrapeLogos?url=${encodeURIComponent(url)}`);
            setLogo(await response.text());
        } catch (error) {
            console.error('Error fetching logo:', error);
        } 
    }

    const fetchImages = async (url: string) => {
        try {
            const response = await fetch(`http://localhost:3000/api/scrapeImages?url=${encodeURIComponent(url)}`);
            const data = await response.json();
            console.log(data);
            setImageList(data);
        } catch (error) {
            console.error('Error fetching images:', error);
        } finally { 
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
    
    return (
        <div className='min-h-screen p-4'>
            <div className="mb-8 text-center">
                <h1 className="mt-4 font-poppins-bold text-2xl text-jungleGreen-800 dark:text-dark-primaryTextColor">
                    Results
                </h1>
            </div>

            <div className='py-3'>
                <h3 className="font-poppins-semibold text-lg text-jungleGreen-700 dark:text-jungleGreen-100 pb-2">
                    General overview
                </h3>
                <Table isStriped aria-label="Example static collection table">
                    <TableHeader>
                        <TableColumn>SCRAPING CATEGORY</TableColumn>
                        <TableColumn>INFORMATION</TableColumn>
                    </TableHeader>
                    <TableBody>
                        <TableRow key="1">
                            <TableCell>Crawlable</TableCell>
                            <TableCell>
                                <Chip radius="sm" color={isCrawlable === 'Yes' ? 'success' : 'warning'} variant="flat">{isCrawlable}</Chip>
                            </TableCell>
                        </TableRow>
                        <TableRow key="2">
                            <TableCell>Status</TableCell>
                            <TableCell>
                                <Chip radius="sm" color={websiteStatus === 'Live' ? 'success' : 'warning'} variant="flat">{websiteStatus}</Chip>
                            </TableCell>
                        </TableRow>
                        <TableRow key="3">
                            <TableCell>Industry</TableCell>
                            <TableCell>
                                <Chip radius="sm" color="secondary" variant="flat">{isCrawlable == "Yes" ? industryClassification : 'N/A'}</Chip>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
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

'use client'
import React, { useEffect, useState } from 'react';
import { PieChart } from '../../components/Graphs';
import { BarChart } from '../../components/Graphs';
import { RadialBar } from '../../components/Graphs';
import { useScrapingContext } from '../../context/ScrapingContext';

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

    return (
        <div className='min-h-screen p-4'>
            <div className="mb-8 text-center">
                <h1 className="mt-4 font-poppins-bold text-2xl text-jungleGreen-800 dark:text-dark-primaryTextColor">
                    Scraping Dashboard/Summary
                </h1>
            </div>
            <div className='gap-4 grid md:grid-cols-2'>
                <div className='bg-zinc-200 dark:bg-zinc-700 p-4 rounded-xl text-center'>
                    <h3 className="font-poppins-semibold text-lg text-jungleGreen-700 dark:text-jungleGreen-100 mb-4">
                        Industry classification
                    </h3>
                    <PieChart dataLabel={industries} dataSeries={industryPercentages}/>
                </div>
                <div className='bg-zinc-200 dark:bg-zinc-700 p-4 rounded-xl text-center'>
                    <h3 className="font-poppins-semibold text-lg text-jungleGreen-700 dark:text-jungleGreen-100 mb-4">
                        Live/Parked Status
                    </h3>
                    <BarChart dataLabel={['Live', 'Parked']} dataSeries={domainStatus}/> 
                </div>
                <div className='bg-zinc-200 dark:bg-zinc-700 p-4 rounded-xl text-center'>
                    <h3 className="font-poppins-semibold text-lg text-jungleGreen-700 dark:text-jungleGreen-100 mb-4">
                        Domain watch/match
                    </h3>
                    <RadialBar dataLabel={['Match']} dataSeries={[percentageMatch]}/>
                </div>
            </div>
        </div>
    );
}
import React from 'react';
import {Card, CardBody, CardFooter, Button} from "@nextui-org/react";
import { useRouter } from 'next/navigation';

interface ScrapeResultCardProps {
    url: string,
    isCrawlable: boolean,
    websiteStatus: boolean,
    industryClassification: string,
}

export default function ScrapeResultsCard(props: ScrapeResultCardProps) {
    const router = useRouter();

    const handleResultPage = () => {
        router.push(`/results?url=${encodeURIComponent(props.url)}&websiteStatus=${encodeURIComponent(props.websiteStatus)}&isCrawlable=${encodeURIComponent(props.isCrawlable)}&industry=${encodeURIComponent(props.industryClassification)}`)
    };

    return (
        <Card>
            <CardBody>
                <p>URL: {props.url}</p>
                <p>Industry: {props.industryClassification}</p>
                {props.isCrawlable ? <p>isCrawlable: True</p> : <p>isCrawlable: False</p>}                
                {props.websiteStatus ? <p>websiteStatus: True</p> : <p>websiteStatus: False</p>}                
            </CardBody>
            <CardFooter>
                <Button className="w-full m-auto font-poppins-semibold text-lg bg-jungleGreen-700 text-dark-primaryTextColor dark:bg-jungleGreen-400 dark:text-primaryTextColor"
                    onClick={handleResultPage}
                >
                    View Results &amp; Report
                </Button>
            </CardFooter>
        </Card>
    )
};
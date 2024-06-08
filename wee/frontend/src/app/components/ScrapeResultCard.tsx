import React from 'react';
import {Card, CardBody, CardFooter, Button} from "@nextui-org/react";

interface ScrapeResultCardProps {
    url: string
}

export default function ScrapeResultsCard(props: ScrapeResultCardProps) {
    return (
        <Card>
            <CardBody>
                <p>{props.url}</p>
            </CardBody>
            <CardFooter>
                <Button className="w-full m-auto font-poppins-semibold text-lg bg-jungleGreen-700 text-dark-primaryTextColor dark:bg-jungleGreen-400 dark:text-primaryTextColor"
                >
                    View Results &amp; Report
                </Button>
            </CardFooter>
        </Card>
    )
};
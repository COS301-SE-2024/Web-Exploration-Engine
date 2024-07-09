'use client';
import React, { useEffect } from "react";
import WEETable from '../../components/Util/Table';
import WEESelect from "../../components/Util/Select";
import { Button, Chip, TableHeader, TableColumn, TableBody, TableRow, TableCell, SelectItem } from '@nextui-org/react';
import { useScrapingContext } from '../../context/ScrapingContext';
import { useRouter } from 'next/navigation';

export default function ComparisonReport() {
    const { results, comparisonIndexes } = useScrapingContext();
    const router = useRouter();

    useEffect(() => {
        console.log('COMPARISON', results, comparisonIndexes);
        console.log(results[comparisonIndexes[0]]);
        console.log(results[comparisonIndexes[1]]);
    }, []);

    const backToScrapeResults = () => {
        router.push(`/scraperesults`);
    };

    return (
        <div className="min-h-screen p-4"> 
            <Button
                className="text-md font-poppins-semibold bg-jungleGreen-700 text-dark-primaryTextColor dark:bg-jungleGreen-400 dark:text-primaryTextColor"
                onClick={backToScrapeResults}
            >
                Back
            </Button>
            <div className="mb-8 text-center">
                <h1 className="mt-4 font-poppins-bold text-2xl text-jungleGreen-800 dark:text-dark-primaryTextColor">
                    Website Comparison
                </h1>
            </div>

            <div>
                <WEESelect
                    label="Website 1"
                    className="w-1/2 pr-3 pb-3"
                >
                    {results.map((item, index) => (
                        <SelectItem key={index}>{item.url}</SelectItem>
                    ))}
                </WEESelect>

                <WEESelect
                    label="Website 2"
                    className="w-1/2 pl-3 pb-3"
                >
                    {results.map((item, index) => (
                        <SelectItem key={index}>{item.url}</SelectItem>
                    ))}
                </WEESelect>
            </div>

            <WEETable isStriped aria-label="Example static collection table">
                <TableHeader>
                    <TableColumn>WEBSITE 1</TableColumn>
                    <TableColumn>WEBSITE 2</TableColumn>
                </TableHeader>
                <TableBody>
                    <TableRow key="1">
                        <TableCell>abc</TableCell>
                        <TableCell>abc</TableCell>
                    </TableRow>
                    <TableRow key="2">
                        <TableCell>abc</TableCell>
                        <TableCell>abc</TableCell>
                    </TableRow>
                    <TableRow key="3">
                        <TableCell>abc</TableCell>
                        <TableCell>abc</TableCell>
                    </TableRow>
                    <TableRow key="4">
                        <TableCell>abc</TableCell>
                        <TableCell>abc</TableCell>
                    </TableRow>
                </TableBody>
            </WEETable>
        </div>
    );
}
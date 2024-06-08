import React from 'react';
import { Input } from "@nextui-org/react";
import { FiSearch } from "react-icons/fi";
import {Pagination} from "@nextui-org/react";
import ScrapeResultsCard from '../../components/ScrapeResultCard';

export default function ScrapeResults() {
    return (
        <div className='p-4'>
            <div className='flex justify-center'>
                <Input
                    type="text"
                    placeholder="https://www.takealot.com/"
                    labelPlacement="outside"
                    className="py-3 sm:pr-3 w-full md:w-4/5 md:px-5"
                    startContent={
                        <FiSearch className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                    } 
                />
            </div>

            <div className="gap-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                <ScrapeResultsCard url='https://www.takealot.com/'/>
                <ScrapeResultsCard url='https://webuycars.co.za/'/>
                <ScrapeResultsCard url='https://www.nike.co.za/'/>
                <ScrapeResultsCard url='https://www.picknpay.co.za'/>
                <ScrapeResultsCard url='https://www.wimpy.co.za/'/>
            </div>

            <div className='flex justify-center'>
                <Pagination loop showControls color="default" total={5} initialPage={1} />
            </div>
        </div>
    )
}
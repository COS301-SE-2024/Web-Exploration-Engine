import React from 'react';
import { CircularProgress } from '@nextui-org/react';

interface CircularProgressInterface {
    value: number;
    label: string;
}

export default function CircularProgressComparison({value, label}: CircularProgressInterface) {

    return(
        <CircularProgress
            classNames={{
                svg: "w-[5rem] h-[5rem] md:w-[5.5rem] md:h-[5.5rem] lg:w-[7rem] lg:h-[7rem]",
                indicator: "stroke-jungleGreen-800 dark:stroke-jungleGreen-400",
                track: "stroke-primaryTextColor/10 dark:stroke-dark-primaryTextColor/10",
                value: "text-lg md:text-xl lg:text-3xl font-semibold text-primaryTextColor dark:text-dark-primaryTextColor",
            }}
            label={label}
            value={value}
            showValueLabel={true}
        />
    );

} 
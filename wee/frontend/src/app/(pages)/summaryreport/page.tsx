import React from 'react';
// import { ExampleChart } from '../../components/chart';
import { PieChart } from '../../components/Graphs';
import { BarChart } from '../../components/Graphs';
import { RadialBar } from '../../components/Graphs';

export default function SummaryReport() {
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
                    <PieChart dataLabel={['E-commerce', 'Health', 'Fashion', 'Retail']} dataSeries={[35.2, 16, 6, 42.8]}/>
                </div>
                <div className='bg-zinc-200 dark:bg-zinc-700 p-4 rounded-xl text-center'>
                    <h3 className="font-poppins-semibold text-lg text-jungleGreen-700 dark:text-jungleGreen-100 mb-4">
                        Live/Parked Status
                    </h3>
                    <BarChart dataLabel={['Live', 'Parked']} dataSeries={[8, 3]}/> 
                </div>
                <div className='bg-zinc-200 dark:bg-zinc-700 p-4 rounded-xl text-center'>
                    <h3 className="font-poppins-semibold text-lg text-jungleGreen-700 dark:text-jungleGreen-100 mb-4">
                        Domain watch/match
                    </h3>
                    <RadialBar dataLabel={['Match']} dataSeries={[83]}/>
                </div>
            </div>
        </div>
    )
}
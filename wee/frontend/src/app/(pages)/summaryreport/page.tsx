import React from 'react';
import { ExampleChart } from '../../components/chart';
import { PieChart } from '../../components/Graphs';
import { BarChart } from '../../components/Graphs';
// import { RadialBar } from '../../components/Graphs/RadialBar';

export default function SummaryReport() {
    return (
        <div className='min-h-screen p-4'>
            <div className="mb-8 text-center">
                <h1 className="mt-4 font-poppins-bold text-2xl text-jungleGreen-800 dark:text-dark-primaryTextColor">
                    Overall summary
                </h1>
            </div>
            <div className='gap-2 grid md:grid-cols-2'>
                <div className='bg-pink-600 p-2'>
                    {/* <PieChart dataLabel={['orange', 'lemon', 'apple']} dataSeries={[23,54,23]}/> */}
                </div>
                <div className='bg-purple-600 p-2'>
                    <BarChart dataLabel={['orange', 'lemon', 'apple', 'strawberry']} dataSeries={[23,54,11,12]}/> 
                </div>
                <div className='bg-lime-600 p-2'>
                    div 3
                </div>
                {/* <ExampleChart/>
                <PieChart dataLabel={['orange', 'lemon', 'apple']} dataSeries={[23,54,23]}/>
                <BarChart dataLabel={['orange', 'lemon', 'apple', 'strawberry']} dataSeries={[23,54,11,12]}/> */}
                {/* <RadialBar/> */}
            </div>
        </div>
    )
}
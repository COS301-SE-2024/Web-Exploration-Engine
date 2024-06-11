import React from 'react';
import { ExampleChart } from '../../components/chart';
import { PieChart } from '../../components/Graphs';
import { BarChart } from '../../components/Graphs';

export default function SummaryReport() {
    return (
        <div>
            <ExampleChart/>
            <PieChart dataLabel={['orange', 'lemon', 'apple']} dataSeries={[23,54,23]}/>
            <BarChart dataLabel={['orange', 'lemon', 'apple', 'strawberry']} dataSeries={[23,54,11,12]}/>

        </div>
    )
}
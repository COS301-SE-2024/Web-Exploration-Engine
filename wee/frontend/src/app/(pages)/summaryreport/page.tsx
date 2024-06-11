import React from 'react';
import { ExampleChart } from '../../components/chart';
import { PieChart } from '../../components/Graphs';
export default function SummaryReport() {
    return (
        <div>
            <ExampleChart/>
            <PieChart dataLabel={['orange', 'lemon', 'apple']} dataSeries={[23,54,23]}/>
        </div>
    )
}
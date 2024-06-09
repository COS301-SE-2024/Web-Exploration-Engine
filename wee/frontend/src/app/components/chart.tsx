'use client'

import dynamic from "next/dynamic";
import { useTheme } from "next-themes";
const ApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });


export function ExampleChart(){
    const { theme } = useTheme();
    
    const option = {
        chart: {
          id: 'apexchart-example'
        },
        xaxis: {
          categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999],
          title: {
            text: 'x axis title'
          }
        },
        yaxis: {
            title: {
              text: 'y axis title'
            }
          }
    }

    const series = [{
        name: 'SERIES NAME',
        data: [30, 40, 35, 50, 49, 60, 70, 91, 125]
      }]

    return(
        <>
            <ApexChart type="line" options={option} series={series} height={200} width={500} />
        </>
    )
    
}
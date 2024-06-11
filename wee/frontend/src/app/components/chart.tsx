'use client'
// import React from 'react';
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { ApexOptions } from "apexcharts";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });


export function ExampleChart(){
    const { theme } = useTheme();
    
    const [options, setOptions] = useState<ApexOptions>({
      chart: {
          id: 'apexchart-example',
          fontFamily: "'Poppins', sans-serif",
          background: 'transparent',
          toolbar: {
            tools: {
              zoom:false,
              zoomin:true,
              zoomout:true,
              pan:false,
              reset:false,
              download:false,
            }
          }
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
      },
      theme: {
          mode: theme === 'dark' ? 'dark' : 'light'
      },
      legend: {
        position: 'bottom', // or 'bottom', 'left', 'right'
        horizontalAlign: 'center', // or 'left', 'right'
      },

  });

    const series = [
      {
          name: 'Apple',
          data: [30, 40, 35, 50, 49, 60, 70, 91, 125]
      },
      {
          name: 'Mango',
          data: [20, 30, 25, 0, 39, 50, 60, 81, 105]
      },
      {
          name: 'Orange',
          data: [10, 20, 15, 30, 29, 40, 50, 71, 0]
      }
    ]

    useEffect(() => {
        setOptions(prevOptions => ({
            ...prevOptions,
            theme: {
                mode: theme === 'dark' ? 'dark' : 'light'
            }
        }));
    }, [theme]);

    return(
        <>
            <Chart type="line" options={options} series={series} height={200} width={500} />
        </>
    )
    
}
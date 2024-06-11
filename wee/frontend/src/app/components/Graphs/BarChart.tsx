'use client'
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { ApexOptions } from "apexcharts";
import IChart from "../../models/ChartModel";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

export function BarChart({ dataLabel, dataSeries }: IChart) {
    const { theme } = useTheme();

    const [options, setOptions] = useState<ApexOptions>({
        chart: {
            id: 'apexchart-bar',
            fontFamily: "'Poppins', sans-serif",
            background: 'transparent',
            toolbar: {
                tools: {
                    zoom: false,
                    zoomin: true,
                    zoomout: true,
                    pan: false,
                    reset: false,
                    download: false,
                }
            }
        },
        plotOptions: {
            bar: {
                horizontal: true // determines whether it is a horizontal(true) or vertical(false) chart
            }
        },
        theme: {
            mode: theme === 'dark' ? 'dark' : 'light'
        },
    });

    const series = [{
        data: dataSeries.map((value, index) => ({ x: dataLabel[index], y: value }))
    }];

    useEffect(() => {
        setOptions(prevOptions => ({
            ...prevOptions,
            theme: {
                mode: theme === 'dark' ? 'dark' : 'light'
            }
        }));
    }, [theme]);

    return (
        <>
            <Chart type="bar" options={options} series={series} height={300} width={400} />
        </>
        
    );
}

'use client'
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { ApexOptions } from "apexcharts";
import { ChartColours, DarkChartColours } from "./colours";

interface MetaRadarInterface {
    radarCategories: string[],
    radarSeries: RadarSeries[]
}

export interface RadarSeries {
    name: string,
    data: number[]
}

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

export function RadarChart({ radarCategories, radarSeries }: MetaRadarInterface) {
    const { theme } = useTheme();

    const [options, setOptions] = useState<ApexOptions>({
        chart: {
            id: 'apexchart-bar',
            fontFamily: "'Poppins', sans-serif",
            background: 'transparent',
            height: 100, // or any other fixed height
            width: '100%',
            type: 'radar',
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
        colors: theme === 'light' ? ChartColours : DarkChartColours,
        plotOptions: {
            radar: {
                polygons: {
                    
                    strokeColors: theme === 'dark' ? '#D7D7D7' : '#BBBBBB',
                    connectorColors: theme === 'dark' ? '#D7D7D7' : '#BBBBBB',                  
                }
            }
        },
        theme: {
            mode: theme === 'dark' ? 'dark' : 'light'
        },
        yaxis: {
            stepSize: 20
        },
        xaxis: {
            categories: radarCategories
        },       
    });

    const series = radarSeries;      

    useEffect(() => {
        setOptions(prevOptions => ({
            ...prevOptions,
            colors: theme === 'light' ? ChartColours : DarkChartColours,
            theme: {
                mode: theme === 'dark' ? 'dark' : 'light'
            },
            plotOptions: {
                radar: {
                    polygons: {                        
                        strokeColors: theme === 'dark' ? '#D7D7D7' : '#BBBBBB',
                        connectorColors: theme === 'dark' ? '#D7D7D7' : '#BBBBBB',                  
                    }
                }
            },
        }));
    }, [theme]);

    return (
        <div className="app">
            <div className="row">
                <div className="mixed-chart">
                    <Chart
                        options={options}
                        series={series}
                        type="radar"
                        height={650}
                        width="100%"
                    />
                </div>
            </div>
        </div>        
    );
}

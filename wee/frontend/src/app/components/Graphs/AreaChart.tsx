'use client'
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { ApexOptions } from "apexcharts";
import { ChartColours, DarkChartColours } from "./colours";

interface AreaInterface {
    areaCategories: string[],
    areaSeries: AreaSeries[]
}

export interface AreaSeries {
    name: string,
    data: number[]
}

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

export function AreaChart({ areaCategories, areaSeries }: AreaInterface) {
    const { resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const generateOptions = (currentTheme: string): ApexOptions => ({
        chart: {
            id: 'apexchart-bar',
            fontFamily: "'Poppins', sans-serif",
            background: 'transparent',
            height: 100, // or any other fixed height
            width: '100%',
            type: 'area',
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
        stroke: {
            curve: 'smooth'
        },
        colors: currentTheme === 'light' ? ChartColours : DarkChartColours,
        plotOptions: {
            radar: {
                polygons: {
                    
                    strokeColors: currentTheme === 'dark' ? '#D7D7D7' : '#BBBBBB',
                    connectorColors: currentTheme === 'dark' ? '#D7D7D7' : '#BBBBBB',                  
                }
            }
        },
        theme: {
            mode: currentTheme === 'dark' ? 'dark' : 'light'
        },
        yaxis: {
            stepSize: 20
        },
        xaxis: {
            categories: areaCategories,
            labels: {
                style: {
                    colors: currentTheme === 'light' ? new Array(areaCategories.length).fill('#000000') : new Array(areaCategories.length).fill('#ffffff')
                },                
            },
        },    
    });

    const [options, setOptions] = useState<ApexOptions>(generateOptions(resolvedTheme || 'light'));
    const series = areaSeries;      

    useEffect(() => {
        if (mounted) {
            setOptions(generateOptions(resolvedTheme || 'light'));
        }
    }, [resolvedTheme, mounted]);

    if (!mounted) {
        return null;
    }

    return (
        <div className="app">
            <div className="row">
                <div className="mixed-chart">
                    <Chart
                        options={options}
                        series={series}
                        type="area"
                        height={400}
                        width="100%"
                    />
                </div>
            </div>
        </div>        
    );
}

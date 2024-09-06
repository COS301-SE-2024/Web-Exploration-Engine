'use client'
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { ApexOptions } from "apexcharts";
import { ChartColours, DarkChartColours } from "./colours";

interface LineInterface {
    areaCategories: string[],
    areaSeries: LineSeries[]
}

export interface LineSeries {
    name: string,
    data: number[]
}

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

export function LineChart({ areaCategories, areaSeries }: LineInterface) {
    const { theme } = useTheme();

    const [options, setOptions] = useState<ApexOptions>({
        chart: {
            id: 'apexchart-bar',
            fontFamily: "'Poppins', sans-serif",
            background: 'transparent',
            height: 100, // or any other fixed height
            width: '100%',
            type: 'line',
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
            min: 1,
            max: 11,
            tickAmount: 11,
            labels: {
                formatter: (value) => {
                    const customLabels = ['N/A', '10', '9', '8', '7', '6', '5', '4', '3', '2', '1'];
                    return value > 10 ? customLabels[0] : customLabels[11 - value];
                },
            },
            stepSize: 1,
            reversed: true
        },
        xaxis: {
            categories: areaCategories,
            labels: {
                style: {
                    colors: theme === 'light' ? new Array(areaCategories.length).fill('#000000') : new Array(areaCategories.length).fill('#ffffff')
                },
            },
        },
    });

    const series = areaSeries.map((seriesItem) => ({
        ...seriesItem,
        data: seriesItem.data.map(value => value > 10 ? 11 : value)
    }))

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
            xaxis: {
                categories: areaCategories,
                labels: {
                    style: {
                        colors: theme === 'light' ? new Array(areaCategories.length).fill('#000000') : new Array(areaCategories.length).fill('#ffffff')
                    },
                },
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
                        type="line"
                        height={400}
                        width="100%"
                    />
                </div>
            </div>
        </div>
    );
}

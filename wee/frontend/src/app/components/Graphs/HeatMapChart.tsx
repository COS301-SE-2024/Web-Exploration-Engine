'use client'
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { ApexOptions } from "apexcharts";
import IChart from "../../models/ChartModel";
import { ChartColours, DarkChartColours } from "./colours";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

export function HeatMapChart({ dataLabel, dataSeries }: IChart) {
    const { theme } = useTheme();

    const [options, setOptions] = useState<ApexOptions>({
        chart: {
            id: 'apexchart-bar',
            fontFamily: "'Poppins', sans-serif",
            background: 'transparent',
            height: 100, // or any other fixed height
            width: '100%',
            type: 'heatmap',
            stacked: true,
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
            heatmap: {
                shadeIntensity: 0,
                colorScale: {
                    ranges: [
                        { from: 0, to: 15, color: '#b6e4ce', name: 'Low' },       // Light green
                        { from: 16, to: 30, color: '#54b38e', name: 'Medium' },    // Medium green
                        { from: 31, to: 50, color: '#329874', name: 'High' },      // Darker green
                        { from: 51, to: 100, color: '#144033', name: 'Very High' }  // Darkest green
                    ]
                }
            }
        },
        theme: {
            mode: theme === 'dark' ? 'dark' : 'light'
        },
        xaxis: {
            categories: dataLabel,
            axisBorder: {
                show: true,
                color: theme === 'dark' ? '#D7D7D7' : '#BBBBBB',
            },
        },
        yaxis: {
            axisBorder: {
                show: true,
                color: theme === 'dark' ? '#D7D7D7' : '#BBBBBB',
            }
        },
        grid: {
            borderColor: theme === 'dark' ? '#D7D7D7' : '#BBBBBB',
        },
    });

    const series = dataSeries;

    useEffect(() => {
        setOptions(prevOptions => ({
            ...prevOptions,
            colors: theme === 'light' ? ChartColours : DarkChartColours,
            theme: {
                mode: theme === 'dark' ? 'dark' : 'light'
            },
            xaxis: {
                categories: dataLabel,
                axisBorder: {
                    show: true,
                    color: theme === 'dark' ? '#D7D7D7' : '#BBBBBB',
                }
            },
            yaxis: {
                axisBorder: {
                    show: true,
                    color: theme === 'dark' ? '#D7D7D7' : '#BBBBBB',
                }
            },
            grid: {
                borderColor: theme === 'dark' ? '#D7D7D7' : '#BBBBBB',
            }
        }));
    }, [theme, dataLabel]);

    return (
        <div className="app">
            <div className="row">
                <div className="mixed-chart">
                    <Chart
                        options={options}
                        series={series}
                        type="heatmap"
                        height={280}
                        width="100%"
                    />
                </div>
            </div>
        </div>
    );
}
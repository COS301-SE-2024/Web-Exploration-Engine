'use client'
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { ApexOptions } from "apexcharts";
import IChart from "../../models/ChartModel";
import { ChartColours, DarkChartColours } from "./colours";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

export function BarChart({ dataLabel, dataSeries }: IChart) {
    const { theme } = useTheme();

    const [options, setOptions] = useState<ApexOptions>({
        chart: {
            id: 'apexchart-bar',
            fontFamily: "'Poppins', sans-serif",
            background: 'transparent',
            height: 100, // or any other fixed height
            width: '100%',
            type: 'bar',
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
            bar: {
                horizontal: true // determines whether it is a horizontal(true) or vertical(false) chart
            }
        },
        theme: {
            mode: theme === 'dark' ? 'dark' : 'light'
        },
        xaxis: {
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
    });

    const series = [{
        data: dataSeries.map((value, index) => ({ x: dataLabel[index], y: value }))
    }];

    useEffect(() => {
        setOptions(prevOptions => ({
            ...prevOptions,
            colors: theme === 'light' ? ChartColours : DarkChartColours,
            theme: {
                mode: theme === 'dark' ? 'dark' : 'light'
            },
            xaxis: {
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
    }, [theme]);

    return (
        <div className="app">
            <div className="row">
                <div className="mixed-chart">
                    <Chart
                        options={options}
                        series={series}
                        type="bar"
                        height={280}
                        width="100%"
                    />
                </div>
            </div>
        </div>        
    );
}

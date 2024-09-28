'use client'
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { ApexOptions } from "apexcharts";
import IChart from "../../models/ChartModel";
import { ChartColours, DarkChartColours } from "./colours";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

export function BarChart({ dataLabel, dataSeries }: IChart) {
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
        colors: currentTheme === 'light' ? ChartColours : DarkChartColours,
        plotOptions: {
            bar: {
                horizontal: true // determines whether it is a horizontal(true) or vertical(false) chart
            }
        },
        theme: {
            mode: currentTheme === 'dark' ? 'dark' : 'light'
        },
        xaxis: {
            stepSize: 1,
            axisBorder: {
                show: true,
                color: currentTheme === 'dark' ? '#D7D7D7' : '#BBBBBB',
            }
        },
        yaxis: {
            axisBorder: {
                show: true,
                color: currentTheme === 'dark' ? '#D7D7D7' : '#BBBBBB',
            }
        },
        grid: {
            borderColor: currentTheme === 'dark' ? '#D7D7D7' : '#BBBBBB',
        }
    });

    const [options, setOptions] = useState<ApexOptions>(generateOptions(resolvedTheme || 'light'));
    const series = [{
        data: dataSeries.map((value, index) => ({ x: dataLabel[index], y: value }))
    }];

    useEffect(() => {
        if (mounted) {
            setOptions(generateOptions(resolvedTheme || 'light'));
        }
    }, [resolvedTheme, dataLabel, mounted]);

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
                        type="bar"
                        height={280}
                        width="100%"
                    />
                </div>
            </div>
        </div>        
    );
}

export function SentimentBarChart({ dataLabel, dataSeries }: IChart) {
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
        colors: currentTheme === 'light' ? ['#60d143', '#f76e25', '#aa0825'] : ['#7aff82', '#eb8945', '#ca677a'],
        plotOptions: {
            bar: {
                horizontal: true // determines whether it is a horizontal(true) or vertical(false) chart
            }
        },
        theme: {
            mode: currentTheme === 'dark' ? 'dark' : 'light'
        },
        xaxis: {
            stepSize: 1,
            axisBorder: {
                show: true,
                color: currentTheme === 'dark' ? '#D7D7D7' : '#BBBBBB',
            }
        },
        yaxis: {
            axisBorder: {
                show: true,
                color: currentTheme === 'dark' ? '#D7D7D7' : '#BBBBBB',
            }
        },
        grid: {
            borderColor: currentTheme === 'dark' ? '#D7D7D7' : '#BBBBBB',
        }
    });

    const [options, setOptions] = useState<ApexOptions>(generateOptions(resolvedTheme || 'light'));
    const series = [{
        data: dataSeries.map((value, index) => ({ x: dataLabel[index], y: value }))
    }];

    useEffect(() => {
        if (mounted) {
            setOptions(generateOptions(resolvedTheme || 'light'));
        }
    }, [resolvedTheme, dataLabel, mounted]);

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
                        type="bar"
                        height={280}
                        width="100%"
                    />
                </div>
            </div>
        </div>        
    );
}
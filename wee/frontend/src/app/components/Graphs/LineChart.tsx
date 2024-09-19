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

export function LineChartCustomAxis({ areaCategories, areaSeries }: LineInterface) {
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
            min: 1,
            max: 15,
            tickAmount: 15,
            labels: {
                formatter: (value) => {
                    const customLabels = ['N/A', '14', '13', '12', '11', '10', '9', '8', '7', '6', '5', '4', '3', '2', '1'];
                    return value > 14 ? customLabels[0] : customLabels[15 - value];
                },
            },
            stepSize: 1,
            reversed: true,
            axisBorder: {
                show: true,
                color: currentTheme === 'dark' ? '#D7D7D7' : '#BBBBBB',
            }
        },
        xaxis: {
            categories: areaCategories,
            labels: {
                style: {
                    colors: currentTheme === 'light' ? new Array(areaCategories.length).fill('#000000') : new Array(areaCategories.length).fill('#ffffff')
                },
            },
            axisBorder: {
                show: true,
                color: currentTheme === 'dark' ? '#D7D7D7' : '#BBBBBB',
            },
        },
        grid: {
            borderColor: currentTheme === 'dark' ? '#D7D7D7' : '#BBBBBB',
        },
    });

    const [options, setOptions] = useState<ApexOptions>(generateOptions(resolvedTheme || 'light'));
    const series = areaSeries.map((seriesItem) => ({
        ...seriesItem,
        data: seriesItem.data.map(value => value > 14 ? 15 : value)
    }))

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
                        type="line"
                        height={400}
                        width="100%"
                    />
                </div>
            </div>
        </div>
    );
}

export function LineChart({ areaCategories, areaSeries }: LineInterface) {
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
        xaxis: {
            categories: areaCategories,
            labels: {
                style: {
                    colors: currentTheme === 'light' ? new Array(areaCategories.length).fill('#000000') : new Array(areaCategories.length).fill('#ffffff')
                },
            },
            axisBorder: {
                show: true,
                color: currentTheme === 'dark' ? '#D7D7D7' : '#BBBBBB',
            },
        },
        dataLabels: {
            enabled: true, // Enables data labels
        },
        grid: {
            borderColor: currentTheme === 'dark' ? '#D7D7D7' : '#BBBBBB',
        },
        yaxis: {
            axisBorder: {
                show: true,
                color: currentTheme === 'dark' ? '#D7D7D7' : '#BBBBBB',
            }
        }
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
                        type="line"
                        height={400}
                        width="100%"
                    />
                </div>
            </div>
        </div>
    );
}

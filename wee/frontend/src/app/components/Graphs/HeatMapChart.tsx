'use client'
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { ApexOptions } from "apexcharts";
import IChart from "../../models/ChartModel";
import { ChartColours, DarkChartColours } from "./colours";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const lightModeColors = [
    { from: -Infinity, to: -1, color: '#54B38E', name: 'Very Low' },
    { from: 0, to: 750, color: '#22795C', name: 'Low' },
    { from: 751, to: 5000, color: '#184d3d', name: 'Medium' },
    { from: 5001, to: Infinity, color: '#0A241D', name: 'High' },
];

const darkModeColors = [
    { from: -Infinity, to: -1, color: '#86cfb0', name: 'Very Low' },
    { from: 0, to: 750, color: '#329874', name: 'Low' },
    { from: 751, to: 5000, color: '#1B614B', name: 'Medium' },
    { from: 5001, to: Infinity, color: '#144033', name: 'High' },
];

export function HeatMapChart({ dataLabel, dataSeries }: IChart) {
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
        colors: currentTheme === 'light' ? ChartColours : DarkChartColours,
        plotOptions: {
            heatmap: {
                shadeIntensity: 0,
                reverseNegativeShade: true,
                colorScale: {
                    ranges: currentTheme === 'dark' ? darkModeColors : lightModeColors,
                },
            }
        },
        theme: {
            mode: currentTheme === 'dark' ? 'dark' : 'light'
        },
        xaxis: {
            categories: dataLabel,
            axisBorder: {
                show: true,
                color: currentTheme === 'dark' ? '#D7D7D7' : '#BBBBBB',
            },
        },
        yaxis: {
            axisBorder: {
                show: true,
                color: currentTheme === 'dark' ? '#D7D7D7' : '#BBBBBB',
            }
        },
        stroke: {
            colors: currentTheme === 'dark' ? ['#D7D7D7'] : ['#BBBBBB'],
        },
        dataLabels: {
            enabled: false
        }
    });

    const [options, setOptions] = useState<ApexOptions>(generateOptions(resolvedTheme || 'light'));
    const series = dataSeries;

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
                        type="heatmap"
                        height={280}
                        width="100%"
                    />
                </div>
            </div>
        </div>
    );
}
'use client'
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { ApexOptions } from "apexcharts";
import IChart from "../../models/ChartModel";
import { ChartColours, DarkChartColours } from "./colours";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const lightModeColors = [
    { from: -50000, to: -1, color: '#38023b', name: 'Very Low' }, 
    { from: 0, to: 500, color: '#b6e4ce', name: 'Low' },       // Light green
    { from: 501, to: 1000, color: '#54b38e', name: 'Medium' },    // Medium green
    { from: 1001, to: 5000, color: '#329874', name: 'High' },      // Darker green
    { from: 5001, to: 200000, color: '#144033', name: 'Very High' }  // Darkest green
];

const darkModeColors = [
    { from: -50000, to: -1, color: '#a288e3', name: 'Very Low' }, 
    { from: 0, to: 500, color: '#dae5d7', name: 'Low' },       // Light gray-green
    { from: 501, to: 1000, color: '#92c3ab', name: 'Medium' },    // Grayish green
    { from: 1001, to: 5000, color: '#5a8c74', name: 'High' },      // Dark gray-green
    { from: 5001, to: 200000, color: '#2b4d3a', name: 'Very High' }  // Dark green
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
                colorScale: {
                    ranges: currentTheme === 'dark' ? darkModeColors : lightModeColors,
                }
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
        grid: {
            borderColor: currentTheme === 'dark' ? '#D7D7D7' : '#BBBBBB',
        },
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
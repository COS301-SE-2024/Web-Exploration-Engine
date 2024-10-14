'use client'
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { ApexOptions } from "apexcharts";
import IChart from "../../models/ChartModel";
import { ChartColours, DarkChartColours } from "./colours";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const lightModeColors = [
    { from: -Infinity, to: -10, color: '#f84c26', name: 'Large Decrease'},
    { from: -10, to: -1, color: '#ff9844', name: 'Decrease'},
    { from: 0, to: 0, color: '#d3d3d3', name: 'No Change'},
    { from: 1, to: 10, color: '#54b38e', name: 'Increase'},
    { from: 10, to: Infinity, color: '#22795c', name: 'Large Increase'}
];

const darkModeColors = [
    { from: -Infinity, to: -10, color: '#ff5c00', name: 'Large Decrease'},
    { from: -10, to: -1, color: '#ffb95d', name: 'Decrease'},
    { from: 0, to: 0, color: '#737379', name: 'No Change'},
    { from: 1, to: 10, color: '#86cfb0', name: 'Increase'},
    { from: 10, to: Infinity, color: '#329874', name: 'Large Increase'}
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
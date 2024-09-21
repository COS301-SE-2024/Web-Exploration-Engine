'use client'
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { ApexOptions } from "apexcharts";
import IChart from "../../../models/ChartModel";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface IChartExtended extends IChart {
    legendPosition: 'bottom' | 'right';
}

export function DonutChart({ dataLabel, dataSeries, legendPosition }: IChartExtended) {
    const { resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const generateOptions = (currentTheme: string): ApexOptions => ({
        chart: {
            id: 'apexchart-donut',
            fontFamily: "'Poppins', sans-serif",
            background: 'transparent',
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
        labels: dataLabel,
        theme: {
            mode: currentTheme === 'dark' ? 'dark' : 'light'
        },
        legend: {
            position: legendPosition,
            horizontalAlign: 'left',
            labels: {
                colors: currentTheme === 'dark' ? '#FFFFFF' : '#000000',
            }
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
                        type="donut"
                        height={280}
                        width="100%"
                    />
                </div>
            </div>
        </div>
    );
}
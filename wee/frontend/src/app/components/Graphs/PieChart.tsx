'use client'
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { ApexOptions } from "apexcharts";
import IChart from "../../models/ChartModel";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

export function PieChart({dataLabel, dataSeries}: IChart) {
    const { theme } = useTheme();
    const [options, setOptions] = useState<ApexOptions>({
        chart: {
            id: 'apexchart-pie',
            fontFamily: "'Poppins', sans-serif",
            background: 'transparent',
            toolbar: {
              tools: {
                zoom:false,
                zoomin:true,
                zoomout:true,
                pan:false,
                reset:false,
                download:false,
              }
            }
        },
        labels: dataLabel,
        theme: {
            mode: theme === 'dark' ? 'dark' : 'light'
        },
        legend: {
          position: 'right',
          horizontalAlign: 'left',
        },
  
    });

    const series = dataSeries;

    useEffect(() => {
        setOptions(prevOptions => ({
            ...prevOptions,
            theme: {
                mode: theme === 'dark' ? 'dark' : 'light'
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
                        type="pie"
                        height={280}
                        width="100%"
                    />
                </div>
            </div>
        </div>      
    );
}
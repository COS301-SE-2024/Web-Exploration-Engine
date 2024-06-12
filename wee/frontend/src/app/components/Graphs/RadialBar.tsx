'use client'
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { ApexOptions } from "apexcharts";
import IChart from "../../models/ChartModel";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

export function RadialBar({ dataLabel, dataSeries }: IChart) {
    const { theme } = useTheme();

    const [options, setOptions] = useState<ApexOptions>({
        chart: {
            id: 'apexchart-radialbar',
            fontFamily: "'Poppins', sans-serif",
            background: 'transparent',
            height: 100, // or any other fixed height
            width: '100%',
            type: "radialBar",
          },
          colors: ["#F66C6D"],
          plotOptions: {
            radialBar: {
              hollow: {
                margin: 0,
                size: "70%",
              },
              dataLabels: {
                name: {
                  offsetY: -10,
                  color: theme === 'dark' ? '#fff' : '#000',
                  fontSize: "13px"
                },
                value: {
                  fontSize: "30px",
                  show: true
                }
              }
            }
          },
          fill: {
            type: "gradient",
            gradient: {
              type: "vertical",
              gradientToColors: ["#F8B121"],
              stops: [0, 100]
            }
          },
          stroke: {
            lineCap: "round"
          },
          labels: dataLabel

    });

    useEffect(() => {
        setOptions(prevOptions => ({
            ...prevOptions,
            plotOptions: {
                ...prevOptions.plotOptions,
                radialBar: {
                    ...prevOptions.plotOptions?.radialBar,
                    dataLabels: {
                        ...prevOptions.plotOptions?.radialBar?.dataLabels,
                        name: {
                            ...prevOptions.plotOptions?.radialBar?.dataLabels?.name,
                            color: theme === 'dark' ? '#fff' : '#000',
                        },
                        value: {
                            ...prevOptions.plotOptions?.radialBar?.dataLabels?.value,
                            color: theme === 'dark' ? '#fff' : '#000',
                        }
                    }
                }
            }
        }));
    }, [theme]);

    return (
        <div className="app">
            <div className="row">
                <div className="mixed-chart">
                    <Chart
                        options={options}
                        series={dataSeries}
                        type="radialBar"
                        height={280}
                        width="100%"
                    />
                </div>
            </div>
        </div>        
    );
}
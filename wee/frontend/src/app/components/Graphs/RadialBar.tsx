'use client'
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { ApexOptions } from "apexcharts";
import IChart from "../../../models/ChartModel";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

export function RadialBar({ dataLabel, dataSeries }: IChart) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const generateOptions = (currentTheme: string): ApexOptions => ({
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
            color: currentTheme === 'dark' ? '#fff' : '#000',
            fontSize: "13px"
          },
          value: {
            fontSize: "30px",
            color: currentTheme === 'dark' ? '#fff' : '#000',
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

  const [options, setOptions] = useState<ApexOptions>(generateOptions(resolvedTheme || 'light'));

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
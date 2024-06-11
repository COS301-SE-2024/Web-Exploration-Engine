// 'use client'
// import dynamic from "next/dynamic";
// import { useEffect, useState } from "react";
// import { useTheme } from "next-themes";
// import { ApexOptions } from "apexcharts";

// const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

// export function RadialBar() {
//   const { theme } = useTheme();
//   const [options, setOptions] = useState<ApexOptions>({
//     chart: {
//       type: "radialBar",
//       fontFamily: "'Poppins', sans-serif",
//       background: 'transparent',
//       height: 280,
//     },
//     series: [67],
//     colors: ["#20E647"],
//     plotOptions: {
//       radialBar: {
//         hollow: {
//           margin: 0,
//           size: "70%",
//           background: "#293450",
//         },
//         track: {
//           dropShadow: {
//             enabled: true,
//             top: 2,
//             left: 0,
//             blur: 4,
//             opacity: 0.15,
//           },
//         },
//         dataLabels: {
//           name: {
//             offsetY: -10,
//             color: "#fff",
//             fontSize: "13px",
//           },
//           value: {
//             color: "#fff",
//             fontSize: "30px",
//             show: true,
//           },
//         },
//       },
//     },
//     fill: {
//       type: "gradient",
//       gradient: {
//         shade: "dark",
//         type: "vertical",
//         gradientToColors: ["#87D4F9"],
//         stops: [0, 100],
//       },
//     },
//     stroke: {
//       lineCap: "round",
//     },
//     labels: ["Progress"],
//   });

//   const series = [67];

//   useEffect(() => {
//     setOptions((prevOptions) => ({
//       ...prevOptions,
//       theme: {
//         mode: theme === 'dark' ? 'dark' : 'light',
//       },
//     }));
//   }, [theme]);

//   return (
//     <Chart type="radialBar" options={options} series={series} height={280} />
//   );
// }

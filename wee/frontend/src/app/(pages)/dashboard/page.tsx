'use client'
import React, { Suspense, useEffect } from 'react';
import { InfoPopOver } from '../../components/InfoPopOver';
import { LineChartCustomAxis, LineChart } from '../../components/Graphs/LineChart';
import { AreaChart } from '../../components/Graphs/AreaChart';
import { ColumnChartNPS } from '../../components/Graphs/ColumnChart';
import { StackedColumnChart } from '../../components/Graphs/StackedColumnChart';
import { HeatMapChart } from '../../components/Graphs/HeatMapChart';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { Button } from '@nextui-org/react';
import { FiArrowUp, FiArrowDown } from "react-icons/fi";
import useBeforeUnload from '../../hooks/useBeforeUnload';
import { useScheduledScrapeContext } from '../../context/ScheduledScrapingContext';
import { GetSchedulesResponse } from '../../models/ScheduleModels';

export default function Dashboard() {
	return (
		<Suspense fallback={<div>Loading...</div>}>
			<DashboardPage />
		</Suspense>
	);
}

function DashboardPage() {
	// scheduled scrape results
	const { scheduledScrapeResponse, setScheduledScrapeResponse } = useScheduledScrapeContext();

	const [dashboardData, setDashboardData] = React.useState<GetSchedulesResponse | null>(null);

	const searchParams = useSearchParams();
	const id = searchParams.get('id');
	const router = useRouter();

	const backToScheduledScrape = () => {
		router.back();
	};

	useBeforeUnload();

	useEffect(() => {
		if (id && scheduledScrapeResponse.length > 0) {
			const filteredResponse = scheduledScrapeResponse.find((scheduledResponse) => scheduledResponse.id == id);
			console.log("Filtered Response", filteredResponse);

			if (filteredResponse) {
				setDashboardData(filteredResponse);
			}
		}
	}, [id, scheduledScrapeResponse])

	return (
		<div className='p-4 min-h-screen'>
			<Button
				className="text-md font-poppins-semibold bg-jungleGreen-700 text-dark-primaryTextColor dark:bg-jungleGreen-400 dark:text-primaryTextColor"
				onClick={backToScheduledScrape}
				data-testid="btn-back"
			>
				Back
			</Button>

			<div className='mb-8 text-center'>
				<h1 className="mt-4 font-poppins-bold text-lg sm:text-xl md:text-2xl text-jungleGreen-800 dark:text-dark-primaryTextColor">
					Dashboard of {dashboardData ? dashboardData.url : 'N/A'}
				</h1>
				<h2 className="mt-2 font-poppins-bold text-md sm:text-lg md:text-xl text-jungleGreen-800 dark:text-dark-primaryTextColor">
					Date of last scheduled scrape: {dashboardData ? new Date(dashboardData.updated_at).toLocaleString() : 'N/A'}
				</h2>
			</div>

			{/* Summary */}
			<div className='gap-4 grid sm:grid-cols-2 lg:grid-cols-4'>
				<div data-testid="visual-crawlable-stats" className='bg-zinc-200 dark:bg-zinc-700 p-4 rounded-xl text-center'>
					<div className='text-4xl flex justify-center'>
						<FiArrowUp />
						<span className='text-4xl'>821</span>
					</div>
					<div className='font-poppins-bold text-2xl text-jungleGreen-800 dark:text-jungleGreen-400 pt-4'>
						Comment Count
					</div>
					<div className='font-poppins-semibold text-2xl'>
						19 661
					</div>
				</div>

				{/* Recommendation Status */}
				<div data-testid="visual-crawlable-stats" className='bg-zinc-200 dark:bg-zinc-700 p-4 rounded-xl text-center'>
					<div className='font-poppins-bold text-2xl text-jungleGreen-800 dark:text-jungleGreen-400 pt-4'>
						Recommedation Status
					</div>
					<div className='font-poppins-semibold text-2xl pt-2'>
						{dashboardData && dashboardData.result_history &&
							dashboardData.result_history.recommendationStatus[dashboardData.result_history.recommendationStatus.length - 1] != ""
							? dashboardData.result_history.recommendationStatus[dashboardData.result_history.recommendationStatus.length - 1]
							: "N/A"
						}
					</div>
				</div>
			</div>

			{/* Technical SEO Analysis */}
			<div>
				<h3 className="font-poppins-semibold text-xl text-jungleGreen-700 dark:text-jungleGreen-100 pt-4">
					SEO Technical Analysis: Light House
					<InfoPopOver
						data-testid="popup-seo-technical-analaysis"
						heading="SEO Technical Analysis"
						content="Add description here"
						placement="right-end"
					/>
				</h3>

				{dashboardData && dashboardData.result_history.accessibilityScore && dashboardData.result_history.bestPracticesScore && dashboardData.result_history.performanceScore &&
					<div className='bg-zinc-200 dark:bg-zinc-700 p-4 rounded-xl text-center'>
						<AreaChart areaCategories={dashboardData.result_history.timestampArr.map((timestamp) => new Date(timestamp).toLocaleDateString())} areaSeries={[{ name: 'Accessibility', data: dashboardData.result_history.accessibilityScore.map(value => Math.round(value)) }, { name: 'Best Practices', data: dashboardData.result_history.bestPracticesScore.map(value => Math.round(value)) }, { name: 'Performance', data: dashboardData.result_history.performanceScore.map(value => Math.round(value)) }]} />
					</div>
				}
			</div>

			{/* Site Speed */}
			<div>
				<h3 className="font-poppins-semibold text-xl text-jungleGreen-700 dark:text-jungleGreen-100 pt-4">
					SEO Technical Analysis: Site Speed
					<InfoPopOver
						data-testid="popup-seo-sitespeed-analaysis"
						heading="SEO Site Speed Analysis"
						content="Add description here"
						placement="right-end"
					/>
				</h3>

				{dashboardData && dashboardData.result_history.siteSpeed &&
					<div className='bg-zinc-200 dark:bg-zinc-700 p-4 rounded-xl text-center'>
						<LineChart areaCategories={dashboardData.result_history.timestampArr.map((timestamp) => new Date(timestamp).toLocaleDateString())} areaSeries={[{ name: 'Ranking', data: dashboardData.result_history.siteSpeed.map(value => Math.round(value * 100) / 100) }]} />
					</div>
				}
			</div>

			{/* Keyword tracking */}
			<div>
				<h3 className="font-poppins-semibold text-xl text-jungleGreen-700 dark:text-jungleGreen-100 pt-4">
					SEO Keyword Analysis
					<InfoPopOver
						data-testid="popup-seo-keyword-analaysis"
						heading="SEO Keyword Analysis"
						content="Add description here"
						placement="right-end"
					/>
				</h3>

				<div className='gap-4 grid md:grid-cols-2 lg:grid-cols-3'>
					{dashboardData && dashboardData.keyword_results.map((keyword_result, index) => {
						const numericRankArr = keyword_result.rankArr.map(rank => {
							return typeof rank === 'string' ? 11 : rank;
						});

						return (
							<div className='bg-zinc-200 dark:bg-zinc-700 p-4 rounded-xl text-center' key={index}>
								<h3 className="font-poppins-semibold text-md text-jungleGreen-700 dark:text-jungleGreen-100 pb-2">
									{keyword_result.keyword}
								</h3>
								<LineChartCustomAxis areaCategories={keyword_result.timestampArr.map((timestamp) => new Date(timestamp).toLocaleDateString())} areaSeries={[{ name: 'Ranking', data: numericRankArr as number[] }]} />
							</div>
						)
					})}
					{/* <div className='bg-zinc-200 dark:bg-zinc-700 p-4 rounded-xl text-center'>
						<h3 className="font-poppins-semibold text-md text-jungleGreen-700 dark:text-jungleGreen-100 pb-2">
							Online bookstores
						</h3>
						<LineChartCustomAxis areaCategories={['10 Jan', '10 Feb', '10 Mar', '10 Apr', '10 May', '10 Jun', '10 Jul']} areaSeries={[{ name: 'Ranking', data: [8, 10, 18, 4, 7, 5, 3] }]} />
					</div>
					<div className='bg-zinc-200 dark:bg-zinc-700 p-4 rounded-xl text-center'>
						<h3 className="font-poppins-semibold text-md text-jungleGreen-700 dark:text-jungleGreen-100 pb-2">
							Online reading
						</h3>
						<LineChartCustomAxis areaCategories={['10 Feb', '10 Mar', '10 Apr', '10 May', '10 Jun', '10 Jul']} areaSeries={[{ name: 'Ranking', data: [3, 6, 14, 12, 4, 8] }]} />
					</div>
					<div className='bg-zinc-200 dark:bg-zinc-700 p-4 rounded-xl text-center'>
						<h3 className="font-poppins-semibold text-md text-jungleGreen-700 dark:text-jungleGreen-100 pb-2">
							Readerswarehouse south africa
						</h3>
						<LineChartCustomAxis
							areaCategories={[
								'10 Jan 24', '10 Feb 24', '10 Mar 24', '10 Apr 24', '10 May 24', '10 Jun 24', '10 Jul 24',
								'10 Aug 24', '10 Sep 24', '10 Oct 24', '10 Nov 24', '10 Dec 24', '10 Jan 25', '10 Feb 25', '10 Mar 25'
							]}
							areaSeries={[
								{
									name: 'Ranking',
									data: [4, 7, 8, 7, 9, 6, 8, 7, 5, 8, 6, 9, 7, 8, 6]
								}
							]}
						/>
					</div> */}
				</div>
			</div>

			{/* News sentiment */}
			<div>
				<h3 className="font-poppins-semibold text-xl text-jungleGreen-700 dark:text-jungleGreen-100 pt-4">
					News Sentiment
					<InfoPopOver
						data-testid="popup-news-sentiment"
						heading="News Sentiment"
						content="Add description here"
						placement="right-end"
					/>
				</h3>
				{dashboardData && dashboardData.result_history.newsSentiment && (
					<div className='bg-zinc-200 dark:bg-zinc-700 p-4 rounded-xl text-center'>
						<AreaChart areaCategories={dashboardData.result_history.timestampArr.map((timestamp) => new Date(timestamp).toLocaleDateString())} areaSeries={[{ name: 'positive', data: dashboardData.result_history.newsSentiment.positiveAvg.map(value => Math.round(value * 100)) }, { name: 'neutral', data: dashboardData.result_history.newsSentiment.neutralAvg.map(value => Math.round(value * 100)) }, { name: 'negative', data: dashboardData.result_history.newsSentiment.negativeAvg.map(value => Math.round(value * 100)) }]} />
					</div>
				)}
			</div>

			{/* Facebook */}
			<div>
				<h3 className="font-poppins-semibold text-xl text-jungleGreen-700 dark:text-jungleGreen-100 pt-4">
					Social Media
					<InfoPopOver
						data-testid="popup-seo-keyword-analaysis"
						heading="SEO Keyword Analysis"
						content="Add description here"
						placement="right-end"
					/>
				</h3>

				<div className='gap-4 grid md:grid-cols-2 xl:grid-cols-4'>
					<div className='bg-zinc-200 dark:bg-zinc-700 p-4 rounded-xl text-center'>
						<h3 className="font-poppins-semibold text-md text-jungleGreen-700 dark:text-jungleGreen-100 pb-2">
							Facebook - Comment Count
						</h3>
						{dashboardData && dashboardData.result_history.commentCount &&
							<LineChart areaCategories={dashboardData.result_history.timestampArr.map((timestamp) => new Date(timestamp).toLocaleDateString())} areaSeries={[{ name: 'Ranking', data: dashboardData.result_history.commentCount }]} />
						}
					</div>
					<div className='bg-zinc-200 dark:bg-zinc-700 p-4 rounded-xl text-center'>
						<h3 className="font-poppins-semibold text-md text-jungleGreen-700 dark:text-jungleGreen-100 pb-2">
							Facebook - Share Count
						</h3>
						{dashboardData && dashboardData.result_history.shareCount &&
							<LineChart areaCategories={dashboardData.result_history.timestampArr.map((timestamp) => new Date(timestamp).toLocaleDateString())} areaSeries={[{ name: 'Ranking', data: dashboardData.result_history.shareCount }]} />
						}
					</div>
					<div className='bg-zinc-200 dark:bg-zinc-700 p-4 rounded-xl text-center'>
						<h3 className="font-poppins-semibold text-md text-jungleGreen-700 dark:text-jungleGreen-100 pb-2">
							Facebook - Reaction Count
						</h3>
						{dashboardData && dashboardData.result_history.reactionCount &&
							<LineChart areaCategories={dashboardData.result_history.timestampArr.map((timestamp) => new Date(timestamp).toLocaleDateString())} areaSeries={[{ name: 'Ranking', data: dashboardData.result_history.reactionCount }]} />
						}
					</div>
					<div className='bg-zinc-200 dark:bg-zinc-700 p-4 rounded-xl text-center'>
						<h3 className="font-poppins-semibold text-md text-jungleGreen-700 dark:text-jungleGreen-100 pb-2">
							Pintrest - Pin Count
						</h3>
						{dashboardData && dashboardData.result_history.pinCount &&
							<LineChart areaCategories={dashboardData.result_history.timestampArr.map((timestamp) => new Date(timestamp).toLocaleDateString())} areaSeries={[{ name: 'Ranking', data: dashboardData.result_history.pinCount }]} />
						}
					</div>
				</div>
			</div>

			{/* Reviews */}
			<div>
				<h3 className="font-poppins-semibold text-xl text-jungleGreen-700 dark:text-jungleGreen-100 pt-4">
					Reviews
					<InfoPopOver
						data-testid="popup-nps-reviews"
						heading="News Sentiment"
						content="Add description here"
						placement="right-end"
					/>
				</h3>

				<div className='bg-zinc-200 dark:bg-zinc-700 p-4 rounded-xl text-center mb-[1rem]'>
					<h3 className="font-poppins-semibold text-md text-jungleGreen-700 dark:text-jungleGreen-100 pb-2">
						Ratings
					</h3>
					<StackedColumnChart
						dataLabel={['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']}
						dataSeries={[
							{
								name: '1 Star',
								data: [32, 38, 44, 50, 62, 88]
							},
							{
								name: '2 Stars',
								data: [25, 30, 48, 50, 73, 80]
							},
							{
								name: '3 Stars',
								data: [18, 22, 28, 35, 42, 50]
							},
							{
								name: '4 Stars',
								data: [40, 45, 50, 77, 90, 120]
							},
							{
								name: '5 Stars',
								data: [55, 63, 77, 89, 90, 111]
							}]}
					/>
				</div>

				<div className='bg-zinc-200 dark:bg-zinc-700 p-4 rounded-xl text-center mb-[1rem]'>
					<h3 className="font-poppins-semibold text-md text-jungleGreen-700 dark:text-jungleGreen-100 pb-2">
						Ratings HeatMap
					</h3>
					<HeatMapChart
						dataLabel={['Jan-Feb', 'Feb-Mrt', 'Mar-Apr', 'Apr-May', 'May-Jun']}
						dataSeries={[
							{
								name: '1 Star',
								data: [6, 6, 6, 12, 26]
							},
							{
								name: '2 Stars',
								data: [5, 18, 2, 23, 7]
							},
							{
								name: '3 Stars',
								data: [4, 6, 7, 7, 8]
							},
							{
								name: '4 Stars',
								data: [5, 5, 27, 13, 30]
							},
							{
								name: '5 Stars',
								data: [8, 24, 12, 1, 21]
							}]}
					/>
				</div>

				<div className='gap-4 grid md:grid-cols-2 lg:grid-cols-2'>
					<div className='bg-zinc-200 dark:bg-zinc-700 p-4 rounded-xl text-center'>
						<h3 className="font-poppins-semibold text-md text-jungleGreen-700 dark:text-jungleGreen-100 pb-2">
							Index
							<InfoPopOver
								data-testid="popup-nps-reviews"
								heading="News Sentiment"
								content="Add description here"
								placement="right-end"
							/>
						</h3>
						{dashboardData && dashboardData.result_history.trustIndex &&
							<LineChart
								areaCategories={dashboardData.result_history.timestampArr.map((timestamp) => new Date(timestamp).toLocaleDateString())}
								areaSeries={[{ name: 'Ranking', data: dashboardData.result_history.trustIndex }]} />
						}
					</div>
					<div className='bg-zinc-200 dark:bg-zinc-700 p-4 rounded-xl text-center '>
						<h3 className="font-poppins-semibold text-md text-jungleGreen-700 dark:text-jungleGreen-100 pb-2">
							NPS Reviews
							<InfoPopOver
								data-testid="popup-nps-reviews"
								heading="News Sentiment"
								content="Add description here"
								placement="right-end"
							/>
						</h3>
						{dashboardData && dashboardData.result_history.NPS &&
							<ColumnChartNPS
								dataLabel={dashboardData.result_history.timestampArr.map((timestamp) => new Date(timestamp).toLocaleDateString())}
								dataSeries={dashboardData.result_history.NPS}
							/>
						}
					</div>
				</div>
			</div>
		</div>
	)
}
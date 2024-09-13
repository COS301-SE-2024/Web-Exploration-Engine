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
				<div data-testid="visual-crawlable-stats" className='bg-zinc-200 dark:bg-zinc-700 p-4 rounded-xl text-center flex flex-col justify-center h-full'>
					<div className='font-poppins-bold text-2xl text-jungleGreen-800 dark:text-jungleGreen-400'>
						Recommendation Status
					</div>
					<div className='font-poppins-semibold text-2xl pt-3'>
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

				{dashboardData && dashboardData.result_history.accessibilityScore && dashboardData.result_history.bestPracticesScore && dashboardData.result_history.performanceScore ? (
					<div className='bg-zinc-200 dark:bg-zinc-700 p-4 rounded-xl text-center'>
						<AreaChart areaCategories={dashboardData.result_history.timestampArr.map((timestamp) => new Date(timestamp).toLocaleDateString())} areaSeries={[{ name: 'Accessibility', data: dashboardData.result_history.accessibilityScore.map(value => Math.round(value)) }, { name: 'Best Practices', data: dashboardData.result_history.bestPracticesScore.map(value => Math.round(value)) }, { name: 'Performance', data: dashboardData.result_history.performanceScore.map(value => Math.round(value)) }]} />
					</div>
				) : (
					<div className='bg-zinc-200 dark:bg-zinc-700 p-4 rounded-xl text-center'>
						There are no Ligth House Technical SEO Analysis currently available
					</div>
				)}
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

				{dashboardData && dashboardData.result_history.siteSpeed ? (
					<div className='bg-zinc-200 dark:bg-zinc-700 p-4 rounded-xl text-center'>
						<LineChart areaCategories={dashboardData.result_history.timestampArr.map((timestamp) => new Date(timestamp).toLocaleDateString())} areaSeries={[{ name: 'Ranking', data: dashboardData.result_history.siteSpeed.map(value => Math.round(value * 100) / 100) }]} />
					</div>
				) : (
					<div className='bg-zinc-200 dark:bg-zinc-700 p-4 rounded-xl text-center'>
						There are no Site Speed Technical SEO Analysis currently available
					</div>
				)}
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

				{dashboardData && dashboardData.keyword_results.length > 0 ? (
					<div className='gap-4 grid md:grid-cols-2 lg:grid-cols-3'>
						{dashboardData.keyword_results.map((keyword_result, index) => {
							const numericRankArr = keyword_result.rankArr.map(rank => {
								return typeof rank === 'string' ? 11 : rank;
							});

							return (
								<div className='bg-zinc-200 dark:bg-zinc-700 p-4 rounded-xl text-center' key={index}>
									<h3 className="font-poppins-semibold text-md text-jungleGreen-700 dark:text-jungleGreen-100 pb-2">
										{keyword_result.keyword}
									</h3>
									<LineChartCustomAxis
										areaCategories={keyword_result.timestampArr.map((timestamp) => new Date(timestamp).toLocaleDateString())}
										areaSeries={[{ name: 'Ranking', data: numericRankArr as number[] }]}
									/>
								</div>
							);
						})}
					</div>
				) : (
					<p className="bg-zinc-200 dark:bg-zinc-700 p-4 rounded-xl text-center">
						No keywords are being tracked
					</p>
				)}
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

				{dashboardData && dashboardData.result_history.newsSentiment ? (
					<div className='bg-zinc-200 dark:bg-zinc-700 p-4 rounded-xl text-center'>
						<AreaChart areaCategories={dashboardData.result_history.timestampArr.map((timestamp) => new Date(timestamp).toLocaleDateString())} areaSeries={[{ name: 'positive', data: dashboardData.result_history.newsSentiment.positiveAvg.map(value => Math.round(value * 100)) }, { name: 'neutral', data: dashboardData.result_history.newsSentiment.neutralAvg.map(value => Math.round(value * 100)) }, { name: 'negative', data: dashboardData.result_history.newsSentiment.negativeAvg.map(value => Math.round(value * 100)) }]} />
					</div>
				) : (
					<div className='bg-zinc-200 dark:bg-zinc-700 p-4 rounded-xl text-center'>
						There are no News Sentiment currently available
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

				<div className='gap-4 grid md:grid-cols-2 2xl:grid-cols-4'>
					<div className='bg-zinc-200 dark:bg-zinc-700 p-4 rounded-xl text-center'>
						<h3 className="font-poppins-semibold text-md text-jungleGreen-700 dark:text-jungleGreen-100 pb-2">
							Facebook - Comment Count
						</h3>
						{dashboardData && dashboardData.result_history.commentCount ? (
							<LineChart areaCategories={dashboardData.result_history.timestampArr.map((timestamp) => new Date(timestamp).toLocaleDateString())} areaSeries={[{ name: 'Ranking', data: dashboardData.result_history.commentCount }]} />
						) : (
							<p>There are no Facebook Comment Count currently available</p>
						)
						}
					</div>
					<div className='bg-zinc-200 dark:bg-zinc-700 p-4 rounded-xl text-center'>
						<h3 className="font-poppins-semibold text-md text-jungleGreen-700 dark:text-jungleGreen-100 pb-2">
							Facebook - Share Count
						</h3>
						{dashboardData && dashboardData.result_history.shareCount ? (
							<LineChart areaCategories={dashboardData.result_history.timestampArr.map((timestamp) => new Date(timestamp).toLocaleDateString())} areaSeries={[{ name: 'Ranking', data: dashboardData.result_history.shareCount }]} />
						) : (
							<p>There are no Facebook Share Count currently available</p>
						)
						}
					</div>
					<div className='bg-zinc-200 dark:bg-zinc-700 p-4 rounded-xl text-center'>
						<h3 className="font-poppins-semibold text-md text-jungleGreen-700 dark:text-jungleGreen-100 pb-2">
							Facebook - Reaction Count
						</h3>
						{dashboardData && dashboardData.result_history.reactionCount ? (
							<LineChart areaCategories={dashboardData.result_history.timestampArr.map((timestamp) => new Date(timestamp).toLocaleDateString())} areaSeries={[{ name: 'Ranking', data: dashboardData.result_history.reactionCount }]} />
						) : (
							<p>There are no Facebook Reaction Count currently available</p>
						)
						}
					</div>
					<div className='bg-zinc-200 dark:bg-zinc-700 p-4 rounded-xl text-center'>
						<h3 className="font-poppins-semibold text-md text-jungleGreen-700 dark:text-jungleGreen-100 pb-2">
							Pintrest - Pin Count
						</h3>
						{dashboardData && dashboardData.result_history.pinCount ? (
							<LineChart areaCategories={dashboardData.result_history.timestampArr.map((timestamp) => new Date(timestamp).toLocaleDateString())} areaSeries={[{ name: 'Ranking', data: dashboardData.result_history.pinCount }]} />
						) : (
							<p>There are no Pintrest Pin Count currently available</p>
						)
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
						Star Ratings Distribution for Reviews
					</h3>

					{dashboardData && dashboardData.result_history && dashboardData.result_history.starRatings ? (
						<StackedColumnChart
							dataLabel={dashboardData.result_history.timestampArr.map((timestamp) => new Date(timestamp).toLocaleDateString())}
							dataSeries={[1, 2, 3, 4, 5].map((star) => ({
								name: `${star} Star`,
								data: dashboardData.result_history.starRatings.map((period) => {
									// period is an array, find the rating for the current star
									if (Array.isArray(period)) {
										const rating = period.find((r) => r.stars === star);
										return rating ? rating.numReviews : 0;
									} else {
										console.error('Expected period to be an array, but got:', period);
										return 0;
									}
								})
							}))}
						/>

					) : (
						<p>There are no rating data currently available</p>
					)}

				</div>

				<div className='bg-zinc-200 dark:bg-zinc-700 p-4 rounded-xl text-center mb-[1rem]'>
					<h3 className="font-poppins-semibold text-md text-jungleGreen-700 dark:text-jungleGreen-100 pb-2">
						Ratings Intensity Heatmap
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
							Trust Index Rating
							<InfoPopOver
								data-testid="popup-trustindex-ratings"
								heading="Trust Index Rating"
								content="Add description here"
								placement="right-end"
							/>
						</h3>
						{dashboardData && dashboardData.result_history.trustIndex ? (
							<LineChart
								areaCategories={dashboardData.result_history.timestampArr.map((timestamp) => new Date(timestamp).toLocaleDateString())}
								areaSeries={[{ name: 'Ranking', data: dashboardData.result_history.trustIndex }]} />
						) : (
							<p>There are no Trust Index currently available</p>
						)
						}
					</div>
					<div className='bg-zinc-200 dark:bg-zinc-700 p-4 rounded-xl text-center '>
						<h3 className="font-poppins-semibold text-md text-jungleGreen-700 dark:text-jungleGreen-100 pb-2">
							NPS Score
							<InfoPopOver
								data-testid="popup-nps-score"
								heading="NPS Score"
								content="The score indicates how likely it is for reviewers to recommed a business.</br>
									</br><i>Less than 0 :</i> Unlikely (Indicated in red)
									</br><i>1 to 49 :</i> Likely (Indicated in orange)
									</br><i>Greater than 49 :</i> Very likely (Indicated in green)"
								placement="right-end"
							/>
						</h3>
						{dashboardData && dashboardData.result_history.NPS ? (
							<ColumnChartNPS
								dataLabel={dashboardData.result_history.timestampArr.map((timestamp) => new Date(timestamp).toLocaleDateString())}
								dataSeries={dashboardData.result_history.NPS}
							/>
						) : (
							<p>There are no NPS Reviews currently available</p>
						)
						}
					</div>
				</div>
			</div>
		</div>
	)
}
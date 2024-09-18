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

interface RatingsHeatmap {
	name: string,
	data: number[]
}

interface SumamryDashboard {
	increase?: boolean,
	increaseDecreaseBy?: number,
	summaryCategory: string,
	currentCount: number | string
}

function DashboardPage() {
	// scheduled scrape results
	const { scheduledScrapeResponse, setScheduledScrapeResponse } = useScheduledScrapeContext();

	const [dashboardData, setDashboardData] = React.useState<GetSchedulesResponse | null>(null);
	const [changedRatingsHeatmap, setChangedRatingsHeatmap] = React.useState<RatingsHeatmap[]>([]);

	// summary section
	const [summaryStarRating, setSummaryStarRating] = React.useState<SumamryDashboard>();
	const [summaryRecommendationStatus, setSummaryRecommendationStatus] = React.useState<SumamryDashboard>();
	const [summaryEngagement, setSummaryEngagement] = React.useState<SumamryDashboard>();
	const [summarySiteSpeed, setSummarySiteSpeed] = React.useState<SumamryDashboard>();

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

				// compute monthly changes for heatmap
				const computeMonthlyChanges = (starRatings: any): RatingsHeatmap[] => {
					if (!starRatings || starRatings.length < 2) return [];

					const changes: number[][] = [[], [], [], [], []]; // One array for each star rating

					for (let i = 1; i < starRatings.length; i++) {
						const currentPeriod = Array.isArray(starRatings[i]) ? starRatings[i] : [0, 0, 0, 0, 0];
						const previousPeriod = Array.isArray(starRatings[i - 1]) ? starRatings[i - 1] : [0, 0, 0, 0, 0];

						console.log(currentPeriod, previousPeriod);

						if (Array.isArray(currentPeriod) && Array.isArray(previousPeriod)) {
							[1, 2, 3, 4, 5].forEach((star) => {
								const currentRating = currentPeriod.find(r => r.stars === star)?.numReviews || 0;
								const previousRating = previousPeriod.find(r => r.stars === star)?.numReviews || 0;
								changes[star - 1].push(currentRating - previousRating);
								console.log(changes);
							});
						} else {
							console.error('Expected currentPeriod and previousPeriod to be arrays, but got:', { currentPeriod, previousPeriod });
						}
					}

					return changes.map((data, index) => ({
						name: `${index + 1} Star`,
						data: data
					}));
				};

				const starRatings = filteredResponse.result_history.starRatings;
				setChangedRatingsHeatmap(computeMonthlyChanges(starRatings));

				// average star rating summary section
				const starRatingLength = filteredResponse.result_history.rating.length;
				if (starRatingLength > 0) {
					const starRatingChange = filteredResponse.result_history.rating[starRatingLength - 1] - filteredResponse.result_history.rating[starRatingLength - 2];
					const starRatingSummaryObject: SumamryDashboard = {
						increase: starRatingChange > 0 ? true : false,
						increaseDecreaseBy: starRatingChange > 0 ? starRatingChange : starRatingChange * -1,
						summaryCategory: 'Average Star Rating',
						currentCount: filteredResponse.result_history.rating[starRatingLength - 1]
					}
					setSummaryStarRating(starRatingSummaryObject);
				}

				// recommendation status section
				const recommendationStatusLength = filteredResponse.result_history.recommendationStatus.length;
				if (recommendationStatusLength > 0) {
					const recommendationStatusSummaryObject: SumamryDashboard = {
						summaryCategory: 'Recommendation Status',
						currentCount: filteredResponse.result_history.recommendationStatus[recommendationStatusLength - 1],
					}
					setSummaryRecommendationStatus(recommendationStatusSummaryObject);
				}

				// engagement summary section
				const engagementLength = filteredResponse.result_history.totalEngagement.length;
				// there needs to be a minimum of 2 scheduled scrapes stored
				if (engagementLength > 1) {
					const engagementChange = filteredResponse.result_history.totalEngagement[engagementLength - 1] - filteredResponse.result_history.totalEngagement[engagementLength - 2];
					const engagementSummaryObject: SumamryDashboard = {
						increase: engagementChange > 0 ? true : false,
						increaseDecreaseBy: engagementChange > 0 ? engagementChange : engagementChange * -1,
						summaryCategory: 'Total Engagement',
						currentCount: filteredResponse.result_history.totalEngagement[engagementLength - 1]
					}
					setSummaryEngagement(engagementSummaryObject);
				}

				// site speed summary section
				const siteSpeedLength = filteredResponse.result_history.siteSpeed.length;
				// there needs to be a minimum of 2 scheduled scrapes stored
				if (siteSpeedLength > 1) {
					const siteSpeedChange = filteredResponse.result_history.siteSpeed[siteSpeedLength - 1] - filteredResponse.result_history.siteSpeed[siteSpeedLength - 2];
					const siteSpeedSummaryObject: SumamryDashboard = {
						increase: siteSpeedChange > 0 ? true : false,
						increaseDecreaseBy: siteSpeedChange > 0 ? Math.round(siteSpeedChange * 100) / 100 : Math.round(siteSpeedChange * -1 * 100) / 100,
						summaryCategory: 'Site Speed',
						currentCount: Math.round(filteredResponse.result_history.siteSpeed[engagementLength - 1] * 100) / 100
					}
					setSummarySiteSpeed(siteSpeedSummaryObject);
				}
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
				{/* Average Star Rating */}
				{dashboardData && summaryStarRating &&
					<div data-testid="visual-crawlable-stats" className='bg-zinc-200 dark:bg-zinc-700 p-4 rounded-xl text-center'>
						<div className='text-4xl flex justify-center'>
							{summaryStarRating.increase ? <FiArrowUp /> : <FiArrowDown />}
							<span className='text-4xl'>{summaryStarRating.increaseDecreaseBy}</span>
						</div>
						<div className='font-poppins-bold text-2xl text-jungleGreen-800 dark:text-jungleGreen-400 pt-4'>
							{summaryStarRating.summaryCategory}
						</div>
						<div className='font-poppins-semibold text-2xl'>
							{summaryStarRating.currentCount}
						</div>
					</div>
				}

				{/* Recommendation Status */}
				{dashboardData && summaryRecommendationStatus && 
					<div data-testid="visual-crawlable-stats" className='bg-zinc-200 dark:bg-zinc-700 p-4 rounded-xl text-center flex flex-col justify-center h-full'>
						<div className='font-poppins-bold text-2xl text-jungleGreen-800 dark:text-jungleGreen-400'>
							{summaryRecommendationStatus.summaryCategory}
						</div>
						<div data-testid="dashboard-summary-recomm-status" className='font-poppins-semibold text-2xl pt-3'>
							{
								summaryRecommendationStatus.currentCount != ""
								? summaryRecommendationStatus.currentCount
								: "N/A"
							}
						</div>
					</div>
				}

				{/* Total Engagements */}
				{dashboardData && summaryEngagement &&
					<div data-testid="dashboard-summary-engagements" className='bg-zinc-200 dark:bg-zinc-700 p-4 rounded-xl text-center'>
						<div className='text-4xl flex justify-center'>
							{summaryEngagement.increase ? <FiArrowUp /> : <FiArrowDown />}
							<span className='text-4xl'>{summaryEngagement.increaseDecreaseBy}</span>
						</div>
						<div className='font-poppins-bold text-2xl text-jungleGreen-800 dark:text-jungleGreen-400 pt-4'>
							{summaryEngagement.summaryCategory}
						</div>
						<div className='font-poppins-semibold text-2xl'>
							{summaryEngagement.currentCount}
						</div>
					</div>
				}

				{/* Site Speed */}
				{dashboardData && summarySiteSpeed &&
					<div data-testid="dashboard-summary-sitespeed" className='bg-zinc-200 dark:bg-zinc-700 p-4 rounded-xl text-center'>
						<div className='text-4xl flex justify-center'>
							{summarySiteSpeed.increase ? <FiArrowUp /> : <FiArrowDown />}
							<span className='text-4xl'>{summarySiteSpeed.increaseDecreaseBy}</span>
						</div>
						<div className='font-poppins-bold text-2xl text-jungleGreen-800 dark:text-jungleGreen-400 pt-4'>
							{summarySiteSpeed.summaryCategory}
						</div>
						<div className='font-poppins-semibold text-2xl'>
							{summarySiteSpeed.currentCount}
						</div>
					</div>
				}
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

				{dashboardData && dashboardData.result_history.accessibilityScore.length > 0 && dashboardData.result_history.bestPracticesScore.length > 0 && dashboardData.result_history.performanceScore.length > 0 ? (
					<div className='bg-zinc-200 dark:bg-zinc-700 p-4 rounded-xl text-center'>
						<AreaChart
							areaCategories={dashboardData.result_history.timestampArr.map((timestamp) => new Date(timestamp).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }))}
							areaSeries={[{ name: 'Accessibility', data: dashboardData.result_history.accessibilityScore.map(value => Math.round(value)) }, { name: 'Best Practices', data: dashboardData.result_history.bestPracticesScore.map(value => Math.round(value)) }, { name: 'Performance', data: dashboardData.result_history.performanceScore.map(value => Math.round(value)) }]}
						/>
					</div>
				) : (
					<div data-testid="dashboard-lighthouse-not-available" className='bg-zinc-200 dark:bg-zinc-700 p-4 rounded-xl text-center'>
						<p>
							There are no Ligth House Technical SEO Analysis currently available
						</p>
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

				{dashboardData && dashboardData.result_history.siteSpeed.length > 0 ? (
					<div className='bg-zinc-200 dark:bg-zinc-700 p-4 rounded-xl text-center'>
						<LineChart
							areaCategories={dashboardData.result_history.timestampArr.map((timestamp) => new Date(timestamp).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }))}
							areaSeries={[{ name: 'Site Speed', data: dashboardData.result_history.siteSpeed.map(value => Math.round(value * 100) / 100) }]}
						/>
					</div>
				) : (
					<div data-testid="dashboard-sitespeed-not-available" className='bg-zinc-200 dark:bg-zinc-700 p-4 rounded-xl text-center'>
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
										areaCategories={keyword_result.timestampArr.map((timestamp) => new Date(timestamp).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }))}
										areaSeries={[{ name: 'Ranking', data: numericRankArr as number[] }]}
									/>
								</div>
							);
						})}
					</div>
				) : (
					<p data-testid="dashboard-keyword-not-available" className="bg-zinc-200 dark:bg-zinc-700 p-4 rounded-xl text-center">
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

				{dashboardData && dashboardData.result_history.newsSentiment.negativeAvg.length>0 && dashboardData.result_history.newsSentiment.neutralAvg.length>0 && dashboardData.result_history.newsSentiment.positiveAvg.length>0 ? (
					<div className='bg-zinc-200 dark:bg-zinc-700 p-4 rounded-xl text-center'>
						<AreaChart
							areaCategories={dashboardData.result_history.timestampArr.map((timestamp) => new Date(timestamp).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }))}
							areaSeries={[{ name: 'positive', data: dashboardData.result_history.newsSentiment.positiveAvg.map(value => Math.round(value * 100)) }, { name: 'neutral', data: dashboardData.result_history.newsSentiment.neutralAvg.map(value => Math.round(value * 100)) }, { name: 'negative', data: dashboardData.result_history.newsSentiment.negativeAvg.map(value => Math.round(value * 100)) }]}
						/>
					</div>
				) : (
					<div data-testid="dashboard-news-not-available" className='bg-zinc-200 dark:bg-zinc-700 p-4 rounded-xl text-center'>
						There are no News Sentiment currently available
					</div>
				)}
			</div>

			{/* Social Media */}
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

				<div className='mb-[1rem] bg-zinc-200 dark:bg-zinc-700 p-4 rounded-xl text-center'>
					<h3 className="font-poppins-semibold text-md text-jungleGreen-700 dark:text-jungleGreen-100 pb-2">
						Total Engagments
					</h3>
					{dashboardData && dashboardData.result_history.totalEngagement.length > 0 ? (
						<LineChart
							areaCategories={dashboardData.result_history.timestampArr.map((timestamp) => new Date(timestamp).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }))}
							areaSeries={[{ name: 'Total Engagements', data: dashboardData.result_history.totalEngagement }]}
						/>
					) : (
						<p data-testid="dashboard-engagements-not-available">
							There are no Total Engagements currently available
						</p>
					)
					}
				</div>

				<div className='gap-4 grid md:grid-cols-2 2xl:grid-cols-4'>
					<div className='bg-zinc-200 dark:bg-zinc-700 p-4 rounded-xl text-center'>
						<h3 className="font-poppins-semibold text-md text-jungleGreen-700 dark:text-jungleGreen-100 pb-2">
							Facebook - Comment Count
						</h3>
						{dashboardData && dashboardData.result_history.commentCount.length > 0 ? (
							<LineChart
								areaCategories={dashboardData.result_history.timestampArr.map((timestamp) => new Date(timestamp).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }))}
								areaSeries={[{ name: 'Comment Count', data: dashboardData.result_history.commentCount }]}
							/>
						) : (
							<p data-testid="dashboard-comment-count-not-available">
								There are no Facebook Comment Count currently available
							</p>
						)
						}
					</div>
					<div className='bg-zinc-200 dark:bg-zinc-700 p-4 rounded-xl text-center'>
						<h3 className="font-poppins-semibold text-md text-jungleGreen-700 dark:text-jungleGreen-100 pb-2">
							Facebook - Share Count
						</h3>
						{dashboardData && dashboardData.result_history.shareCount.length>0 ? (
							<LineChart
								areaCategories={dashboardData.result_history.timestampArr.map((timestamp) => new Date(timestamp).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }))}
								areaSeries={[{ name: 'Share Count', data: dashboardData.result_history.shareCount }]}
							/>
						) : (
							<p data-testid="dashboard-share-count-not-available">There are no Facebook Share Count currently available</p>
						)
						}
					</div>
					<div className='bg-zinc-200 dark:bg-zinc-700 p-4 rounded-xl text-center'>
						<h3 className="font-poppins-semibold text-md text-jungleGreen-700 dark:text-jungleGreen-100 pb-2">
							Facebook - Reaction Count
						</h3>
						{dashboardData && dashboardData.result_history.reactionCount.length > 0 ? (
							<LineChart
								areaCategories={dashboardData.result_history.timestampArr.map((timestamp) => new Date(timestamp).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }))}
								areaSeries={[{ name: 'Reaction Count', data: dashboardData.result_history.reactionCount }]}
							/>
						) : (
							<p data-testid="dashboard-reaction-count-not-available">There are no Facebook Reaction Count currently available</p>
						)
						}
					</div>
					<div className='bg-zinc-200 dark:bg-zinc-700 p-4 rounded-xl text-center'>
						<h3 className="font-poppins-semibold text-md text-jungleGreen-700 dark:text-jungleGreen-100 pb-2">
							Pintrest - Pin Count
						</h3>
						{dashboardData && dashboardData.result_history.pinCount.length>0 ? (
							<LineChart
								areaCategories={dashboardData.result_history.timestampArr.map((timestamp) => new Date(timestamp).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }))}
								areaSeries={[{ name: 'Pin Count', data: dashboardData.result_history.pinCount }]}
							/>
						) : (
							<p data-testid="dashboard-pin-count-not-available">There are no Pintrest Pin Count currently available</p>
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

				<div className='gap-4 grid md:grid-cols-2 lg:grid-cols-2 mb-[1rem]'>
					<div className='bg-zinc-200 dark:bg-zinc-700 p-4 rounded-xl text-center'>
						<h3 className="font-poppins-semibold text-md text-jungleGreen-700 dark:text-jungleGreen-100 pb-2">
							Average Star Rating
							<InfoPopOver
								data-testid="popup-trustindex-ratings"
								heading="Trust Index Rating"
								content="Add description here"
								placement="right-end"
							/>
						</h3>
						{dashboardData && dashboardData.result_history.rating.length>0 ? (
							<LineChart
								areaCategories={dashboardData.result_history.timestampArr.map((timestamp) => new Date(timestamp).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }))}
								areaSeries={[{ name: 'Rating', data: dashboardData.result_history.rating }]} />
						) : (
							<p data-testid="dashboard-rating-not-available">There are no Ratings currently available</p>
						)
						}
					</div>
					<div className='bg-zinc-200 dark:bg-zinc-700 p-4 rounded-xl text-center '>
						<h3 className="font-poppins-semibold text-md text-jungleGreen-700 dark:text-jungleGreen-100 pb-2">
							Number of Reviews
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
						{dashboardData && dashboardData.result_history.numReviews.length>0 ? (
							<LineChart
								areaCategories={dashboardData.result_history.timestampArr.map((timestamp) => new Date(timestamp).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }))}
								areaSeries={[{ name: 'Reviews', data: dashboardData.result_history.numReviews }]} />
						) : (
							<p data-testid="dashboard-reviews-not-available">There are no Number of Reviews currently available</p>
						)
						}
					</div>
				</div>

				<div className='bg-zinc-200 dark:bg-zinc-700 p-4 rounded-xl text-center mb-[1rem]'>
					<h3 className="font-poppins-semibold text-md text-jungleGreen-700 dark:text-jungleGreen-100 pb-2">
						Star Ratings Distribution for Reviews
					</h3>

					{dashboardData && dashboardData.result_history && dashboardData.result_history.starRatings.length>0 ? (
						<StackedColumnChart
							dataLabel={dashboardData.result_history.timestampArr.map((timestamp) => new Date(timestamp).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }))}
							dataSeries={[1, 2, 3, 4, 5].map((star) => ({
								name: `${star} Star`,
								data: dashboardData.result_history.starRatings.map((period) => {
									if (Array.isArray(period)) {
										const rating = period.find((r) => r.stars === star);
										return rating ? rating.numReviews : 0;
									}
									else if (typeof period === 'object' && Object.keys(period).length === 0) {
										return 0;
									}
									else {
										console.error('Expected period to be an array, but got:', period);
										return 0;
									}
								})
							}))}
						/>

					) : (
						<p data-testid="dashboard-star-rating-not-available">There are no rating data currently available</p>
					)}

				</div>

				<div className='bg-zinc-200 dark:bg-zinc-700 p-4 rounded-xl text-center mb-[1rem]'>
					<h3 className="font-poppins-semibold text-md text-jungleGreen-700 dark:text-jungleGreen-100 pb-2">
						Ratings Intensity Heatmap
					</h3>
					{dashboardData && changedRatingsHeatmap.length > 0 ? (

						<HeatMapChart
							dataLabel={dashboardData?.result_history.timestampArr.slice(1).map((_, i) => {
								const prevMonth = new Date(dashboardData.result_history.timestampArr[i]);
								const nextMonth = new Date(dashboardData.result_history.timestampArr[i + 1]);
								return `${prevMonth.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}-${nextMonth.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}`;
							})}
							dataSeries={changedRatingsHeatmap}
						/>
					) : (
						<p data-testid="dashboard-star-rating-heatmap-not-available">The heatmap is not currently available</p>
					)

					}
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
						{dashboardData && dashboardData.result_history.trustIndex.length>0 ? (
							<LineChart
								areaCategories={dashboardData.result_history.timestampArr.map((timestamp) => new Date(timestamp).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }))}
								areaSeries={[{ name: 'Rating', data: dashboardData.result_history.trustIndex }]} />
						) : (
							<p data-testid="dashboard-trust-index-not-available">There are no Trust Index currently available</p>
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
						{dashboardData && dashboardData.result_history.NPS.length>0 ? (
							<ColumnChartNPS
								dataLabel={dashboardData.result_history.timestampArr.map((timestamp) => new Date(timestamp).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }))}
								dataSeries={dashboardData.result_history.NPS}
							/>
						) : (
							<p data-testid="dashboard-nps-not-available">There are no NPS Reviews currently available</p>
						)
						}
					</div>
				</div>
			</div>
		</div>
	)
}
'use client'
import React, { Suspense } from 'react';
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

export default function Dashboard() {
	return (
		<Suspense fallback={<div>Loading...</div>}>
			<DashboardPage />
		</Suspense>
	);
}

function DashboardPage() {
	const searchParams = useSearchParams();
	const url = searchParams.get('url');
	const router = useRouter();

	const backToScheduledScrape = () => {
		router.back();
	};

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
					Dashboard of {url}
				</h1>
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
			</div>

			{/* Keyword tracking */}
			<div>
				<h3 className="font-poppins-semibold text-lg text-jungleGreen-700 dark:text-jungleGreen-100">
					SEO Keyword Analysis
					<InfoPopOver
						data-testid="popup-seo-keyword-analaysis"
						heading="SEO Keyword Analysis"
						content="Add description here"
						placement="right-end"
					/>
				</h3>

				<div className='gap-4 grid md:grid-cols-2 lg:grid-cols-3'>
					<div className='bg-zinc-200 dark:bg-zinc-700 p-4 rounded-xl text-center'>
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
					</div>
				</div>
			</div>

			{/* News sentiment */}
			<div>
				<h3 className="font-poppins-semibold text-lg text-jungleGreen-700 dark:text-jungleGreen-100">
					News Sentiment
					<InfoPopOver
						data-testid="popup-news-sentiment"
						heading="News Sentiment"
						content="Add description here"
						placement="right-end"
					/>
				</h3>

				<div className='bg-zinc-200 dark:bg-zinc-700 p-4 rounded-xl text-center'>
					<AreaChart areaCategories={['10 Jan', '10 Feb', '10 Mar', '10 Apr']} areaSeries={[{ name: 'positive', data: [52, 58, 41, 28] }, { name: 'neutral', data: [10, 8, 30, 16] }, { name: 'negative', data: [38, 34, 29, 56] }]} />
				</div>
			</div>

			{/* Facebook */}
			<div>
				<h3 className="font-poppins-semibold text-lg text-jungleGreen-700 dark:text-jungleGreen-100">
					Facebook
					<InfoPopOver
						data-testid="popup-seo-keyword-analaysis"
						heading="SEO Keyword Analysis"
						content="Add description here"
						placement="right-end"
					/>
				</h3>

				<div className='gap-4 grid md:grid-cols-2 lg:grid-cols-3'>
					<div className='bg-zinc-200 dark:bg-zinc-700 p-4 rounded-xl text-center'>
						<h3 className="font-poppins-semibold text-md text-jungleGreen-700 dark:text-jungleGreen-100 pb-2">
							Comment Count
						</h3>
						<LineChart areaCategories={['10 Jan', '10 Feb', '10 Mar', '10 Apr', '10 May', '10 Jun', '10 Jul']} areaSeries={[{ name: 'Ranking', data: [19661, 19898, 20111, 20203, 20257, 20658, 21684] }]} />
					</div>
					<div className='bg-zinc-200 dark:bg-zinc-700 p-4 rounded-xl text-center'>
						<h3 className="font-poppins-semibold text-md text-jungleGreen-700 dark:text-jungleGreen-100 pb-2">
							Share Count
						</h3>
						<LineChart areaCategories={['10 Feb', '10 Mar', '10 Apr', '10 May', '10 Jun', '10 Jul']} areaSeries={[{ name: 'Ranking', data: [62322, 62358, 63367, 63800, 64112, 64218] }]} />
					</div>
					<div className='bg-zinc-200 dark:bg-zinc-700 p-4 rounded-xl text-center'>
						<h3 className="font-poppins-semibold text-md text-jungleGreen-700 dark:text-jungleGreen-100 pb-2">
							Reaction Count
						</h3>
						<LineChart
							areaCategories={[
								'10 Jan 24', '10 Feb 24', '10 Mar 24', '10 Apr 24'
							]}
							areaSeries={[
								{
									name: 'Ranking',
									data: [108645, 109762, 111231, 120009]
								}
							]}
						/>
					</div>
				</div>
			</div>

			{/* Reviews */}
			<div>
				<h3 className="font-poppins-semibold text-lg text-jungleGreen-700 dark:text-jungleGreen-100">
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
						<LineChart areaCategories={['10 Feb', '10 Mar', '10 Apr', '10 May', '10 Jun']} areaSeries={[{ name: 'Ranking', data: [2.1, 1.5, 1.7, 3.5, 3] }]} />
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
						<ColumnChartNPS
							dataLabel={['10 Feb', '10 Mar', '10 Apr', '10 May', '10 Jun', '10 Jul', '10 Aug', '10 Sept']}
							dataSeries={[10, -44, 49, 50, 90, 0, 10, 45]}
						/>
					</div>
				</div>
			</div>
		</div>
	)
}
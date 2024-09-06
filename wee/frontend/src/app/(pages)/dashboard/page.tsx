'use client'
import React, { Suspense } from 'react';
import { InfoPopOver } from '../../components/InfoPopOver';
import { LineChart } from '../../components/Graphs/LineChart';
import { AreaChart } from '../../components/Graphs/AreaChart';
import { ColumnChartNPS } from '../../components/Graphs/ColumnChart';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { Button } from '@nextui-org/react';

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

			{/* Keyword tracking */}
			<div>
				<h3 className="font-poppins-semibold text-lg text-jungleGreen-700 dark:text-jungleGreen-100 pb-2">
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
						<LineChart areaCategories={['10 Jan', '10 Feb', '10 Mar', '10 Apr', '10 May', '10 Jun', '10 Jul']} areaSeries={[{ name: 'Ranking', data: [8, 10, 18, 4, 7, 5, 3] }]} />
					</div>
					<div className='bg-zinc-200 dark:bg-zinc-700 p-4 rounded-xl text-center'>
						<h3 className="font-poppins-semibold text-md text-jungleGreen-700 dark:text-jungleGreen-100 pb-2">
							Online reading
						</h3>
						<LineChart areaCategories={['10 Feb', '10 Mar', '10 Apr', '10 May', '10 Jun', '10 Jul']} areaSeries={[{ name: 'Ranking', data: [3, 6, 14, 12, 4, 8] }]} />
					</div>
					<div className='bg-zinc-200 dark:bg-zinc-700 p-4 rounded-xl text-center'>
						<h3 className="font-poppins-semibold text-md text-jungleGreen-700 dark:text-jungleGreen-100 pb-2">
							Readerswarehouse south africa
						</h3>
						<LineChart areaCategories={['10 Jan', '10 Feb', '10 Mar', '10 Apr']} areaSeries={[{ name: 'Ranking', data: [4, 7, 8, 7] }]} />
					</div>
				</div>
			</div>

			{/* Keyword tracking */}
			<div>
				<h3 className="font-poppins-semibold text-lg text-jungleGreen-700 dark:text-jungleGreen-100 pb-2">
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

			<div>
				<h3 className="font-poppins-semibold text-lg text-jungleGreen-700 dark:text-jungleGreen-100 pb-2">
					Reviews
					<InfoPopOver
						data-testid="popup-nps-reviews"
						heading="News Sentiment"
						content="Add description here"
						placement="right-end"
					/>
				</h3>
				<div className='bg-zinc-200 dark:bg-zinc-700 p-4 rounded-xl text-center'>
					<ColumnChartNPS
						dataLabel={['10 Feb', '10 Mar', '10 Apr', '10 May', '10 Jun', '10 Jul', '10 Aug', '10 Sept']}
						dataSeries={[10, -44, 49, 50, 90, 0, 10, 45]}
					/>
				</div>
			</div>

		</div>
	)
}
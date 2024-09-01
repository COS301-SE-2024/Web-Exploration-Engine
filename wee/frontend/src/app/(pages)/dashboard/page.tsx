'use client'
import React from 'react';
import { InfoPopOver } from '../../components/InfoPopOver';
import { AreaChart } from '../../components/Graphs/AreaChart';

export default function Dashboard() {
	return (
		<div className='p-4 min-h-screen'>
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
						<AreaChart areaCategories={['10 Jan', '10 Feb', '10 Mar', '10 Apr', '10 May', '10 Jun', '10 Jul']} areaSeries={[{ name: 'a', data: [8, 10, 3, 4, 7, 5, 3] }]} />
					</div>
					<div className='bg-zinc-200 dark:bg-zinc-700 p-4 rounded-xl text-center'>
						<h3 className="font-poppins-semibold text-md text-jungleGreen-700 dark:text-jungleGreen-100 pb-2">
							Online reading
						</h3>
						<AreaChart areaCategories={['10 Feb', '10 Mar', '10 Apr', '10 May', '10 Jun', '10 Jul']} areaSeries={[{ name: 'a', data: [3, 6, 4, 9, 4, 1] }]} />
					</div>
					<div className='bg-zinc-200 dark:bg-zinc-700 p-4 rounded-xl text-center'>
						<h3 className="font-poppins-semibold text-md text-jungleGreen-700 dark:text-jungleGreen-100 pb-2">
							Readerswarehouse south africa
						</h3>
						<AreaChart areaCategories={['10 Jan', '10 Feb', '10 Mar', '10 Apr']} areaSeries={[{ name: 'a', data: [4, 7, 8, 7] }]} />
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

		</div>
	)
}
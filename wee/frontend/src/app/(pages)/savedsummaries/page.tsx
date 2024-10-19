'use client'
import React, { Suspense, useEffect, useState } from 'react';
import { PieChart } from '../../components/Graphs';
import { BarChart } from '../../components/Graphs';
import {
  TableHeader, TableColumn, TableBody, TableRow, TableCell,
  Button,
  Dropdown, DropdownItem, DropdownMenu, DropdownTrigger,
  Modal, ModalContent, ModalBody, useDisclosure, Input, ModalFooter,
} from "@nextui-org/react";
import { RadialBar } from '../../components/Graphs';
import { useScrapingContext } from '../../context/ScrapingContext';
import { useRouter, useSearchParams } from 'next/navigation';
import WEETable from '../../components/Util/Table';
import { FiClock, FiCheck, FiSearch } from "react-icons/fi";
import { InfoPopOver } from '../../components/InfoPopOver';
import Link from 'next/link';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas'; import { FiShare, FiDownload, FiSave } from "react-icons/fi";
import { useUserContext } from '../../context/UserContext';
import { saveReport } from '../../services/SaveReportService';
import { RadarChart } from '../../components/Graphs/RadarChart';
import { generatePDFReport } from '../../services/DownloadSummaryReport'
import { AreaChart } from '../../components/Graphs/AreaChart';
import useBeforeUnload from '../../hooks/useBeforeUnload';
import { ColumnChartWithLables } from '../../components/Graphs/ColumnChart';
import { SentimentStackedColumnChart, StackedColumnChart } from '../../components/Graphs/StackedColumnChart';
import { MdErrorOutline } from "react-icons/md";

interface weakClassification {
    url: string;
    metadataClass: string;
    score: number;
  }
  
  interface mismatchedUrls {
    url: string;
    metadataClass: string;
    domainClass: string;
  }
  
  interface RadarInterface {
    categories: string[],
    series: RadarSeries[]
  }
  
  export interface RadarSeries {
    name: string,
    data: number[]
  }
  
  interface AreaInterface {
    series: AreaSeries[]
  }
  
  export interface AreaSeries {
    name: string,
    data: number[]
  }
  

export default function SummaryReport() {
    return (
      <Suspense fallback={<div>Loading...</div>}>
        <SummaryComponent />
      </Suspense>
    );
}


function SummaryComponent() {
    const iconClasses = "text-xl text-default-500 pointer-events-none flex-shrink-0";

    const router = useRouter();

    const { summaries } = useUserContext();

    const searchParams = useSearchParams();
    const id = searchParams.get('id') as number | null;

    const [ summaryReport, setSummaryReport ] = useState<any>({});
    const [domainStatus, setDomainStatus] = useState<number[]>([]);
    const [domainErrorStatus, setDomainErrorStatus] = useState<number>(0);
    const [unclassifiedUrls, setUnclassifiedUrls] = useState<string[]>([]);
    const [industries, setIndustries] = useState<string[]>([]);
    const [industryPercentages, setIndustryPercentages] = useState<number[]>([]);
    const [weakClassification, setWeakClassification] = useState<weakClassification[]>();
    const [percentageMatch, setPercentageMatch] = useState<number>(0);
    const [mismatchedUrls, setMismatchedUrls] = useState<mismatchedUrls[]>();
    const [totalUrls, setTotalUrls] = useState<number>(0);
    const [parkedUrls, setParkedUrls] = useState<string[]>([]);
    const [scrapableUrls, setscrapableUrls] = useState<number>(0);
    const [avgTime, setAvgTime] = useState<number>(0);
    const [metaRadar, setMetaRadar] = useState<RadarInterface>();
    const [domainRadar, setDomainRadar] = useState<RadarInterface>();
    const [emotionsArea, setEmotionsArea] = useState<AreaInterface>();
    const [summaryDate, setSummaryDate] = useState<string>("");
    const [summaryName, setSummaryName] = useState<string>();

    const [isDownloadInProgress, setIsDownloadInProgress] = useState(false);

    useBeforeUnload();

    useEffect(() => {
        if (id) {
          const savedSummary = summaries.filter((res) => res.id == id);
          let summaryData;
          if(savedSummary && savedSummary[0]) {
            summaryData = savedSummary[0].reportData as any;
          }
          if(summaryData) {
            // format timestamp
            const date = new Date(savedSummary[0].savedAt ?? "");
            setSummaryReport(summaryData);
            setSummaryDate(date.toDateString());
            setSummaryName(savedSummary[0].reportName);
            setDomainStatus(summaryData.domainStatus ?? []);
            setDomainErrorStatus(summaryData.domainErrorStatus ?? 0);
            setUnclassifiedUrls(summaryData.industryClassification?.unclassifiedUrls ?? []);
            setIndustries(summaryData.industryClassification?.industryPercentages?.industries ?? []);
            setIndustryPercentages(summaryData.industryClassification?.industryPercentages?.percentages ?? []);
            setWeakClassification(summaryData.industryClassification?.weakClassification ?? []);
            setPercentageMatch(summaryData.domainMatch?.percentageMatch ?? 0);
            setMismatchedUrls(summaryData.domainMatch?.mismatchedUrls ?? []);
            setTotalUrls(summaryData.totalUrls ?? 0);
            setParkedUrls(summaryData.parkedUrls ?? []);
            setscrapableUrls(summaryData.scrapableUrls ?? 0);
            setAvgTime(summaryData.avgTime ?? 0);
            setMetaRadar(summaryData.metaRadar ?? { categories: [], series: [] });
            setDomainRadar(summaryData.domainRadar ?? { categories: [], series: [] });
            setEmotionsArea(summaryData.emotionsArea ?? { areaCategories: [], areaSeries: [] });
          }
          else {
            setSummaryName('');
          }
        }
    }, [id, summaries]);

    const backToScrapeResults = () => {
        router.back();
    };

    const handleDownloadReport = async () => {
        setIsDownloadInProgress(true);
        const savedSummary = summaries.filter((res) => res.id == id);
          let summaryData;
          if(savedSummary && savedSummary[0]) {
            summaryData = savedSummary[0].reportData as any;
          }
        try {
          await generatePDFReport(
            summaryData,
            weakClassification || [],
            parkedUrls || [],
            mismatchedUrls || []
          );
        }
        finally {
          setIsDownloadInProgress(false);
        }
      };

    return (
        <>
          <div className='min-h-screen p-4'>
            <Button
              className="text-md font-poppins-semibold bg-jungleGreen-700 text-dark-primaryTextColor dark:bg-jungleGreen-400 dark:text-primaryTextColor"
              onClick={backToScrapeResults}
              data-testid="btn-back"
            >
              Back
            </Button>

            {summaryName === '' &&
              <div>
                <span className="mt-4 mb-2 p-2 text-white bg-red-600 rounded-lg transition-opacity duration-300 ease-in-out flex justify-center align-middle">
                  <MdErrorOutline className="m-auto mx-1 mr-2" />
                  <p>You do not have access to this saved summary report.</p>
                </span>
              </div>
            }
    
            <div className="mt-4 mb-8 text-center">
                <h1 className="font-poppins-bold text-4xl text-jungleGreen-800 dark:text-dark-primaryTextColor"
                 data-testid="summary-title">
                  {summaryName}
                </h1>
                <h2 className="mt-4 font-poppins-semibold text-xl text-jungleGreen-800 dark:text-dark-primaryTextColor">
                  {summaryDate}
                </h2>
                {summaryName !== '' &&
                  <div className="mt-4 mr-4 flex justify-end">
                    <Dropdown data-testid="btn-dropdown">
                        <DropdownTrigger>
                            <Button
                            data-testid="dropdown-export"
                            isLoading={isDownloadInProgress}
                            id="btn-save-export"
                            variant="flat"
                            startContent={!isDownloadInProgress && <FiShare className="h-5 w-5" />}
                            spinner={
                                <svg
                                className="animate-spin h-5 w-5 text-current"
                                fill="none"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                                >
                                <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                />
                                <path
                                    className="opacity-75"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    fill="currentColor"
                                />
                                </svg>
                            }
                            >
                            Export
                            </Button>
                        </DropdownTrigger>
                        <DropdownMenu variant="flat" aria-label="Dropdown menu with icons">
                            <DropdownItem
                                key="download"
                                startContent={<FiDownload className={iconClasses} />}
                                description="Download the report to your device"
                                onAction={handleDownloadReport}
                                data-testid="download-report-button"
                            >
                                Download
                            </DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                  </div>
                }
            </div>  
        
            {/* General stats */}
            <h3 className="font-poppins-semibold text-2xl text-jungleGreen-700 dark:text-jungleGreen-100 pb-2">
              General stats
            </h3>
            <div className='gap-4 grid sm:grid-cols-3'>
    
              {/* Scraped stats */}
              <div data-testid="visual-scraped-stats" className='bg-zinc-200 dark:bg-zinc-700 p-4 rounded-xl text-center'>
                <div className='text-5xl flex justify-center'>
                  <FiSearch />
                </div>
                <div className='font-poppins-bold text-6xl text-jungleGreen-800 dark:text-jungleGreen-400 pt-4'>
                  {totalUrls} Urls
                </div>
                <div className='font-poppins-semibold text-lg'>
                  Scraped
                </div>
              </div>
    
              {/* Crawlable stats */}
              <div data-testid="visual-crawlable-stats" className='bg-zinc-200 dark:bg-zinc-700 p-4 rounded-xl text-center'>
                <div className='text-5xl flex justify-center'>
                  <FiCheck />
                </div>
                <div className='font-poppins-bold text-6xl text-jungleGreen-800 dark:text-jungleGreen-400 pt-4'>
                  {scrapableUrls} Urls
                </div>
                <div className='font-poppins-semibold text-lg'>
                  Crawlable
                </div>
              </div>
    
              {/* Avg scrape stats */}
              <div data-testid="visual-avg-scrape-stats" className='bg-zinc-200 dark:bg-zinc-700 p-4 rounded-xl text-center'>
                <div className='text-5xl flex justify-center'>
                  <FiClock />
                </div>
                <div className='font-poppins-bold text-6xl text-jungleGreen-800 dark:text-jungleGreen-400 pt-4'>
                  {avgTime} sec
                </div>
                <div className='font-poppins-semibold text-lg'>
                  Avg scrape time
                </div>
              </div>
            </div>
    
            {/* Industry classification */}
            <h3 className="font-poppins-semibold text-2xl text-jungleGreen-700 dark:text-jungleGreen-100 pb-2 mt-10">
              Industry classification
            </h3>
            <div data-testid="visual-industry-classification" className='gap-4 grid md:grid-cols-2'>
              <div id="pie-chart" className='bg-zinc-200 dark:bg-zinc-700 p-4 rounded-xl text-center md:col-span-1 flex flex-col justify-center'>
                <h3 className="font-poppins-semibold text-lg text-jungleGreen-700 dark:text-jungleGreen-100 mb-4 text-center">
                  Classification Distribution
                  <InfoPopOver
                    heading="Industry classification"
                    content="The classification of industries is based on machine learning models. WEE cannot guarantee the accuracy of the classifications."
                    placement="top"
                  />
                </h3>
    
                <span className='sm:hidden'>
                  <PieChart dataLabel={industries} dataSeries={industryPercentages} legendPosition={"bottom"} />
                </span>
                <span className='hidden sm:block'>
                  <PieChart dataLabel={industries} dataSeries={industryPercentages} legendPosition={"right"} />
                </span>
              </div>
              <div data-testid="visual-weak-classifications" className='bg-zinc-200 dark:bg-zinc-700 p-4 rounded-xl md:col-span-1'>
                <h3 className="font-poppins-semibold text-lg text-jungleGreen-700 dark:text-jungleGreen-100 mb-4 text-center">
                  Weak classifications
                  <InfoPopOver
                    heading="Industry classification"
                    content="Weak classifications are those that have a low confidence score (below 50%). WEE cannot guarantee the accuracy of the classifications."
                    placement="top"
                  />
                </h3>
                <WEETable
                  data-testid="table-weak-classifications"
                  isHeaderSticky
                  className='max-h-[15rem]'
                  aria-label="Industry classification table"
                >
                  <TableHeader>
                    <TableColumn key="name" className='rounded-lg sm:rounded-none'>
                      URL
                    </TableColumn>
                    <TableColumn key="role" className='hidden sm:table-cell'>
                      SCORE
                    </TableColumn>
                  </TableHeader>
    
                  <TableBody emptyContent={"There was no weak classifications"}>
                    {(weakClassification || []).map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <Link href={`/results?url=${encodeURIComponent(item.url)}`}>
                            {item.url}
                          </Link>
                        </TableCell>
                        <TableCell className='hidden sm:table-cell'>
                          {(item.score * 100).toFixed(2)}%
                        </TableCell>
                      </TableRow>
                    ))
                    }
                  </TableBody>
                </WEETable>
              </div>
            </div> {/* Grid */}
    
            {/* Domain match */}
            <h3 className="font-poppins-semibold text-2xl text-jungleGreen-700 dark:text-jungleGreen-100 pb-2 mt-10">
              Domain match
              <InfoPopOver
                heading="Domain Match"
                content="Domain match refers to the percentage of URLs that have the same domain classification as the metadata classification. WEE cannot guarantee the accuracy of the classifications."
                placement="right-end"
              />
            </h3>
            <div data-testid="visual-domain-match" className='gap-4 grid md:grid-cols-3'>
              <div id="radial-chart" className='bg-zinc-200 dark:bg-zinc-700 p-4 rounded-xl text-center md:col-span-1 flex flex-col justify-center'>
                <RadialBar dataLabel={['Match']} dataSeries={[percentageMatch]} />
              </div>
    
              <div className='bg-zinc-200 dark:bg-zinc-700 p-4 rounded-xl md:col-span-2'>
                <h3 className="font-poppins-semibold text-lg text-jungleGreen-700 dark:text-jungleGreen-100 mb-4 text-center">
                  Domain mismatch information
                </h3>
                <WEETable
                  data-testid="table-domain-match"
                  isHeaderSticky
                  className='max-h-[15rem]'
                  aria-label="Domain mismatch information table"
                >
                  <TableHeader>
                    <TableColumn key="name" className='rounded-lg sm:rounded-none'>
                      URL
                    </TableColumn>
                    <TableColumn key="role" className='hidden sm:table-cell'>
                      CLASSIFICATION - META
                    </TableColumn>
                    <TableColumn key="status" className='hidden sm:table-cell'>
                      DOMAIN MATCH
                    </TableColumn>
                  </TableHeader>
    
                  <TableBody emptyContent={"There was no mismatch"}>
                    {(mismatchedUrls || []).map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <Link href={`/results?url=${encodeURIComponent(item.url)}`}>
                            {item.url}
                          </Link>
                        </TableCell>
                        <TableCell className='hidden sm:table-cell'>
                          {item.metadataClass}
                        </TableCell>
                        <TableCell className='hidden sm:table-cell'>
                          {item.domainClass}
                        </TableCell>
                      </TableRow>
                    ))
                    }
                  </TableBody>
                </WEETable>
              </div>
            </div> {/* Grid */}
    
            {/* Classification Distribution */}
            <h3 className="font-poppins-semibold text-2xl text-jungleGreen-700 dark:text-jungleGreen-100 pb-2 mt-10">
              Industry Classification Distribution
              <InfoPopOver
                heading="Industry Classification Distribution"
                content="
                            The radar graphs illustrate the top three industries associated with each of the scraped domains, based on their metadata or domain names. 
                            Through these radar graphs, users can visually explore the distribution of industry classifications and observe how they intersect, which offers an insightful perspective.<br/><br/>
                            Our Industry Classification Distribution relies on a zero-shot machine learning model. However, WEE cannot provide an absolute guarantee of the accuracy of these classifications. <br/><br/>
                            Note: Feel free to click on a URL in the graph&apos;s legend. Doing so allows you to toggle visibility, especially if things start to appear busy."
                placement="right-end"
              />
            </h3>
            <div id="radar-chart" className='gap-4 grid lg:grid-cols-2'>
              <div className='bg-zinc-200 dark:bg-zinc-700 p-4 rounded-xl md:col-span-1'>
                <h3 className="font-poppins-semibold text-lg text-jungleGreen-700 dark:text-jungleGreen-100 mb-4 text-center">
                  Metadata
                </h3>
                <span className='block sm:hidden'>
                  Sorry, the metadata radar graph is not available on mobile devices
                </span>
                {metaRadar && metaRadar.categories.length > 0 && metaRadar.series.length > 0 ? (
                  <span data-testid="metaRadar" className='hidden sm:block'>
                    <RadarChart radarCategories={metaRadar.categories} radarSeries={metaRadar.series} />
                  </span>
                ) : (<></>)}
              </div>
              <div className='bg-zinc-200 dark:bg-zinc-700 p-4 rounded-xl md:col-span-1'>
                <h3 className="font-poppins-semibold text-lg text-jungleGreen-700 dark:text-jungleGreen-100 mb-4 text-center">
                  Domain
                </h3>
                <span className='block sm:hidden'>
                  Sorry, the domain radar graph is not available on mobile devices
                </span>
                {domainRadar && domainRadar.categories.length > 0 && domainRadar.series.length > 0 ? (
                  <span data-testid="domainRadar" className='hidden sm:block'>
                    <RadarChart radarCategories={domainRadar.categories} radarSeries={domainRadar.series} />
                  </span>
                ) : (<></>)}
              </div>
            </div>
    
            {/* Website status */}
            <h3 className="font-poppins-semibold text-2xl text-jungleGreen-700 dark:text-jungleGreen-100 pb-2 mt-10">
              Website status
            </h3>
            <div data-testid="visual-website-status" className='gap-4 grid md:grid-cols-3'>
              <div id="bar-chart" className='bg-zinc-200 dark:bg-zinc-700 p-4 rounded-xl text-center md:col-span-2 flex flex-col justify-center'>
                <BarChart dataLabel={['Live', 'Parked']} dataSeries={domainStatus} />
              </div>
    
              <div className='bg-zinc-200 dark:bg-zinc-700 p-4 rounded-xl md:col-span-1'>
                <h3 className="font-poppins-semibold text-lg text-jungleGreen-700 dark:text-jungleGreen-100 mb-4 text-center">
                  Parked sites
                </h3>
                <WEETable
                  isHeaderSticky
                  className='max-h-[15rem]'
                  aria-label="Parked sites table"
                >
                  <TableHeader>
                    <TableColumn key="name" className='rounded-lg sm:rounded-none'>
                      URL
                    </TableColumn>
                  </TableHeader>
    
                  <TableBody emptyContent={"There were no parked websites"}>
                    {(parkedUrls || []).map((url, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <Link href={`/results?url=${encodeURIComponent(url)}`}>
                            {url}
                          </Link>
                        </TableCell>
                      </TableRow>
                    ))
                    }
                  </TableBody>
    
                </WEETable>
              </div>
            </div> {/* Grid */}
    
            <h3 className="font-poppins-semibold text-2xl text-jungleGreen-700 dark:text-jungleGreen-100 pb-2 mt-10">
              Sentiment Analysis - Emotions
              <InfoPopOver
                heading="Sentiment Analysis - Emotions"
                content="Through the analysis of domain-specific metadata, we gain insights into specific emotional cues. 
                            This empowers users to precisely tailor their metadata settings, eliciting the desired emotional responses. 
                            Additionally, our Area Chart facilitates the comparative analysis of your domains against each other or even against competitors.
                            </br></br>Note: WEE cannot guarantee the accuracy of the analysis as it is based on machine learning models."
                placement="bottom"
              />
            </h3>
            {/* Sentiment Analysis */}
        <div id="area-chart" className='bg-zinc-200 dark:bg-zinc-700 p-4 rounded-xl text-center md:col-span-2 flex flex-col justify-center m-[4px]'>
          {
            summaryReport.emotionsArea && summaryReport.emotionsArea.series.length > 0 ? (
              <AreaChart areaCategories={['Anger', 'Disgust', 'Fear', 'Joy', 'Neutral', 'Sadness', 'Surprise']} areaSeries={summaryReport.emotionsArea.series} />
            ) : (<span className='flex flex-col justify-center text-center'>No data currently available</span>)
          }
        </div>

        {/* Social Media Engagement */}
        <h3 className="font-poppins-semibold text-2xl text-jungleGreen-700 dark:text-jungleGreen-100 mt-10">
          Social Media Engagement
          <InfoPopOver
            heading="Social Media Engagement"
            content="This chart displays Facebook engagement metrics such as shares, reactions, and comments for various URLs. The stack height for each URL indicates the total engagement for each URL. </br></br>
              Note: WEE used SharedCount - a platform that provides up-to-date information of Facebook"
            placement="top"
          />
        </h3>
        <div id="stacked-column-chart" className='bg-zinc-200 dark:bg-zinc-700 rounded-xl p-4' data-testid="socialMetricsGraph">
          {summaryReport.socialMetrics
            && summaryReport.socialMetrics.urls?.length > 0
            && summaryReport.socialMetrics.facebookCommentCount?.length > 0
            && summaryReport.socialMetrics.facebookReactionCount?.length > 0
            && summaryReport.socialMetrics.facebookShareCount?.length > 0
            ? (
              <StackedColumnChart
                dataLabel={summaryReport.socialMetrics.urls}
                dataSeries={[
                  { name: 'Share Count', data: summaryReport.socialMetrics.facebookShareCount },
                  { name: 'Reaction Count', data: summaryReport.socialMetrics.facebookReactionCount },
                  { name: 'Comment Count', data: summaryReport.socialMetrics.facebookCommentCount }]}
              />

            ) : (
              <div>There are no social metric data currently available</div>
            )}
        </div>

        {/* Reviews */}
        <h3 className="font-poppins-semibold text-2xl text-jungleGreen-700 dark:text-jungleGreen-100 mt-10">
          Reviews
          <InfoPopOver
            heading="Reviews"
            content="
                  The top 3 URLs for the NPS, Trust Index and Average Rating Scores respectively.</br>
                  Combined average star ratings for all URLs.
                  </br></br>
                  <i>Star Ratings for Reviews: </i>Displays how reviews are distributed across various star levels, providing an overview of customer feedback.</br>
                  <i>NPS (Net Promoter Score): </i>Reflects the likelihood of customers recommending a business, with scores below 0 indicating low likelihood, scores between 1 and 49 showing moderate likelihood, and scores above 49 signifying a strong likelihood of recommendation.</br>
                  <i>Hellopeter TrustIndex: </i>Assesses a business's credibility by analyzing factors such as star ratings, response times, review volume, and recent review relevance. Scores range from 0 to 10, representing the quality of customer service.</br>
                  <i>Average Star Rating: </i>Offers an overall indication of customer satisfaction based on the ratings given."
            placement="top"
          />
        </h3>
        <div className='gap-2 grid lg:grid-cols-3'>
          {summaryReport.topNPS && summaryReport.topNPS.urls.length > 0 ? (
            <div className='bg-zinc-200 dark:bg-zinc-700 p-2 rounded-xl'>
              <h3 className="font-poppins-semibold text-lg text-jungleGreen-700 dark:text-jungleGreen-100 my-2 text-center">
                Top 3 NPS Scores
              </h3>
              <span data-testid='nps-scores-graph'>
                <ColumnChartWithLables
                  dataLabel={summaryReport.topNPS.urls}
                  dataSeries={summaryReport.topNPS.scores}
                />
              </span>
            </div>
          ) : (
            <div className='bg-zinc-200 dark:bg-zinc-700 p-2 rounded-xl'>
              There are no NPS score data currently available
            </div>
          )}

          {summaryReport.topTrustIndex && summaryReport.topTrustIndex.urls.length > 0 ? (
            <div className='bg-zinc-200 dark:bg-zinc-700 p-2 rounded-xl'>
              <h3 className="font-poppins-semibold text-lg text-jungleGreen-700 dark:text-jungleGreen-100 my-2 text-center">
                Top 3 Trust Index Scores
              </h3>
              <span data-testid='trustindex-scores-graph'>
                <ColumnChartWithLables
                  dataLabel={summaryReport.topTrustIndex.urls}
                  dataSeries={summaryReport.topTrustIndex.scores}
                />
              </span>
            </div>
          ) : (
            <div className='bg-zinc-200 dark:bg-zinc-700 p-2 rounded-xl'>
              There are no trust index score data currently available
            </div>
          )}

          {summaryReport.topRating && summaryReport.topRating.urls.length > 0 ? (
            <div className='bg-zinc-200 dark:bg-zinc-700 p-2 rounded-xl'>
              <h3 className="font-poppins-semibold text-lg text-jungleGreen-700 dark:text-jungleGreen-100 my-2 text-center">
                Top 3 Average Rating Scores
              </h3>
              <span data-testid='rating-scores-graph'>
                <ColumnChartWithLables
                  dataLabel={summaryReport.topRating.urls}
                  dataSeries={summaryReport.topRating.scores}
                />
              </span>
            </div>
          ) : (
            <div className='bg-zinc-200 dark:bg-zinc-700 p-2 rounded-xl'>
              There are no rating score data currently available
            </div>
          )}

        </div>
        {summaryReport.averageStarRating && summaryReport.averageStarRating.length == 5 ? (
          <div id="star-chart" className='bg-zinc-200 dark:bg-zinc-700 rounded-xl p-4 mt-2'>
            <h3 className="font-poppins-semibold text-lg text-jungleGreen-700 dark:text-jungleGreen-100 mb-2 text-center">
              Average Star Ratings for Reviews
            </h3>
            <span data-testid='star-ratings-review-graph'>
              <ColumnChartWithLables
                dataLabel={[
                  '1 star',
                  '2 stars',
                  '3 stars',
                  '4 stars',
                  '5 stars',
                ]}
                dataSeries={[
                  summaryReport.averageStarRating[4],
                  summaryReport.averageStarRating[3],
                  summaryReport.averageStarRating[2],
                  summaryReport.averageStarRating[1],
                  summaryReport.averageStarRating[0],
                ]}
              />
            </span>
          </div>
        ) : (
          <div className='bg-zinc-200 dark:bg-zinc-700 rounded-xl p-4 mt-2'>
            There are no average star rating data currently available
          </div>
        )
        }

        {/* News */}
        <h3 className="font-poppins-semibold text-2xl text-jungleGreen-700 dark:text-jungleGreen-100 mt-10">
          Average News Sentiment
          <InfoPopOver
            heading="Average News Sentiment"
            content="The average sentiment is calculated for each URL based on the 10 most recent news articles.
            </br></br>Note: WEE cannot guarantee the accuracy of the analysis as it is based on machine learning models."
            placement="top"
          />
        </h3>
        <div id="news-chart" className='bg-zinc-200 dark:bg-zinc-700 rounded-xl p-4'>
          {summaryReport.newsSentiment && summaryReport.newsSentiment.urls.length > 0 && summaryReport.newsSentiment.positive.length > 0 && summaryReport.newsSentiment.negative.length > 0 && summaryReport.newsSentiment.neutral.length > 0 ? (
            <span data-testid='stacked-column-chart-news-sentiment'>

              <SentimentStackedColumnChart
                dataLabel={summaryReport.newsSentiment.urls}
                dataSeries={[
                  { name: 'Positive', data: summaryReport.newsSentiment.positive },
                  { name: 'Neutral', data: summaryReport.newsSentiment.neutral },
                  { name: 'Negative', data: summaryReport.newsSentiment.negative }]}
              />
            </span>

          ) : (
            <div>There are no news sentiment data currently available</div>
          )}
        </div>

      </div>



          
        </>
      );
}
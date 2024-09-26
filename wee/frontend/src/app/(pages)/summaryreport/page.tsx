'use client'
import React, { useEffect, useState } from 'react';
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
import { useRouter } from 'next/navigation';
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
import { sum } from 'cypress/types/lodash';
import { StackedColumnChart } from '../../components/Graphs/StackedColumnChart';

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
  const iconClasses = "text-xl text-default-500 pointer-events-none flex-shrink-0";

  const router = useRouter();

  const { summaryReport } = useScrapingContext();
  const { user } = useUserContext();

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

  const [isDownloadInProgress, setIsDownloadInProgress] = useState(false);

  useBeforeUnload();

  useEffect(() => {

    if (summaryReport) {
      //console.log("Summary Report:", summaryReport);
      setDomainStatus(summaryReport.domainStatus ?? []);
      setDomainErrorStatus(summaryReport.domainErrorStatus ?? 0);
      setUnclassifiedUrls(summaryReport.industryClassification?.unclassifiedUrls ?? []);
      setIndustries(summaryReport.industryClassification?.industryPercentages?.industries ?? []);
      setIndustryPercentages(summaryReport.industryClassification?.industryPercentages?.percentages ?? []);
      setWeakClassification(summaryReport.industryClassification?.weakClassification ?? []);
      setPercentageMatch(summaryReport.domainMatch?.percentageMatch ?? 0);
      setMismatchedUrls(summaryReport.domainMatch?.mismatchedUrls ?? []);
      setTotalUrls(summaryReport.totalUrls ?? 0);
      setParkedUrls(summaryReport.parkedUrls ?? []);
      setscrapableUrls(summaryReport.scrapableUrls ?? 0);
      setAvgTime(summaryReport.avgTime ?? 0);
      setMetaRadar(summaryReport.metaRadar ?? { categories: [], series: [] });
      setDomainRadar(summaryReport.domainRadar ?? { categories: [], series: [] });
      setEmotionsArea(summaryReport.emotionsArea ?? { areaCategories: [], areaSeries: [] });
    }

  }, [summaryReport]);

  const backToScrapeResults = () => {
    router.back();
  };

  // Save and Download Logic
  const [reportName, setReportName] = useState('');
  const [isInvalid, setIsInvalid] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true);
  const { isOpen, onOpenChange } = useDisclosure();
  const { isOpen: isSuccessOpen, onOpenChange: onSuccessOpenChange } = useDisclosure();

  const handleInputChange = (e: { target: { value: React.SetStateAction<string>; }; }) => {
    setReportName(e.target.value);
    if (e.target.value.length > 0) {
      setIsInvalid(false);
      setIsDisabled(false);
    }
    else {
      setIsInvalid(true);
      setIsDisabled(true);
    }
  };

  const handleSave = async (reportName: string) => {
    if (summaryReport) {
      try {
        await saveReport({
          reportName,
          reportData: summaryReport,
          userId: user?.uuid,
          isSummary: true,
        });
        onOpenChange();
        // report saved successfully popup
        onSuccessOpenChange();
      } catch (error) {
        console.error("Error saving report:", error);
      }
    }
  };

  // clear the input field when the modal is closed
  useEffect(() => {
    if (!isOpen) {
      setReportName('');
      setIsInvalid(false);
      setIsDisabled(true);
    }
  }, [isOpen]);


  const handleDownloadReport = async () => {
    setIsDownloadInProgress(true);
    try {
      await generatePDFReport(
        summaryReport,
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

        <div className="mt-4 mb-8 text-center">
          <h1 className="font-poppins-bold text-4xl text-jungleGreen-800 dark:text-dark-primaryTextColor">
            Summary Report
          </h1>
          <div className="mt-4 mr-4 flex justify-end">
            <Dropdown data-testid="btn-dropdown">
              <DropdownTrigger>
                <Button
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
                  Export/Save
                </Button>
              </DropdownTrigger>
              {user ? (
                <DropdownMenu variant="flat" aria-label="Dropdown menu with icons">
                  <DropdownItem
                    key="save"
                    startContent={<FiSave className={iconClasses} />}
                    description="Save the report on our website"
                    onAction={onOpenChange}
                    data-testid="save-report-button"
                  >
                    Save
                  </DropdownItem>
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
              ) : (
                <DropdownMenu variant="flat" aria-label="Dropdown menu with icons" disabledKeys={["save"]}>
                  <DropdownItem
                    key="save"
                    data-testid="dropdown-item-save"
                    startContent={<FiSave className={iconClasses} />}
                    description="Sign up or log in to save the report on our website"
                  >
                    Save
                  </DropdownItem>
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
              )}
            </Dropdown>
          </div>
        </div>



        {/* General stats */}
        <h3 className="font-poppins-semibold text-2xl text-jungleGreen-700 dark:text-jungleGreen-100 pb-2">
          General Statistics
        </h3>
        <div className='gap-4 grid sm:grid-cols-3'>

          {/* Scraped stats */}
          <div data-testid="visual-scraped-stats" className='bg-zinc-200 dark:bg-zinc-700 p-4 rounded-xl text-center flex flex-col justify-center h-full'>
            <div className='text-5xl flex justify-center'>
              <FiSearch />
            </div>
            <div className='font-poppins-bold text-6xl text-jungleGreen-800 dark:text-jungleGreen-400 pt-4'>
              {summaryReport.totalUrls} Urls
            </div>
            <div className='font-poppins-semibold text-lg'>
              Scraped
            </div>
          </div>

          {/* Crawlable stats */}
          <div data-testid="visual-crawlable-stats" className='bg-zinc-200 dark:bg-zinc-700 p-4 rounded-xl text-center flex flex-col justify-center h-full'>
            <div className='text-5xl flex justify-center'>
              <FiCheck />
            </div>
            <div className='font-poppins-bold text-6xl text-jungleGreen-800 dark:text-jungleGreen-400 pt-4'>
              {summaryReport.scrapableUrls} Urls
            </div>
            <div className='font-poppins-semibold text-lg'>
              Crawlable
            </div>
          </div>

          {/* Avg scrape stats */}
          <div data-testid="visual-avg-scrape-stats" className='bg-zinc-200 dark:bg-zinc-700 p-4 rounded-xl text-center flex flex-col justify-center h-full'>
            <div className='text-5xl flex justify-center'>
              <FiClock />
            </div>
            <div className='font-poppins-bold text-6xl text-jungleGreen-800 dark:text-jungleGreen-400 pt-4'>
              {summaryReport.avgTime} sec
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
        <h3 className="font-poppins-semibold text-2xl text-jungleGreen-700 dark:text-jungleGreen-100 mt-10">
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
        <h3 className="font-poppins-semibold text-2xl text-jungleGreen-700 dark:text-jungleGreen-100 mt-10">
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
        <div className='gap-4 grid md:grid-cols-3'>
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

        <h3 className="font-poppins-semibold text-2xl text-jungleGreen-700 dark:text-jungleGreen-100 mt-10">
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
        {
          summaryReport.emotionsArea && summaryReport.emotionsArea.series.length > 0 ? (
            <div id="area-chart" className='bg-zinc-200 dark:bg-zinc-700 p-4 rounded-xl text-center md:col-span-2 flex flex-col justify-center m-[4px]'>
              <AreaChart areaCategories={['Anger', 'Disgust', 'Fear', 'Joy', 'Neutral', 'Sadness', 'Surprise']} areaSeries={summaryReport.emotionsArea.series} />
            </div>
          ) : (<></>)
        }

        {/* Social Media Engagement */}
        <h3 className="font-poppins-semibold text-2xl text-jungleGreen-700 dark:text-jungleGreen-100 mt-10">
          Social Media Engagement
          <InfoPopOver
            heading="Social Media Engagement"
            content="abc"
            placement="top"
          />
        </h3>
        <div className='bg-zinc-200 dark:bg-zinc-700 rounded-xl p-4' data-testid="socialMetricsGraph">
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
            content="abc"
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
                Top 3 Rating Scores
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
          <div className='bg-zinc-200 dark:bg-zinc-700 rounded-xl p-4 mt-2'>
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
            content="abc"
            placement="top"
          />
        </h3>
        <div className='bg-zinc-200 dark:bg-zinc-700 rounded-xl p-4'>
          {summaryReport.newsSentiment && summaryReport.newsSentiment.urls.length > 0 && summaryReport.newsSentiment.positive.length > 0 && summaryReport.newsSentiment.negative.length > 0 && summaryReport.newsSentiment.neutral.length > 0 ? (
            <span data-testid='stacked-column-chart-news-sentiment'>

              <StackedColumnChart
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

      {/* Confirm save */}
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        placement="center"
        data-testid="save-report-modal"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalBody>
                <h1 className="text-center my-4 font-poppins-bold text-2xl text-jungleGreen-800 dark:text-dark-primaryTextColor">
                  Save Report
                </h1>
                <Input
                  autoFocus
                  label="Report Name"
                  placeholder="Enter a name for the report"
                  variant="bordered"
                  isInvalid={isInvalid}
                  color={isInvalid ? "danger" : "default"}
                  errorMessage="Please provide a report name"
                  value={reportName}
                  onChange={handleInputChange}
                />
              </ModalBody>
              <ModalFooter>
                <Button className="text-md font-poppins-semibold bg-jungleGreen-700 text-dark-primaryTextColor dark:bg-jungleGreen-400 dark:text-primaryTextColor" onPress={onClose}>
                  Close
                </Button>
                <Button
                  className="text-md font-poppins-semibold bg-jungleGreen-700 text-dark-primaryTextColor dark:bg-jungleGreen-400 dark:text-primaryTextColor"
                  onPress={() => handleSave(reportName)}
                  disabled={isDisabled}
                >
                  Save
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* successfull save */}
      <Modal
        isOpen={isSuccessOpen}
        onOpenChange={onSuccessOpenChange}
        className="font-poppins-regular"
        placement="center"
      >
        <ModalContent>
          <ModalBody>
            <h1 className="text-center my-4 font-poppins-bold text-2xl text-jungleGreen-800 dark:text-dark-primaryTextColor">
              Report saved successfully
            </h1>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
} 
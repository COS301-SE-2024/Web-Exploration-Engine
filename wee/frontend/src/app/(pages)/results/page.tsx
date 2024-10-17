'use client';
import React, { useEffect, useState, Suspense } from 'react';
import { Card, CardBody, Image } from '@nextui-org/react';
import {
  Button, Tabs, Tab,
  TableHeader, TableColumn, TableBody, TableRow, TableCell,
  Dropdown, DropdownTrigger, DropdownMenu, DropdownItem,
  Modal, ModalContent, ModalBody, useDisclosure, Input, ModalFooter, Link, ScrollShadow, Spinner
} from '@nextui-org/react';
import { Accordion, AccordionItem } from '@nextui-org/accordion';
import { FiShare, FiDownload, FiSave, FiActivity, FiSmartphone, FiClock, FiCompass, FiLayout, FiTag } from "react-icons/fi";
import { Chip } from '@nextui-org/react';
import { useSearchParams } from 'next/navigation';
import WEETable from '../../components/Util/Table';
import WEEPagination from '../../components/Util/Pagination';
import { useRouter } from 'next/navigation';
import { useScrapingContext } from '../../context/ScrapingContext';
import { useUserContext } from '../../context/UserContext';
import { InfoPopOver } from '../../components/InfoPopOver';
import jsPDF from 'jspdf';
import { saveReport } from '../../services/SaveReportService';
import { FiSearch, FiImage, FiAnchor, FiLink, FiCode, FiUmbrella, FiBook, FiType } from "react-icons/fi";
import { TitleTagsAnalysis, HeadingAnalysis, ImageAnalysis, InternalLinksAnalysis, MetaDescriptionAnalysis, UniqueContentAnalysis, SEOError, IndustryClassification, SentimentAnalysis, Metadata, ErrorResponse, LightHouseAnalysis, SiteSpeedAnalysis, MobileFriendlinessAnalysis, XMLSitemapAnalysis, CanonicalTagAnalysis, IndexabilityAnalysis, StructuredDataAnalysis, ScrapeNews, Reviews, ShareCountData, StarRating, ScraperResult } from '../../models/ScraperModels';
import WEETabs from '../../components/Util/Tabs';
import { handleDownloadReport } from '../../services/DownloadIndividualReport';
import { DonutChart } from '../../components/Graphs/DonutChart';
import CircularProgressSentiment from '../../components/CircularProgressSentiment';
import CircularProgressComparison from "../../components/CircularProgressComparison";
import WEEInput from '../../components/Util/Input';
import { pollForKeyWordResult } from '../../services/PubSubService';
import { MdErrorOutline } from "react-icons/md";
import { SEOKeywordAnalysis } from '../../models/KeywordAnalysisModels';
import useBeforeUnload from '../../hooks/useBeforeUnload';
import MockCiscoKeywordCiscoResult from '../../../../cypress/fixtures/pub-sub/cisco-keyword-cisco-status-result.json'
import MockCiscoKeywordMerakiFrontendResult from '../../../../cypress/fixtures/pub-sub/cisco-keyword-meraki-frontend-result.json'
import MockCiscoKeywordCiscoFrontendResult from '../../../../cypress/fixtures/pub-sub/cisco-keyword-cisco-frontend-result.json'
import MockCiscoKeywordMerakiResult from '../../../../cypress/fixtures/pub-sub/cisco-keyword-meraki-status-result.json'
import MockCiscoKeywordMerakiPollingStatus from '../../../../cypress/fixtures/pub-sub/cisco-keyword-meraki-analysis-poll.json'
import { result } from 'cypress/types/lodash';
import { ColumnChartWithLables, SentimentColumnChartWithLables } from '../../components/Graphs/ColumnChart';

interface Classifications {
  label: string;
  score: number;
}

interface SummaryInfo {
  title: string;
  description: string;
}

export default function Results() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResultsComponent />
    </Suspense>
  );
}

function isTitleTagAnalysis(data: TitleTagsAnalysis | SEOError): data is TitleTagsAnalysis {
  return 'length' in data || 'metaDescription' in data || 'recommendations' in data || 'isUrlWordsInDescription' in data;
}

function isHeadingAnalysis(data: HeadingAnalysis | SEOError): data is HeadingAnalysis {
  return 'count' in data || 'headings' in data || 'recommendations' in data;
}

function isImageAnalysis(data: ImageAnalysis | SEOError): data is ImageAnalysis {
  return 'errorUrls' in data || 'missingAltTextCount' in data || 'nonOptimizedCount' in data || 'reasonsMap' in data || 'recommendations' in data || 'totalImages' in data;
}

function isInternalLinkAnalysis(data: InternalLinksAnalysis | SEOError): data is InternalLinksAnalysis {
  return 'recommendations' in data || 'totalLinks' in data || 'uniqueLinks' in data;
}

function isMetaDescriptionAnalysis(data: MetaDescriptionAnalysis | SEOError): data is MetaDescriptionAnalysis {
  return 'length' in data || 'recommendations' in data || 'titleTag' in data;
}

function isUniqueContentAnalysis(data: UniqueContentAnalysis | SEOError): data is UniqueContentAnalysis {
  return 'recommendations' in data || 'textLength' in data || 'uniqueWordsPercentage' in data || 'repeatedWords' in data;
}

function isMetadata(data: Metadata | ErrorResponse): data is Metadata {
  return 'title' in data || 'description' in data || 'keywords' in data || 'ogTitle' in data || 'ogDescription' in data || 'ogImage' in data;
}

function isLightHouse(data: LightHouseAnalysis | SEOError): data is LightHouseAnalysis {
  return 'scores' in data || 'diagnostics' in data;
}

function isSiteSpeedAnalysis(data: SiteSpeedAnalysis | SEOError): data is SiteSpeedAnalysis {
  return 'loadTime' in data || 'recommendations' in data;
}

function isMobileFriendlinessAnalysis(data: MobileFriendlinessAnalysis | SEOError): data is MobileFriendlinessAnalysis {
  return 'isResponsive' in data || 'recommendations' in data;
}

function isXMLSitemapAnalysis(data: XMLSitemapAnalysis | SEOError): data is XMLSitemapAnalysis {
  return 'isSitemapValid' in data || 'recommendations' in data;
}

function isCanonicalTagAnalysis(data: CanonicalTagAnalysis | SEOError): data is CanonicalTagAnalysis {
  return 'canonicalTag' in data || 'isCanonicalTagPresent' in data || 'recommendations' in data;
}

function isIndexibilityAnalysis(data: IndexabilityAnalysis | SEOError): data is IndexabilityAnalysis {
  return 'isIndexable' in data || 'recommendations' in data;
}

function isStructuredDataAnalysis(data: StructuredDataAnalysis | SEOError): data is StructuredDataAnalysis {
  return 'count' in data || 'recommendations' in data;
}



function ResultsComponent() {
  const iconClasses = "text-xl text-default-500 pointer-events-none flex-shrink-0";

  const searchParams = useSearchParams();
  const url = searchParams.get('url');

  const [keywordError, setKeywordError] = useState('');
  const [keyword, setKeyword] = useState('');
  const [isKeywordLoading, setKeywordLoading] = useState(false);

  const [isDownloadInProgress, setIsDownloadInProgress] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const { processedUrls, results } = useScrapingContext();
  const { user } = useUserContext();

  const router = useRouter();

  const excludedUniqueRepeatedWords = ['for', 'in', 'to', 'a', 'the', 'with', 'on', 'and', 'you', 'your', 'of', 'is', 'r'];

  const [websiteStatus, setWebsiteStatus] = useState('');
  const [isCrawlable, setIsCrawlable] = useState(false);
  const [industryClassification, setIndustryClassification] =
    useState<Classifications[]>([]);
  const [domainClassification, setDomainClassification] =
    useState<Classifications[]>([]);
  const [metaData, setMetaData] = useState<Metadata | ErrorResponse>();
  const [logo, setLogo] = useState('');
  const [imageList, setImageList] = useState<string[]>([]);
  const [summaryInfo, setSummaryInfo] = useState<SummaryInfo>();
  const [homePageScreenShot, setHomePageScreenShot] = useState('');
  const [addresses, setAddresses] = useState<string[]>([]);
  const [emails, setEmails] = useState<string[]>([]);
  const [phones, setPhones] = useState<string[]>([]);
  const [socialLinks, setSocialLinks] = useState<string[]>([]);
  const [titleTagsAnalysis, setTitleTagAnalysis] = useState<TitleTagsAnalysis | SEOError>();
  const [headingAnalysis, setHeadingAnalysis] = useState<HeadingAnalysis | SEOError>();
  const [imagesAnalysis, setImageAnalysis] = useState<ImageAnalysis | SEOError>();
  const [internalLinkingAnalysis, setInternalLinkingAnalysis] = useState<InternalLinksAnalysis | SEOError>();
  const [metaDescriptionAnalysis, setMetaDescriptionAnalysis] = useState<MetaDescriptionAnalysis | SEOError>();
  const [uniqContentAnalysis, setUniqueContentAnalysis] = useState<UniqueContentAnalysis | SEOError>();
  const [sentimentAnalysis, setSentimentAnalysis] = useState<SentimentAnalysis>();
  const [lighthouseAnalysis, setLightHouseAnalysis] = useState<LightHouseAnalysis | SEOError>();
  const [siteSpeedAnalysis, setSiteSpeedAnalysis] = useState<SiteSpeedAnalysis | SEOError>();
  const [mobileFriendlinessAnalysis, setMobileFriendlinesAnalysis] = useState<MobileFriendlinessAnalysis | SEOError>();
  const [xmlSitemapAnalysis, setXmlSitemapAnalysis] = useState<XMLSitemapAnalysis | SEOError>();
  const [canonicalTagAnalysis, setCanonicalTagAnalysis] = useState<CanonicalTagAnalysis | SEOError>();
  const [indexibilityAnalysis, setIndexibilityAnalysis] = useState<IndexabilityAnalysis | SEOError>();
  const [structuredDataAnalysis, setStructuredDataAnalysis] = useState<StructuredDataAnalysis | SEOError>();
  const [seoKeywordAnalysis, setSeoKeywordAnalysis] = useState<SEOKeywordAnalysis>();
  const [scrapeNews, setScrapeNews] = useState<ScrapeNews[]>([]);
  const [reviews, setReviews] = useState<Reviews>();
  const [shareCountData, setShareCountData] = useState<ShareCountData>();

  useBeforeUnload();

  useEffect(() => {
    if (url) {
      const urlResults = results.filter((res) => res.url === url);

      if (urlResults && urlResults[0]) {
        console.log(urlResults[0]);
        setWebsiteStatus(urlResults[0].domainStatus === 'live' ? 'Live' : 'Parked');

        if ('errorStatus' in urlResults[0].robots) {
          setIsCrawlable(false);
        }
        else {
          setIsCrawlable(urlResults[0].robots.isUrlScrapable);
          setWebsiteStatus(urlResults[0].domainStatus === 'live' ? 'Live' : 'Parked');

          if (isMetadata(urlResults[0].metadata)) {
            setSummaryInfo({
              title: urlResults[0].metadata.title ?? urlResults[0].metadata.ogTitle ?? '',
              description: urlResults[0].metadata.description ?? urlResults[0].metadata.ogDescription ?? ''
            });
          }

          setLogo(urlResults[0].logo);
          setImageList(urlResults[0].images);
          setIndustryClassification(urlResults[0].industryClassification ? urlResults[0].industryClassification.zeroShotMetaDataClassify : []);
          setDomainClassification(urlResults[0].industryClassification ? urlResults[0].industryClassification.zeroShotDomainClassify : []);
          setMetaData(urlResults[0].metadata);

          if (urlResults[0].screenshot) {
            const screenShotBuffer = Buffer.from(urlResults[0].screenshot, 'base64');
            const screenShotUrl = `data:image/png;base64,${screenShotBuffer.toString('base64')}`;
            setHomePageScreenShot(screenShotUrl);
          }

          setAddresses(urlResults[0].addresses);

          if (urlResults[0].contactInfo) {
            setEmails(urlResults[0].contactInfo.emails);
            setPhones(urlResults[0].contactInfo.phones);
            setSocialLinks(urlResults[0].contactInfo.socialLinks);
          }

          if (urlResults[0].seoAnalysis) {
            setTitleTagAnalysis(urlResults[0].seoAnalysis.titleTagsAnalysis);
            setHeadingAnalysis(urlResults[0].seoAnalysis.headingAnalysis);
            setImageAnalysis(urlResults[0].seoAnalysis.imageAnalysis);
            setInternalLinkingAnalysis(urlResults[0].seoAnalysis.internalLinksAnalysis);
            setMetaDescriptionAnalysis(urlResults[0].seoAnalysis.metaDescriptionAnalysis);
            setUniqueContentAnalysis(urlResults[0].seoAnalysis.uniqueContentAnalysis);
            setSentimentAnalysis(urlResults[0].sentiment);
            setLightHouseAnalysis(urlResults[0].seoAnalysis.lighthouseAnalysis);
            setSiteSpeedAnalysis(urlResults[0].seoAnalysis.siteSpeedAnalysis);
            setMobileFriendlinesAnalysis(urlResults[0].seoAnalysis.mobileFriendlinessAnalysis);
            setXmlSitemapAnalysis(urlResults[0].seoAnalysis.XMLSitemapAnalysis);
            setCanonicalTagAnalysis(urlResults[0].seoAnalysis.canonicalTagAnalysis);
            setIndexibilityAnalysis(urlResults[0].seoAnalysis.indexabilityAnalysis);
            setStructuredDataAnalysis(urlResults[0].seoAnalysis.structuredDataAnalysis);
          }

          setScrapeNews(urlResults[0].scrapeNews);
          setReviews(urlResults[0].reviews);
          setShareCountData(urlResults[0].shareCountdata);
        }
      }
    }
  }, [url]);

  const backToScrapeResults = () => {
    router.back();
  };

  const handleSaveModalNavigation = () => {
    router.push('/savedreports');
  }

  const downloadSummaryReport = (key: any) => {
    setIsDownloadInProgress(true);

    // await new Promise((resolve) => setTimeout(resolve, 3000)); // test that it works

    try {
      //console.log("=================",shareCountData);
      handleDownloadReport(url, summaryInfo, websiteStatus, isCrawlable, industryClassification, domainClassification, addresses, emails, phones, socialLinks, titleTagsAnalysis, headingAnalysis, imagesAnalysis, internalLinkingAnalysis, metaDescriptionAnalysis, uniqContentAnalysis, sentimentAnalysis, xmlSitemapAnalysis, canonicalTagAnalysis, indexibilityAnalysis, siteSpeedAnalysis, structuredDataAnalysis, mobileFriendlinessAnalysis, lighthouseAnalysis,scrapeNews,reviews,shareCountData);
    }
    finally {
      setIsDownloadInProgress(false);
    }
  };

  // Pagination Logic
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(16);

  const handlePageChange = (page: React.SetStateAction<number>) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setItemsPerPage(Number(event.target.value));
    setCurrentPage(1); // Reset to first page when items per page changes
  };

  const indexOfLastImage = currentPage * itemsPerPage;
  const indexOfFirstImage = indexOfLastImage - itemsPerPage;
  const currentImages = imageList.slice(indexOfFirstImage, indexOfLastImage);


  // Save and Download Logic
  const [reportName, setReportName] = useState('');
  const [isInvalid, setIsInvalid] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true);
  const [error, setError] = useState('');
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
  function wait(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  const handleSave = async (reportName: string) => {
    
    
    const onlyLettersPattern = /^[A-Za-z0-9!?&\s]+$/; 

    reportName = reportName.trim();
    if (reportName.length === 0) {
      setIsInvalid(true);
      setIsDisabled(true);
      return;
    }
    else if (!onlyLettersPattern.test(reportName)) {
      setIsInvalid(true);
      setIsDisabled(true);
      setError("Report name is invalid. Only letters, numbers, !?& are allowed.");
      return;
    }

    const urlResults = results.filter((res) => res.url === url);
    if (urlResults && urlResults[0]) {
      try {
        setIsSaving(true); 
        await saveReport({
          reportName,
          reportData: urlResults[0],
          userId: user?.uuid,
          isSummary: false,
        });
        setIsSaving(false);
        onOpenChange();
        // report saved successfully popup
        onSuccessOpenChange();

      } catch (error) {
        console.error("Error saving report:", error);
      }
    }
  };

  useEffect(() => {
    if (!isOpen) {
      setReportName('');
      setIsInvalid(false);
      setIsDisabled(true);
      setError('');
    }
  }, [isOpen]);

  const sanitizeKeyword = (_keyword: string) => {
    return _keyword.replace(/[<>"'`;()]/g, '');
  }

  const handleKeyword = async () => {
    // check the input box
    // check that the url is there and valid (and make sure it is in the context)

    let url_decoded = decodeURIComponent(url ? url : '');

    if (process.env.NEXT_PUBLIC_TESTING_ENVIRONMENT == 'true') {
      console.log(processedUrls)
      url_decoded = processedUrls[0];
    }

    if (!url || !processedUrls.includes(url_decoded.toString())) {
      setKeywordError("URL is not valid");

      const timer = setTimeout(() => {
        setKeywordError('');
      }, 3000);

      return () => clearTimeout(timer);
    }

    // check that the keyword is entered by the user
    if (!keyword) {
      setKeywordError("Keyword cannot be empty");

      const timer = setTimeout(() => {
        setKeywordError('');
      }, 3000);

      return () => clearTimeout(timer);
    }

    // sanitize the keyword
    const sanitizedKeyword = sanitizeKeyword(keyword);
    if (sanitizedKeyword !== keyword) {
      setKeywordError('Keywords cannot contain special characters like <, >, ", \', `, ;, (, or )');

      const timer = setTimeout(() => {
        setKeywordError('');
      }, 3000);

      return () => clearTimeout(timer);
    }

    // make API call to get information about the keyword
    setKeywordLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_ENDPOINT || 'http://localhost:3002/api';
      console.log("HIERRRRR", url.toString(), keyword);
      const response = await fetch(
        `${apiUrl}/scraper/keyword-analysis?url=${encodeURIComponent(url.toString())}&keyword=${encodeURIComponent(keyword)}`
      );

      if (!response.ok) {
        throw new Error(`Error initiating scrape: ${response.statusText}`);
      }
      const initData = await response.json();
      console.log('Scrape initiation response:', initData);

      // Poll the API until the keyword is done
      try {
        let result = await pollForKeyWordResult(url.toString(), keyword) as SEOKeywordAnalysis;

        if (process.env.NEXT_PUBLIC_TESTING_ENVIRONMENT == 'true') {
          if (keyword && keyword == "meraki") {
            result = MockCiscoKeywordMerakiFrontendResult;
          }
          else {
            result = MockCiscoKeywordCiscoFrontendResult
          }
        }
        setSeoKeywordAnalysis(result);
        console.log('Keyword result after polling: ', result);
        setKeywordLoading(false);
      } catch (error) {
        console.error('Error when fetching keyword resuls:', error);
      }

    } catch (error) {
      console.error('Error when fetching keyword resuls:', error);
    }
  }

  return (
    <>
      <div className="min-h-screen p-4">
        <Button
          className="text-md font-poppins-semibold bg-jungleGreen-700 text-dark-primaryTextColor dark:bg-jungleGreen-400 dark:text-primaryTextColor"
          onClick={backToScrapeResults}
          data-testid="btn-back"
        >
          Back
        </Button>

        <div className="mb-8 text-center">
          <h1 className="mt-4 font-poppins-bold text-lg sm:text-xl md:text-2xl text-jungleGreen-800 dark:text-dark-primaryTextColor">
            Results of {url}
          </h1>
          <div className="mt-4 mr-4 flex justify-end">
            <Dropdown>
              <DropdownTrigger>
                <Button
                  isLoading={isDownloadInProgress}
                  variant="flat"
                  data-testid="btn-export-save-report"
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
                    onAction={downloadSummaryReport}
                    data-testid="download-report-button"
                  >
                    Download
                  </DropdownItem>
                </DropdownMenu>
              ) : (
                <DropdownMenu variant="flat" aria-label="Dropdown menu with icons" disabledKeys={["save"]}>
                  <DropdownItem
                    key="save"
                    startContent={<FiSave className={iconClasses} />}
                    description="Sign up or log in to save the report on our website"
                  >
                    Save
                  </DropdownItem>
                  <DropdownItem
                    key="download"
                    startContent={<FiDownload className={iconClasses} />}
                    description="Download the report to your device"
                    onAction={downloadSummaryReport}
                    data-testid="download-report-button"
                  >
                    Download
                  </DropdownItem>
                </DropdownMenu>
              )}
            </Dropdown>
          </div>
        </div>

        {/* Tabs */}
        <WEETabs data-testid="tabs-results" aria-label="Options">
          <Tab key="general" data-testid="tab-general" title="General Overview">
            <Card>
              <CardBody>

                {/* Summary */}
                <div className="py-3">
                  <h3 className="font-poppins-semibold text-lg text-jungleGreen-700 dark:text-jungleGreen-100 pb-2">
                    Summary
                    <InfoPopOver
                      data-testid="popup-summary"
                      heading="Website Summary"
                      content="This section provides a brief overview of the website based on the information extracted from the website's metadata."
                      placement="right-end"
                    />
                  </h3>
                  <Card shadow="sm" className="col-span-3 text-center bg-zinc-100 dark:bg-zinc-800">
                    <CardBody>
                      {(summaryInfo && (summaryInfo?.title || summaryInfo?.description)) ? (
                        <div data-testid="div-summary" className="text-center font-poppins-semibold text-lg text-jungleGreen-800 dark:text-dark-primaryTextColor">
                          <p data-testid="p-title">
                            {summaryInfo?.title}
                          </p>
                          <br />
                          {logo && (
                            <div className="flex justify-center">
                              <div className="flex justify-center">
                                <Image
                                  data-testid="img-logo"
                                  alt="Logo"
                                  src={logo}
                                  className="centered-image max-h-48 shadow-md shadow-zinc-150 dark:shadow-zinc-900"
                                />
                              </div>

                            </div>
                          )}
                          {!logo && (
                            <p className="p-4 rounded-lg mb-2 bg-zinc-200 dark:bg-zinc-700">
                              No logo available.
                            </p>
                          )}
                          <br />
                          <p data-testid="p-summary">
                            {summaryInfo?.description}
                          </p>
                        </div>

                      ) : (
                        <p className="p-4 rounded-lg mb-2 bg-zinc-200 dark:bg-zinc-700">
                          No summary information available.
                        </p>
                      )}
                    </CardBody>
                  </Card>
                </div>

                {/* Domain Tags */}
                <div className="py-3">
                  <h3 className="font-poppins-semibold text-lg text-jungleGreen-700 dark:text-jungleGreen-100 pb-2">
                    Domain Tags
                    <InfoPopOver
                      data-testid="popup-domain-tags"
                      heading="Domain Tags"
                      content="This section provides important tags to classify the website based on the extracted information. </br></br>
                        <i>Crawling status</i>: This field indicates if the url was allowed to be scraped </br>
                        <i>Status</i>: This field indicates if the website is live or parked. A live website is one that is active and accessible to users. A parked website is a domain that is registered but not in use. </br>
                        <i>*Industry</i>: This field provides the industry classification of the website. </br>
                        <i>*Domain match</i>: This field provides the domain classification of the website. </br>
                        <i>*Confidence Score</i>: This field provides the confidence score of the classification. </br>
                        <i>Note</i>: The fields marked with an asterisk (*) are generated using machine learning models."

                      placement="right-end"
                    />
                  </h3>
                  <WEETable data-testid="table-summary" isStriped aria-label="Example static collection table">
                    <TableHeader>
                      <TableColumn>SCRAPING CATEGORY</TableColumn>
                      <TableColumn>INFORMATION</TableColumn>
                    </TableHeader>
                    <TableBody>
                      <TableRow key="1">
                        <TableCell>Crawlable</TableCell>
                        <TableCell>
                          <Chip
                            radius="sm"
                            color={isCrawlable === true ? 'success' : 'warning'}
                            variant="flat"
                          >
                            {isCrawlable === true ? 'Yes' : 'No'}
                          </Chip>
                        </TableCell>
                      </TableRow>
                      <TableRow key="2">
                        <TableCell>Status</TableCell>
                        <TableCell>
                          <Chip
                            radius="sm"
                            color={websiteStatus === 'Live' ? 'success' : 'warning'}
                            variant="flat"
                          >
                            {websiteStatus === 'Live' ? 'Live' : 'Parked'}
                          </Chip>
                        </TableCell>
                      </TableRow>
                      <TableRow key="3">
                        <TableCell>Industry</TableCell>
                        <TableCell>
                          {industryClassification && industryClassification.length > 0 && !industryClassification.every(industryLabel => industryLabel.label == 'Unknown') ? (
                            industryClassification.map((classification, index) => (
                              <div className='my-2' key={index}>
                                <Chip radius="sm" color="secondary" variant="flat">
                                  {isCrawlable ? `${classification.label}` : 'N/A'}
                                </Chip>
                                <Chip
                                  radius="sm"
                                  color={
                                    classification.score &&
                                      classification.score * 100 > 80
                                      ? 'success'
                                      : classification.score &&
                                        classification.score * 100 >= 50
                                        ? 'warning'
                                        : 'danger'
                                  }
                                  variant="flat"
                                  className="ml-[2px] mt-2 sm:ml-2 sm:mt-0"
                                >
                                  {isCrawlable && classification.score
                                    ? `Confidence Score: ${(classification.score * 100).toFixed(2)}%`
                                    : 'Confidence Score: 0%'}
                                </Chip>
                              </div>
                            )))
                            : (
                              <span>No industry classifications available</span>
                            )}
                        </TableCell>
                      </TableRow>
                      <TableRow key="4">
                        <TableCell>Domain match</TableCell>
                        <TableCell>
                          {domainClassification && domainClassification.length > 0 && !domainClassification.every(domainLabel => domainLabel.label == 'Unknown') ? (
                            domainClassification.map((domain, index) => (
                              <div className='my-2' key={index}>
                                <Chip radius="sm" color="secondary" variant="flat">
                                  {isCrawlable ? `${domain.label}` : 'N/A'}
                                </Chip>
                                <Chip
                                  radius="sm"
                                  color={
                                    domain.score &&
                                      domain.score * 100 > 80
                                      ? 'success'
                                      : domain.score &&
                                        domain.score * 100 >= 50
                                        ? 'warning'
                                        : 'danger'
                                  }
                                  variant="flat"
                                  className="ml-[2px] mt-2 sm:ml-2 sm:mt-0"
                                >
                                  {isCrawlable && domain.score
                                    ? `Confidence Score: ${(domain.score * 100).toFixed(2)}%`
                                    : 'Confidence Score: 0%'}
                                </Chip>
                              </div>
                            ))
                          )
                            : (
                              <span>No domain match available</span>
                            )}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </WEETable>
                </div>

                {/* Address and contact details */}
                <div className='py-3'>
                  <h3 className="font-poppins-semibold text-lg text-jungleGreen-700 dark:text-jungleGreen-100 p-2">
                    Address and contact details
                  </h3>

                  <WEETable data-testid="table-contact" isStriped aria-label="Address and contact info table">
                    <TableHeader>
                      <TableColumn>CONTACT DETAILS</TableColumn>
                      <TableColumn>INFORMATION</TableColumn>
                    </TableHeader>
                    <TableBody>
                      <TableRow key="1">
                        <TableCell>Address</TableCell>
                        <TableCell>
                          {addresses && addresses.length == 0
                            ? <p>No address available</p>
                            :
                            addresses.map((address, index) => (
                              <p key={index}>{address}</p>
                            ))
                          }
                        </TableCell>
                      </TableRow>
                      <TableRow key="2">
                        <TableCell>Email</TableCell>
                        <TableCell>
                          {emails && emails.length == 0
                            ? <p>No email address available</p>
                            :
                            emails.map((email, index) => (
                              <p key={index}>{email}</p>
                            ))
                          }
                        </TableCell>
                      </TableRow>
                      <TableRow key="3">
                        <TableCell>Phone</TableCell>
                        <TableCell>
                          {phones && phones.length == 0
                            ? <p>No phone numbers available</p>
                            :
                            phones.map((phone, index) => (
                              <p key={index}>{phone}</p>
                            ))
                          }
                        </TableCell>
                      </TableRow>
                      <TableRow key="4">
                        <TableCell>Social Links</TableCell>
                        <TableCell>
                          {socialLinks && socialLinks.length == 0
                            ? <p>No social links available</p>
                            :
                            socialLinks.map((socialLink, index) => (
                              <p key={index}>{socialLink}</p>
                            ))
                          }
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </WEETable>
                </div>

              </CardBody>
            </Card>
          </Tab>
          <Tab key="media" data-testid="tab-media" title="Media">
            <Card>
              <CardBody>
                {/* Pagination of Images */}
                {imageList && imageList.length > 0 && (
                  <div data-testid="pagination-images" className="py-3">
                    <span className="flex justify-between">
                      <h3 className="font-poppins-semibold text-lg text-jungleGreen-700 dark:text-jungleGreen-100 p-2">
                        Images
                      </h3>
                      <label className="flex items-center text-default-400 text-small">
                        Images Per Page :
                        <select
                          value={itemsPerPage}
                          className="bg-transparent outline-none text-default-400 text-small"
                          onChange={handleItemsPerPageChange}
                          aria-label="Number of results per page"
                        >
                          <option value="4">4</option>
                          <option value="8">8</option>
                          <option value="16">16</option>
                          <option value="24">24</option>
                          <option value="36">36</option>
                          <option value="48">48</option>
                        </select>
                      </label>
                    </span>

                    <div
                      id="unique-results-image-container"
                      className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-2 py-6 pt-3"
                    >
                      {currentImages.map((item, index) => (
                        <Card key={index} id="unique-results-image">
                          <CardBody className="flex items-center justify-center overflow-visible p-0">
                            <Image
                              // shadow="sm"
                              // radius="lg"
                              // width="100%"
                              alt={'Image'}
                              className=" object-contain h-[140px] w-full"
                              src={item}
                            />
                          </CardBody>
                        </Card>
                      ))}
                    </div>

                    <div className="flex justify-content-center justify-items-center">
                      <WEEPagination
                        className="flex mx-auto p-5 place-content-center justify-center w-full"
                        total={Math.ceil(imageList.length / itemsPerPage)}
                        initialPage={1}
                        page={currentPage}
                        onChange={handlePageChange}
                      />
                    </div>
                  </div>
                )}

                {imageList.length === 0 && (
                  <>
                    <h3 className="font-poppins-semibold text-lg text-jungleGreen-700 dark:text-jungleGreen-100 p-2">
                      Images
                    </h3>
                    <p className="p-4 rounded-lg mb-2 bg-zinc-200 dark:bg-zinc-700">
                      No images available.
                    </p>
                  </>
                )}

                {/* Home page screenshot */}
                <div className='py-3'>
                  <h3 className="font-poppins-semibold text-lg text-jungleGreen-700 dark:text-jungleGreen-100 p-2">
                    Home page screenshot
                  </h3>

                  {(homePageScreenShot && homePageScreenShot !== 'data:image/png;base64,')
                    ? (
                      <div className="flex justify-center" data-testid="div-homepagescreenshot">
                        <div className="flex justify-center">
                          <Image
                            data-testid="img-homepagescreenshot"
                            alt="HomePageScreenShot"
                            src={homePageScreenShot}
                            className="shadow-md shadow-zinc-150 dark:shadow-zinc-900"
                          />
                        </div>
                      </div>
                    )
                    : (
                      <p className="p-4 rounded-lg mb-2 bg-zinc-200 dark:bg-zinc-700">
                        No homepage screenshot available.
                      </p>
                    )
                  }
                </div>

              </CardBody>
            </Card>
          </Tab>
          <Tab key="seo" data-testid="tab-seo" title="SEO Analysis">
            <Card>
              <CardBody>
                {/* Keyword Analysis */}
                <div>
                  <h3 className="font-poppins-semibold text-lg text-jungleGreen-700 dark:text-jungleGreen-100 p-2 px-0 pb-0">
                    Keyword Analysis
                    <InfoPopOver
                      data-testid="popup-keyword"
                      heading="Keyword Analysis"
                      content="The code normalises the URL by extracting its hostname, performs a Google search using Puppeteer, extracts search result titles and links, and checks if the hostname matches any search results to determine its ranking position."
                      placement="bottom"
                    />
                  </h3>

                  {/* Enter keyword */}
                  <div className='bg-zinc-200 dark:bg-zinc-700 rounded-xl p-3 my-2'>
                    <div className='flex flex-col sm:flex-row w-full justify-center items-center'>
                      <Input
                        data-testid="keyword-input"
                        label="Enter keywords"
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        className='my-2 sm:my-0'
                      />
                      <Button
                        data-testid="btn-seo-keyword"
                        className="w-full sm:w-auto sm:ml-4 font-poppins-semibold text-lg  bg-jungleGreen-700 text-dark-primaryTextColor dark:bg-jungleGreen-400 dark:text-primaryTextColor"
                        onClick={handleKeyword}
                      >
                        Lookup
                      </Button>
                    </div>

                    {isKeywordLoading ? (
                      <div className="flex w-full justify-center my-2">
                        <Spinner color="default" />
                      </div>
                    ) : null}

                    {keywordError ? (
                      <span className="mt-4 mb-2 p-2 text-white bg-red-600 rounded-lg transition-opacity duration-300 ease-in-out flex justify-center align-middle">
                        <MdErrorOutline className="m-auto mx-1" />
                        <p data-testid="keyword-error">{keywordError}</p>
                      </span>
                    ) : (
                      <></>
                    )}

                    {/* Keyword result */}
                    <div className='mt-2'>
                      {seoKeywordAnalysis && (
                        <>
                          <div className='gap-2 grid sm:grid-cols-2 md:grid-cols-3'>
                            <div className='bg-zinc-300 dark:bg-zinc-800 rounded-xl text-center flex justify-center items-center p-4 md:col-span-1'>
                              <div>
                                {seoKeywordAnalysis.ranking && seoKeywordAnalysis.ranking == 'Not ranked in the top results'
                                  ? <div data-testid="keyword_not_ranked" className='font-poppins-bold text-4xl lg:text-6xl text-jungleGreen-800 dark:text-jungleGreen-400'>
                                    Not ranked in top 10
                                  </div>
                                  :
                                  <>
                                    <div className='font-poppins-semibold text-lg'>
                                      Ranked
                                    </div>
                                    <div className='font-poppins-bold text-6xl text-jungleGreen-800 dark:text-jungleGreen-400' data-testid="keyword_ranked">
                                      #{seoKeywordAnalysis.ranking}
                                    </div>
                                  </>
                                }
                              </div>
                            </div>
                            <div className='bg-zinc-300 dark:bg-zinc-800 rounded-xl p-4 md:col-span-2' data-testid="keyword_top10">
                              {Array.isArray(seoKeywordAnalysis.topTen) ? (
                                seoKeywordAnalysis.topTen.map((higherRankedUrl, index) => (
                                  <div key={index}>
                                    <span className='font-poppins-semibold'>{index + 1}. </span>
                                    <span>{higherRankedUrl}</span>
                                  </div>
                                ))
                              ) : (
                                <div>No higher ranked URLs available.</div>
                              )}
                            </div>
                          </div>
                          <div data-testid='keyword_recommendations' className='py-2 bg-jungleGreen-200/60 dark:bg-jungleGreen-400/40 p-2 rounded-xl mt-2'>
                            <h5 className='font-poppins-semibold text-jungleGreen-700 dark:text-jungleGreen-100'>
                              Recommendations
                            </h5>
                            <p data-testid='p_keyword_recommendations'>{seoKeywordAnalysis.recommendation}</p>
                          </div>
                        </>
                      )}
                    </div>

                  </div>
                </div> {/* EO Keyword Analysis */}

                {/* Onpage Analysis */}
                <div>
                  {/* Onpage Analysis Heading */}
                  <h3 className="font-poppins-semibold text-lg text-jungleGreen-700 dark:text-jungleGreen-100 p-2 px-0 pb-0">
                    On-Page Analysis
                  </h3>

                  {/* Image Analysis */}
                  <div className='bg-zinc-200 dark:bg-zinc-700 rounded-xl p-3 my-2'>
                    {/* Heading */}
                    <div className='flex mb-2'>
                      <div className='my-auto flex text-4xl justify-center rounded-full bg-jungleGreen-700 dark:bg-jungleGreen-300 p-2 text-dark-primaryTextColor dark:text-primaryTextColor'>
                        <FiImage />
                      </div>
                      <div className='my-auto'>
                        <h4 className='font-poppins-semibold text-jungleGreen-700 dark:text-jungleGreen-100 pl-4 text-lg'>
                          Images
                          <InfoPopOver
                            data-testid="popup-images"
                            heading="Analysis of Images"
                            content="The code extracts all img elements, mapping their src and alt attributes to an array. It checks for alt text, image optimization, and formats like PNG, JPEG, WebP, and SVG. The function returns a report on total images, missing alt text, non-optimized images, reasons for non-optimization and recommendations. Proper alt text improves accessibility and search rankings, while optimised images enhance loading times and user experience, benefiting SEO."
                            placement="bottom"
                          />
                        </h4>
                      </div>
                    </div>

                    {/* Content */}
                    {
                      imagesAnalysis && isImageAnalysis(imagesAnalysis) ?
                        <div>
                          {/* Count */}
                          <div className='gap-6 grid sm:grid-cols-3'>

                            <div className='bg-zinc-300 dark:bg-zinc-800 rounded-xl text-center flex justify-center items-center p-4'>
                              <div>
                                <div data-testid="div-images-total" className='font-poppins-bold text-6xl text-jungleGreen-800 dark:text-jungleGreen-400'>
                                  {imagesAnalysis?.totalImages}
                                </div>
                                <div className='font-poppins-semibold text-lg'>
                                  Total Images
                                </div>
                              </div>
                            </div>

                            <div className='bg-zinc-300 dark:bg-zinc-800 rounded-xl text-center flex justify-center items-center p-4'>
                              <div>
                                <div data-testid="div-images-missing-alt" className='font-poppins-bold text-6xl text-jungleGreen-800 dark:text-jungleGreen-400'>
                                  {imagesAnalysis?.missingAltTextCount}
                                </div>
                                <div className='font-poppins-semibold text-lg'>
                                  Missing Alt. Text
                                </div>
                              </div>
                            </div>

                            <div className='bg-zinc-300 dark:bg-zinc-800 rounded-xl text-center flex justify-center items-center p-4'>
                              <div>
                                <div data-testid="nonOptimisedImages" className='font-poppins-bold text-6xl text-jungleGreen-800 dark:text-jungleGreen-400'>
                                  {imagesAnalysis?.nonOptimizedCount}
                                </div>
                                <div className='font-poppins-semibold text-lg'>
                                  Non-Optimized Images
                                </div>
                              </div>
                            </div>

                          </div>

                          {
                            imagesAnalysis?.reasonsMap.format.length != 0 &&
                            <div className='py-2'>
                              <h5 className='font-poppins-semibold text-jungleGreen-700 dark:text-jungleGreen-100'>
                                The format of the following URLs are incorrect
                              </h5>
                              <div className='overflow-x-scroll'>
                                <ScrollShadow data-testid="scroll-format-urls" hideScrollBar className="max-h-[400px]" size={75}>
                                  {imagesAnalysis?.reasonsMap.format.map((formatUrl, index) => (
                                    <p key={index}>
                                      <Link href={formatUrl}>{formatUrl}</Link>
                                    </p>
                                  ))}
                                </ScrollShadow>
                              </div>
                            </div>
                          }

                          {
                            imagesAnalysis?.reasonsMap.size.length != 0 &&
                            <div className='py-2'>
                              <h5 className='font-poppins-semibold text-jungleGreen-700 dark:text-jungleGreen-100'>
                                The size of the following URLs are to big
                              </h5>
                              <div data-testid="div-format-urls" className='overflow-x-scroll'>
                                {imagesAnalysis?.reasonsMap.size.map((reasonUrl, index) => (
                                  <p key={index}>
                                    <Link href={reasonUrl}>{reasonUrl}</Link>
                                  </p>
                                ))}
                              </div>
                            </div>
                          }

                          {
                            imagesAnalysis?.reasonsMap.other.length != 0 &&
                            <div className='py-2'>
                              <h5 className='font-poppins-semibold text-jungleGreen-700 dark:text-jungleGreen-100'>
                                The following images have some other problems
                              </h5>
                              <div data-testid="div-other-urls" className='overflow-x-scroll'>
                                {imagesAnalysis?.reasonsMap.other.map((otherUrl, index) => (
                                  <p key={index}>
                                    <Link href={otherUrl}>{otherUrl}</Link>
                                  </p>
                                ))}
                              </div>
                            </div>
                          }

                          {
                            imagesAnalysis?.recommendations != '' &&
                            <div data-testid='images_recommendations' className='py-2 bg-jungleGreen-200/60 dark:bg-jungleGreen-400/40 p-2 rounded-xl mt-2'>
                              <h5 className='font-poppins-semibold text-jungleGreen-700 dark:text-jungleGreen-100'>
                                Recommendations
                              </h5>
                              <p>{imagesAnalysis?.recommendations}</p>
                            </div>
                          }
                        </div>
                        :
                        <>
                          {imagesAnalysis?.error}
                        </>
                    }
                  </div> {/* EO Image Analysis */}

                  {/* Internal Linking Analysis */}
                  <div className='bg-zinc-200 dark:bg-zinc-700 rounded-xl p-3 my-2'>
                    {/* Heading */}
                    <div className='flex mb-2'>
                      <div className='my-auto flex text-4xl justify-center rounded-full bg-jungleGreen-700 dark:bg-jungleGreen-300 p-2 text-dark-primaryTextColor dark:text-primaryTextColor'>
                        <FiLink />
                      </div>
                      <div className='my-auto'>
                        <h4 className='font-poppins-semibold text-jungleGreen-700 dark:text-jungleGreen-100 pl-4 text-lg'>
                          Internal Linking
                          <InfoPopOver
                            data-testid="popup-linking"
                            heading="Analysis of Internal Linking"
                            content="The code selects internal links (anchor tags with href attributes starting with /), checks if there are fewer than 5 unique internal links, and recommends adding more if needed. Internal links improve site navigation and user experience, and they help search engines understand page relationships, boosting SEO. Ensuring a sufficient number of internal links enhances both site usability and search engine indexing."
                            placement="bottom"
                          />
                        </h4>
                      </div>
                    </div>

                    {/* Content */}
                    {
                      internalLinkingAnalysis && isInternalLinkAnalysis(internalLinkingAnalysis) ?
                        <div>
                          {/* Count */}
                          <div className='gap-6 grid sm:grid-cols-2'>
                            <div className='bg-zinc-300 dark:bg-zinc-800 p-4 rounded-xl text-center flex justify-center items-center'>
                              <div>
                                <div data-testid="div-links-total" className='font-poppins-bold text-6xl text-jungleGreen-800 dark:text-jungleGreen-400'>
                                  {internalLinkingAnalysis?.totalLinks}
                                </div>
                                <div className='font-poppins-semibold text-lg'>
                                  Total Links
                                </div>
                              </div>
                            </div>

                            <div className='bg-zinc-300 dark:bg-zinc-800 p-4 rounded-xl text-center flex justify-center items-center'>
                              <div>
                                <div data-testid="div-links-unique" className='font-poppins-bold text-6xl text-jungleGreen-800 dark:text-jungleGreen-400'>
                                  {internalLinkingAnalysis?.uniqueLinks}
                                </div>
                                <div className='font-poppins-semibold text-lg'>
                                  Unique Links
                                </div>
                              </div>
                            </div>
                          </div>

                          {
                            internalLinkingAnalysis?.recommendations != '' &&
                            <div data-testid='internalLinking_recommendations' className='py-2 bg-jungleGreen-200/60 dark:bg-jungleGreen-400/40 p-2 rounded-xl mt-2'>
                              <h5 className='font-poppins-semibold text-jungleGreen-700 dark:text-jungleGreen-100'>
                                Recommendations
                              </h5>
                              <p>{internalLinkingAnalysis?.recommendations}</p>
                            </div>
                          }
                        </div>
                        :
                        <>
                          {internalLinkingAnalysis?.error}
                        </>
                    }
                  </div> {/* EO Internal Linking Analysis */}

                  {/* Heading Analysis */}
                  <div className='bg-zinc-200 dark:bg-zinc-700 rounded-xl p-3 my-2'>
                    {/* Heading */}
                    <div className='flex mb-2'>
                      <div className='my-auto flex text-4xl justify-center rounded-full bg-jungleGreen-700 dark:bg-jungleGreen-300 p-2 text-dark-primaryTextColor dark:text-primaryTextColor'>
                        <FiUmbrella />
                      </div>
                      <div className='my-auto'>
                        <h4 className='font-poppins-semibold text-jungleGreen-700 dark:text-jungleGreen-100 pl-4 text-lg'>
                          Headings
                          <InfoPopOver
                            data-testid="popup-headings"
                            heading="Analysis of Headings"
                            content="The code selects all heading tags (H1 to H6) and recommends adding them if none are found. Proper use of headings improves content structure, readability, accessibility, and helps search engines index and understand the content hierarchy."
                            placement="bottom"
                          />
                        </h4>
                      </div>
                    </div>

                    {/* Content */}
                    {
                      headingAnalysis && isHeadingAnalysis(headingAnalysis) ?
                        <div>
                          <div className='py-1'>
                            <h5 className='font-poppins-semibold text-jungleGreen-700 dark:text-jungleGreen-100'>
                              Count
                            </h5>
                            <p data-testid="headingscount">{headingAnalysis?.count}</p>
                          </div>

                          <div className='py-1'>
                            <h5 className='font-poppins-semibold text-jungleGreen-700 dark:text-jungleGreen-100'>
                              List of Headings
                            </h5>
                            <ScrollShadow data-testid="popup-headings" hideScrollBar className="max-h-[400px]" size={150}>
                              {headingAnalysis?.headings.map((heading, index) => (
                                <p key={index}>{heading}</p>
                              ))}
                            </ScrollShadow>
                          </div>

                          {
                            headingAnalysis?.recommendations != '' &&
                            <div data-testid='headings_recommendations' className='py-2 bg-jungleGreen-200/60 dark:bg-jungleGreen-400/40 p-2 rounded-xl mt-2'>
                              <h5 className='font-poppins-semibold text-jungleGreen-700 dark:text-jungleGreen-100'>
                                Recommendations
                              </h5>
                              <p>{headingAnalysis?.recommendations}</p>
                            </div>
                          }
                        </div>
                        :
                        <>
                          {headingAnalysis?.error}
                        </>
                    }
                  </div> {/* EO Heading Analysis */}

                  {/* MetaDescription Analysis */}
                  <div className='bg-zinc-200 dark:bg-zinc-700 rounded-xl p-3 my-2'>
                    {/* Heading */}
                    <div className='flex mb-2'>
                      <div className='my-auto flex text-4xl justify-center rounded-full bg-jungleGreen-700 dark:bg-jungleGreen-300 p-2 text-dark-primaryTextColor dark:text-primaryTextColor'>
                        <FiCode />
                      </div>
                      <div className='my-auto'>
                        <h4 className='font-poppins-semibold text-jungleGreen-700 dark:text-jungleGreen-100 pl-4 text-lg'>
                          Meta Description
                          <InfoPopOver
                            data-testid="popup-meta-description"
                            heading="Analysis of Meta Data"
                            content="This code checks if the meta description is within the optimal length (120-160 characters) and ensures that words from the URL are included in the meta description. This SEO analysis enhances visibility, relevance, and click-through rates for web pages."
                            placement="bottom"
                          />
                        </h4>
                      </div>
                    </div>

                    {/* Content */}
                    {
                      metaDescriptionAnalysis && isMetaDescriptionAnalysis(metaDescriptionAnalysis) ?
                        <div>
                          <div className='py-1'>
                            <h5 className='font-poppins-semibold text-jungleGreen-700 dark:text-jungleGreen-100'>
                              Title Tag
                            </h5>
                            <p data-testid="p-metadescription-tag">{metaDescriptionAnalysis?.titleTag}</p>
                          </div>

                          <div className='py-1'>
                            <h5 className='font-poppins-semibold text-jungleGreen-700 dark:text-jungleGreen-100'>
                              Length
                            </h5>
                            <p data-testid="p-metadescription-length">{metaDescriptionAnalysis?.length}</p>
                          </div>

                          {
                            metaDescriptionAnalysis?.recommendations !== '' && (
                              <div data-testid='meta_recommendations' className='py-2 bg-jungleGreen-200/60 dark:bg-jungleGreen-400/40 p-2 rounded-xl mt-2'>
                                <h5 className='font-poppins-semibold text-jungleGreen-700 dark:text-jungleGreen-100'>
                                  Recommendations
                                </h5>
                                <p>{metaDescriptionAnalysis?.recommendations}</p>
                              </div>
                            )}
                        </div>
                        :
                        <>
                          {metaDescriptionAnalysis?.error}
                        </>
                    }
                  </div> {/* EO MetaDescription Analysis */}

                  {/* Title Tags */}
                  <div className='bg-zinc-200 dark:bg-zinc-700 rounded-xl p-3 my-2'>
                    {/* Heading */}
                    <div className='flex mb-2'>
                      <div className='my-auto flex text-4xl justify-center rounded-full bg-jungleGreen-700 dark:bg-jungleGreen-300 p-2 text-dark-primaryTextColor dark:text-primaryTextColor'>
                        <FiType />
                      </div>
                      <div className='my-auto'>
                        <h4 className='font-poppins-semibold text-jungleGreen-700 dark:text-jungleGreen-100 pl-4 text-lg'>
                          Title Tags
                          <InfoPopOver
                            data-testid="popup-title-tags"
                            heading="Analysis of Title tag"
                            content="This code extracts the title tag content and checks if its length is within the optimal range of 50-60 characters. Properly sized title tags are crucial as they serve as clickable headlines in search results and browser tabs, providing enough information without being truncated."
                            placement="bottom"
                          />
                        </h4>
                      </div>
                    </div>

                    {/* Content */}
                    {
                      titleTagsAnalysis && isTitleTagAnalysis(titleTagsAnalysis) ?
                        <div>
                          <div className='py-1'>
                            <h5 className='font-poppins-semibold text-jungleGreen-700 dark:text-jungleGreen-100'>
                              Metadata Description
                            </h5>
                            <p data-testid="p-titletag-description">{titleTagsAnalysis?.metaDescription}</p>
                          </div>

                          <div className='py-1'>
                            <h5 className='font-poppins-semibold text-jungleGreen-700 dark:text-jungleGreen-100'>
                              Length
                            </h5>
                            <p data-testid="p-titletag-length">{titleTagsAnalysis?.length}</p>
                          </div>

                          <div className='py-1'>
                            <h5 className='font-poppins-semibold text-jungleGreen-700 dark:text-jungleGreen-100'>
                              Is URL in description?
                            </h5>
                            <p data-testid="titletagWordsInDesr">{titleTagsAnalysis?.isUrlWordsInDescription == true ? 'Yes' : 'No'}</p>
                          </div>

                          {
                            titleTagsAnalysis?.recommendations != '' &&
                            <div data-testid='titleTag_recommendations' className='py-2 bg-jungleGreen-200/60 dark:bg-jungleGreen-400/40 p-2 rounded-xl mt-2'>
                              <h5 className='font-poppins-semibold text-jungleGreen-700 dark:text-jungleGreen-100'>
                                Recommendations
                              </h5>
                              <p>{titleTagsAnalysis?.recommendations}</p>
                            </div>
                          }
                        </div>
                        :
                        <>
                          {titleTagsAnalysis?.error}
                        </>
                    }
                  </div> {/* EO title tag */}

                  {/* Unique Content Analysis */}
                  <div className='bg-zinc-200 dark:bg-zinc-700 rounded-xl p-3 my-2'>
                    {/* Heading */}
                    <div className='flex mb-2'>
                      <div className='my-auto flex text-4xl justify-center rounded-full bg-jungleGreen-700 dark:bg-jungleGreen-300 p-2 text-dark-primaryTextColor dark:text-primaryTextColor'>
                        <FiBook />
                      </div>
                      <div className='my-auto'>
                        <h4 className='font-poppins-semibold text-jungleGreen-700 dark:text-jungleGreen-100 pl-4 text-lg'>
                          Unique Content
                          <InfoPopOver
                            data-testid="popup-unique-content"
                            heading="Analysis of Content Quality"
                            content="The code extracts and processes text from the body tag by splitting it into words, filtering out non-alphabetic characters, and counting word frequency. It identifies the top 10 most frequent words, calculates the percentage of unique words, and checks if the content length exceeds 500 characters. Recommendations include increasing content length for better depth and improving word uniqueness to avoid keyword stuffing, which enhances SEO."
                            placement="bottom"
                          />
                        </h4>
                      </div>
                    </div>

                    {/* Content */}
                    {
                      uniqContentAnalysis && isUniqueContentAnalysis(uniqContentAnalysis) ?
                        <div>
                          {/* Count */}
                          <div className='gap-6 grid sm:grid-cols-2'>
                            <div className='bg-zinc-300 dark:bg-zinc-800 p-4 rounded-xl text-center flex justify-center items-center'>
                              <div>
                                <div data-testid="div-uniq-textlength" className='font-poppins-bold text-6xl text-jungleGreen-800 dark:text-jungleGreen-400'>
                                  {uniqContentAnalysis?.textLength}
                                </div>
                                <div className='font-poppins-semibold text-lg'>
                                  Text Length
                                </div>
                              </div>
                            </div>

                            <div className='bg-zinc-300 dark:bg-zinc-800 p-4 rounded-xl text-center flex justify-center items-center'>
                              <div>
                                <div data-testid="div-uniq-percentage" className='font-poppins-bold text-6xl text-jungleGreen-800 dark:text-jungleGreen-400'>
                                  {uniqContentAnalysis && uniqContentAnalysis.uniqueWordsPercentage
                                    ?
                                    (uniqContentAnalysis.uniqueWordsPercentage).toFixed(2) + '%'
                                    :
                                    '0%'
                                  }
                                </div>
                                <div className='font-poppins-semibold text-lg'>
                                  Unique words
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className='pt-2'>
                            <h5 className='font-poppins-semibold text-jungleGreen-700 dark:text-jungleGreen-100'>
                              Repeated words
                            </h5>
                            <div data-testid="div-uniq-rep-words">
                              {uniqContentAnalysis?.repeatedWords
                                .filter((wordObj) => !excludedUniqueRepeatedWords.includes(wordObj.word))
                                .map((wordObj, index) => (
                                  <span className='mr-2' key={index}>
                                    <Chip
                                      radius="sm"
                                      // color={'primary'}
                                      variant="flat"
                                      className='mt-2'
                                    >
                                      {wordObj.word}: {wordObj.count}
                                    </Chip>
                                  </span>
                                ))}
                            </div>
                          </div>

                          {
                            uniqContentAnalysis?.recommendations != '' &&
                            <div data-testid='uniqueContent_recommendations' className='py-2 bg-jungleGreen-200/60 dark:bg-jungleGreen-400/40 p-2 rounded-xl mt-2'>
                              <h5 className='font-poppins-semibold text-jungleGreen-700 dark:text-jungleGreen-100'>
                                Recommendations
                              </h5>
                              <p>{uniqContentAnalysis?.recommendations}</p>
                            </div>
                          }
                        </div>
                        :
                        <>
                          {uniqContentAnalysis?.error}
                        </>
                    }
                  </div> {/* EO Unique Content Analysis */}

                  {/* Technical Analysis Heading */}
                  <h3 className="font-poppins-semibold text-lg text-jungleGreen-700 dark:text-jungleGreen-100 p-2 px-0 pb-2">
                    Technical Analysis
                  </h3>

                  {/* Site speed and canonical tags */}
                  <div className='gap-2 grid sm:grid-cols-2'>

                    <div className='bg-zinc-200 dark:bg-zinc-700 p-4 rounded-xl'>
                      {/* Heading */}
                      <div className='flex mb-2'>
                        <div className='my-auto flex text-4xl justify-center rounded-full bg-jungleGreen-700 dark:bg-jungleGreen-300 p-2 text-dark-primaryTextColor dark:text-primaryTextColor'>
                          <FiTag />
                        </div>
                        <div className='my-auto'>
                          <h4 className='font-poppins-semibold text-jungleGreen-700 dark:text-jungleGreen-100 pl-4 text-lg'>
                            Canonical Tags
                            <InfoPopOver
                              data-testid="popup-canonical-tags"
                              heading="Analysis of Canonical Tags"
                              content="The code identifies a link element with rel='canonical', retrieves its href attribute, and checks if the canonical tag is present. If the tag is missing, 
                              it provides a recommendation. Canonical tags are crucial for SEO, as they help prevent duplicate content issues by signaling the primary version of a page, thereby 
                              consolidating ranking signals and avoiding diluted page authority."
                              placement="bottom"
                            />
                          </h4>
                        </div>
                      </div>

                      {/* Content */}
                      <div className='bg-zinc-300 dark:bg-zinc-800 p-4 rounded-xl text-center flex justify-center items-center'>
                        <div className='min-h-[6rem]'>
                          <div data-testid="canonicalTagPresent" className='font-poppins-bold text-3xl sm:text-5xl text-jungleGreen-800 dark:text-jungleGreen-400 pt-4'>
                            {canonicalTagAnalysis && isCanonicalTagAnalysis(canonicalTagAnalysis) ?
                              canonicalTagAnalysis.isCanonicalTagPresent ? 'Yes' : 'No'
                              : '-'
                            }
                          </div>
                          <div data-testid="canonicalTag" className='font-poppins-semibold text-sm sm:text-lg'>
                            {canonicalTagAnalysis && isCanonicalTagAnalysis(canonicalTagAnalysis) && canonicalTagAnalysis.canonicalTag != "" ?
                              canonicalTagAnalysis.canonicalTag
                              : 'No canonical tag present'
                            }
                          </div>
                        </div>
                      </div>

                      {/* Recommendations */}
                      {
                        canonicalTagAnalysis && isCanonicalTagAnalysis(canonicalTagAnalysis) && canonicalTagAnalysis.recommendations != "" &&
                        <div className='py-2 bg-jungleGreen-200/60 dark:bg-jungleGreen-400/40 p-2 rounded-xl mt-2'>
                          <h5 className='font-poppins-semibold text-jungleGreen-700 dark:text-jungleGreen-100'>
                            Recommendations
                          </h5>
                          <p data-testid='canonical_recommendations'>{canonicalTagAnalysis.recommendations}</p>
                        </div>
                      }
                    </div>


                    <div className='bg-zinc-200 dark:bg-zinc-700 p-4 rounded-xl'>

                      {/* Heading */}
                      <div className='flex mb-2'>
                        <div className='my-auto flex text-4xl justify-center rounded-full bg-jungleGreen-700 dark:bg-jungleGreen-300 p-2 text-dark-primaryTextColor dark:text-primaryTextColor'>
                          <FiClock />
                        </div>
                        <div className='my-auto'>
                          <h4 className='font-poppins-semibold text-jungleGreen-700 dark:text-jungleGreen-100 pl-4 text-lg'>
                            Site Speed
                            <InfoPopOver
                              data-testid="popup-site-speed"
                              heading="Analysis of Site Speed"
                              content="The Google PageSpeed Insights API is used to check whether the load time exceeds 3 seconds. Faster load times improve user experience and 
                              engagement, and can boost SEO by enhancing search rankings and driving more traffic."
                              placement="bottom"
                            />
                          </h4>
                        </div>
                      </div>

                      {/* Content */}
                      <div className='bg-zinc-300 dark:bg-zinc-800 p-4 rounded-xl text-center flex justify-center items-center'>
                        <div className='min-h-[6rem]'>
                          <div data-testid="siteSpeed" className='font-poppins-bold text-3xl sm:text-5xl text-jungleGreen-800 dark:text-jungleGreen-400 pt-4'>
                            {siteSpeedAnalysis && isSiteSpeedAnalysis(siteSpeedAnalysis) ?
                              siteSpeedAnalysis.loadTime.toFixed(2)
                              : '0'
                            }
                          </div>
                          <div className='font-poppins-semibold text-sm sm:text-lg'>
                            seconds
                          </div>
                        </div>
                      </div>

                      {/* Recommendations */}
                      {
                        siteSpeedAnalysis && isSiteSpeedAnalysis(siteSpeedAnalysis) && siteSpeedAnalysis.recommendations != "" &&
                        <div className='py-2 bg-jungleGreen-200/60 dark:bg-jungleGreen-400/40 p-2 rounded-xl mt-2'>
                          <h5 className='font-poppins-semibold text-jungleGreen-700 dark:text-jungleGreen-100'>
                            Recommendations
                          </h5>
                          <p data-testid='sitespeed_recommendations'>{siteSpeedAnalysis.recommendations}</p>
                        </div>
                      }
                    </div>
                  </div> {/* EO Site speed and canonical tags */}

                  {/* xml and mobile friendliness */}
                  <div className='gap-2 grid sm:grid-cols-2 mt-2'>
                    <div className='bg-zinc-200 dark:bg-zinc-700 p-4 rounded-xl'>

                      {/* Heading */}
                      <div className='flex mb-2'>
                        <div className='my-auto flex text-4xl justify-center rounded-full bg-jungleGreen-700 dark:bg-jungleGreen-300 p-2 text-dark-primaryTextColor dark:text-primaryTextColor'>
                          <FiCode />
                        </div>
                        <div className='my-auto'>
                          <h4 className='font-poppins-semibold text-jungleGreen-700 dark:text-jungleGreen-100 pl-4 text-lg'>
                            XML Sitemap Analysis
                            <InfoPopOver
                              data-testid="popup-xml-sitemap"
                              heading="XML Sitemap Analysis"
                              content="This feature checks the presence and accessibility of your XML sitemap by appending /sitemap.xml to your base URL. If the sitemap is missing or 
                              inaccessible, you'll receive a status update with recommendations for resolving the issue. An XML sitemap is essential for effective search engine crawling 
                              and indexing, ensuring that all critical pages are discovered, which can significantly enhance your site's visibility and traffic."
                              placement="bottom"
                            />
                          </h4>
                        </div>
                      </div>

                      {/* Content */}
                      <div className='bg-zinc-300 dark:bg-zinc-800 p-4 rounded-xl text-center flex justify-center items-center'>
                        <div data-testid="isSitemapvalid" className='font-poppins-bold text-3xl sm:text-5xl text-jungleGreen-800 dark:text-jungleGreen-400 pt-4'>
                          {xmlSitemapAnalysis && isXMLSitemapAnalysis(xmlSitemapAnalysis) ?
                            xmlSitemapAnalysis.isSitemapValid ? 'Yes' : 'No'
                            : '-'
                          }
                        </div>
                      </div>

                      {/* Recommendations */}
                      {
                        xmlSitemapAnalysis && isXMLSitemapAnalysis(xmlSitemapAnalysis) && xmlSitemapAnalysis.recommendations != "" &&
                        <div className='py-2 bg-jungleGreen-200/60 dark:bg-jungleGreen-400/40 p-2 rounded-xl mt-2'>
                          <h5 className='font-poppins-semibold text-jungleGreen-700 dark:text-jungleGreen-100'>
                            Recommendations
                          </h5>
                          <p data-testid="xml_recommendation">{xmlSitemapAnalysis.recommendations}</p>
                        </div>
                      }
                    </div>

                    <div className='bg-zinc-200 dark:bg-zinc-700 p-4 rounded-xl'>

                      {/* Heading */}
                      <div className='flex mb-2'>
                        <div className='my-auto flex text-4xl justify-center rounded-full bg-jungleGreen-700 dark:bg-jungleGreen-300 p-2 text-dark-primaryTextColor dark:text-primaryTextColor'>
                          <FiSmartphone />
                        </div>
                        <div className='my-auto'>
                          <h4 className='font-poppins-semibold text-jungleGreen-700 dark:text-jungleGreen-100 pl-4 text-lg'>
                            Mobile Friendliness
                            <InfoPopOver
                              data-testid="popup-mobile-friendly"
                              heading="Analysis of Mobile Friendliness"
                              content="The viewport is configured to simulate a mobile device (375x667 pixels), sets mobile and touch capabilities, and checks 
                              if the page is fully loaded and responsive at the specified width. Mobile-friendly sites improve user experience, enhance SEO due 
                              to Google&apos;s mobile-first indexing, and can boost conversion rates by ensuring ease of use on mobile devices."
                              placement="bottom"
                            />
                          </h4>
                        </div>
                      </div>

                      {/* Content */}
                      <div className='bg-zinc-300 dark:bg-zinc-800 p-4 rounded-xl text-center flex justify-center items-center'>
                        <div data-testid="mobile_friendliness" className='font-poppins-bold text-3xl sm:text-5xl text-jungleGreen-800 dark:text-jungleGreen-400 pt-4'>
                          {mobileFriendlinessAnalysis && isMobileFriendlinessAnalysis(mobileFriendlinessAnalysis) ?
                            mobileFriendlinessAnalysis.isResponsive ? 'Yes' : 'No'
                            : '-'
                          }
                        </div>
                      </div>

                      {/* Recommendations */}
                      {
                        mobileFriendlinessAnalysis && isMobileFriendlinessAnalysis(mobileFriendlinessAnalysis) && mobileFriendlinessAnalysis.recommendations != "" &&
                        <div className='py-2 bg-jungleGreen-200/60 dark:bg-jungleGreen-400/40 p-2 rounded-xl mt-2'>
                          <h5 className='font-poppins-semibold text-jungleGreen-700 dark:text-jungleGreen-100'>
                            Recommendations
                          </h5>
                          <p data-testid="mobile_recommendations">{mobileFriendlinessAnalysis.recommendations}</p>
                        </div>
                      }
                    </div>
                  </div> {/* EO xml and mobile friendliness */}


                  {/* indexibility and structured */}
                  <div className='gap-2 grid sm:grid-cols-2 mt-2'>
                    <div className='bg-zinc-200 dark:bg-zinc-700 p-4 rounded-xl'>

                      {/* Heading */}
                      <div className='flex mb-2'>
                        <div className='my-auto flex text-4xl justify-center rounded-full bg-jungleGreen-700 dark:bg-jungleGreen-300 p-2 text-dark-primaryTextColor dark:text-primaryTextColor'>
                          <FiCompass />
                        </div>
                        <div className='my-auto'>
                          <h4 className='font-poppins-semibold text-jungleGreen-700 dark:text-jungleGreen-100 pl-4 text-lg'>
                            Indexibility Analysis
                            <InfoPopOver
                              data-testid="popup-indexibility"
                              heading="Indexibility Analysis"
                              content="The code selects the meta tag with name='robots', extracts its content attribute, and checks for the noindex directive. If noindex is present, it sets 
                              isIndexable to false, indicating the page won't be indexed by search engines. Ensuring pages are indexable is crucial for search engine visibility and traffic, 
                              as unintentional noindex settings can hinder SEO efforts."
                              placement="bottom"
                            />
                          </h4>
                        </div>
                      </div>

                      {/* Content */}
                      <div className='bg-zinc-300 dark:bg-zinc-800 p-4 rounded-xl text-center flex justify-center items-center'>
                        <div data-testid="indexibilityAnalysis" className='font-poppins-bold text-3xl sm:text-5xl text-jungleGreen-800 dark:text-jungleGreen-400 pt-4'>
                          {indexibilityAnalysis && isIndexibilityAnalysis(indexibilityAnalysis) ?
                            indexibilityAnalysis.isIndexable ? 'Yes' : 'No'
                            : '-'
                          }
                        </div>
                      </div>

                      {/* Recommendations */}
                      {
                        indexibilityAnalysis && isIndexibilityAnalysis(indexibilityAnalysis) && indexibilityAnalysis.recommendations != "" &&
                        <div className='py-2 bg-jungleGreen-200/60 dark:bg-jungleGreen-400/40 p-2 rounded-xl mt-2'>
                          <h5 className='font-poppins-semibold text-jungleGreen-700 dark:text-jungleGreen-100'>
                            Recommendations
                          </h5>
                          <p data-testid="indexable_recommendation">{indexibilityAnalysis.recommendations}</p>
                        </div>
                      }
                    </div>

                    <div className='bg-zinc-200 dark:bg-zinc-700 p-4 rounded-xl'>

                      {/* Heading */}
                      <div className='flex mb-2'>
                        <div className='my-auto flex text-4xl justify-center rounded-full bg-jungleGreen-700 dark:bg-jungleGreen-300 p-2 text-dark-primaryTextColor dark:text-primaryTextColor'>
                          <FiLayout />
                        </div>
                        <div className='my-auto'>
                          <h4 className='font-poppins-semibold text-jungleGreen-700 dark:text-jungleGreen-100 pl-4 text-lg'>
                            Structured Data Analysis
                            <InfoPopOver
                              data-testid="popup-structured"
                              heading="Structured Data Analysis"
                              content="The code selects script tags with type='application/ld+json', extracts and counts the JSON-LD structured data, and generates a recommendation 
                              if none is found. Structured data enhances search visibility by enabling rich snippets and improves SEO by helping search engines better understand and 
                              index content, potentially increasing traffic and rankings."
                              placement="bottom"
                            />
                          </h4>
                        </div>
                      </div>

                      {/* Content */}
                      <div className='bg-zinc-300 dark:bg-zinc-800 p-4 rounded-xl text-center flex justify-center items-center'>
                        <div data-testid="structuredData" className='font-poppins-bold text-3xl sm:text-5xl text-jungleGreen-800 dark:text-jungleGreen-400 pt-4'>
                          {structuredDataAnalysis && isStructuredDataAnalysis(structuredDataAnalysis) ?
                            structuredDataAnalysis.count
                            : '-'
                          }
                        </div>
                      </div>

                      {/* Recommendations */}
                      {
                        structuredDataAnalysis && isStructuredDataAnalysis(structuredDataAnalysis) && structuredDataAnalysis.recommendations != "" &&
                        <div className='py-2 bg-jungleGreen-200/60 dark:bg-jungleGreen-400/40 p-2 rounded-xl mt-2'>
                          <h5 className='font-poppins-semibold text-jungleGreen-700 dark:text-jungleGreen-100'>
                            Recommendations
                          </h5>
                          <p data-testid="structured_recommendations">{structuredDataAnalysis.recommendations}</p>
                        </div>
                      }
                    </div>
                  </div> {/* EO structured and indexibility */}

                  {/* LightHouse */}
                  <div className='bg-zinc-200 dark:bg-zinc-700 rounded-xl p-3 my-2'>
                    {/* Heading */}
                    <div className='flex mb-2'>
                      <div className='my-auto flex text-4xl justify-center rounded-full bg-jungleGreen-700 dark:bg-jungleGreen-300 p-2 text-dark-primaryTextColor dark:text-primaryTextColor'>
                        <FiActivity />
                      </div>
                      <div className='my-auto'>
                        <h4 className='font-poppins-semibold text-jungleGreen-700 dark:text-jungleGreen-100 pl-4 text-lg'>
                          Light House Analysis
                          <InfoPopOver
                            data-testid="popup-analysis-tags"
                            heading="Light House Analysis"
                            content="The Google PageSpeed Insights API is used to fetch scores for performance, accessibility, and best practices."
                            placement="bottom"
                          />
                        </h4>
                      </div>
                    </div>

                    {/* Content */}
                    {
                      lighthouseAnalysis && isLightHouse(lighthouseAnalysis) ?
                        <div>
                          <div className='gap-3 grid grid-cols-3 font-poppins-bold text-4xl sm:text-5xl text-jungleGreen-800 dark:text-jungleGreen-400 pb-4'>
                            <div data-testid="lighthouse-performance" className="flex justify-center">
                              {lighthouseAnalysis && isLightHouse(lighthouseAnalysis) ?
                                <CircularProgressComparison label="Performance" value={lighthouseAnalysis.scores.performance} />
                                :
                                <CircularProgressComparison label="Performance" value={0} />
                              }
                            </div>

                            <div data-testid="lighthouse-accessibility" className="flex justify-center">
                              {lighthouseAnalysis && isLightHouse(lighthouseAnalysis) ?
                                <CircularProgressComparison label="Accessibility" value={lighthouseAnalysis.scores.accessibility} />
                                :
                                <CircularProgressComparison label="Accessibility" value={0} />
                              }
                            </div>

                            <div data-testid="lighthouse-bestpractices" className="flex justify-center">
                              {lighthouseAnalysis && isLightHouse(lighthouseAnalysis) ?
                                <CircularProgressComparison label="Best Practices" value={lighthouseAnalysis.scores.bestPractices} />
                                :
                                <CircularProgressComparison label="Best Practices" value={0} />
                              }
                            </div>
                          </div>

                          <Accordion
                            className="mx-auto "
                            selectionMode="multiple"
                            variant="splitted"
                          >
                            {lighthouseAnalysis.diagnostics.recommendations.map((recomm, index) => (
                              <AccordionItem
                                key={index}
                                id={'recommendation-' + index}
                                aria-label={`Accordion ${index + 1}`}
                                title={(
                                  <span data-testid={`lighthouse_recommendation_${index}`}>
                                    <span className='font-poppins-medium'>{recomm.title}</span>
                                    {recomm.displayValue && (
                                      <span className='text-jungleGreen-600 dark:text-jungleGreen-400'>
                                        {` - ${recomm.displayValue}`}
                                      </span>
                                    )}
                                  </span>
                                )}
                              >
                                <div>
                                  <div>
                                    <span className='font-poppins-medium text-jungleGreen-600 dark:text-jungleGreen-400'>Description: </span>
                                    <span>{recomm.description}</span>
                                  </div>
                                  <div>
                                    <span className='font-poppins-medium text-jungleGreen-600 dark:text-jungleGreen-400'>Score: </span>
                                    <span>{recomm.score * 100}%</span>
                                  </div>
                                </div>

                              </AccordionItem>
                            ))}
                          </Accordion>

                        </div>
                        :
                        <>
                          {lighthouseAnalysis?.error}
                        </>
                    }
                  </div> {/* EO Light House */}

                </div> {/* EO on page SEO analysis */}
              </CardBody>
            </Card>
          </Tab>
          <Tab key="sentiment" data-testid="tab-sentiment" title="Sentiment Analysis">
            <Card>
              <CardBody>
                {/* Sentiment Analysis */}
                <div>
                  {/* Sentiment Analysis */}
                  <h3 className="font-poppins-semibold text-lg text-jungleGreen-700 dark:text-jungleGreen-100 p-2 px-0 pb-0">
                    Sentiment Analysis
                    <InfoPopOver
                      data-testid="popup-sentiment"
                      heading="Sentiment Analysis"
                      content="Sentiment analysis is conducted on the extracted metadata. This analysis would provide valuable insights 
                        into whether the content is perceived as positive, negative, or neutral. By leveraging this insight, users 
                        can effectively align their content tone with their brand&apos;s messaging.
                        </br></br>Note: WEE cannot guarantee the accuracy of the analysis as it is based on machine learning models."
                      placement="right-end"
                    />
                  </h3>
                  <div className='bg-zinc-200 dark:bg-zinc-700 rounded-xl p-3 mb-2'>
                    {sentimentAnalysis && sentimentAnalysis.sentimentAnalysis && sentimentAnalysis.sentimentAnalysis.positive > 0 && sentimentAnalysis.sentimentAnalysis.neutral > 0 && sentimentAnalysis.sentimentAnalysis.negative > 0 ? (
                      <div data-testid={"sentiment-donut-chart"} className='w-full md:w-1/2 md:mx-auto'>
                        <DonutChart dataLabel={['Positive', 'Neutral', 'Negative']} dataSeries={[(sentimentAnalysis?.sentimentAnalysis.positive * 100), (sentimentAnalysis?.sentimentAnalysis.neutral * 100), (sentimentAnalysis?.sentimentAnalysis.negative * 100)]} legendPosition='right' />
                      </div>)
                      : (
                        <div>
                          No sentiment analysis data to display
                        </div>)
                    }
                  </div>

                  {/* Positive and Negative Words */}
                  <h3 className="font-poppins-semibold text-lg text-jungleGreen-700 dark:text-jungleGreen-100 p-2 px-0 pb-0">
                    Positive and Negative Words
                    <InfoPopOver
                      data-testid="popup-neg-pos-words"
                      heading="Positive and Negative Words"
                      content="Metadata can be classified into two possible categories: positive and negative words. This thoughtful classification empowers users to 
                        strategically optimize the language within their content, thereby enhancing their ability to shape audience perception and drive meaningful engagement
                        </br></br>Note: WEE cannot guarantee the accuracy of the analysis as it is based on machine learning models."
                      placement="right-end"
                    />
                  </h3>
                  <div className='bg-zinc-200 dark:bg-zinc-700 rounded-xl p-3 mb-2'>
                    {!sentimentAnalysis || (sentimentAnalysis?.positiveWords.length == 0 && sentimentAnalysis?.negativeWords.length == 0) ? (
                      <div>There is no positive or negative words to display</div>
                    )
                      : (
                        <>
                          {metaData && isMetadata(metaData) ? (
                            <div>
                              <div data-testid={"sentiment-meta-title"}>
                                {metaData?.title && metaData.title.split(/(\s+)/).map((part, index) => (
                                  sentimentAnalysis?.positiveWords.includes(part.trim()) ?
                                    <span key={index}><Chip color="success" variant="flat" radius="sm" className='px-0 my-1'>{part}</Chip></span> :
                                    (sentimentAnalysis?.negativeWords.includes(part.trim()) ?
                                      <span key={index}><Chip color="danger" variant="flat" radius="sm" className='px-0 my-1'>{part}</Chip></span> :
                                      <span key={index}>{part}</span>)
                                ))}
                              </div>
                              <div data-testid={"sentiment-meta-description"}>
                                {metaData?.description && metaData.description.split(/(\s+)/).map((part, index) => (
                                  sentimentAnalysis?.positiveWords.includes(part.trim()) ?
                                    <span key={index}><Chip color="success" variant="flat" radius="sm" className='px-0 my-1'>{part}</Chip></span> :
                                    (sentimentAnalysis?.negativeWords.includes(part.trim()) ?
                                      <span key={index}><Chip color="danger" variant="flat" radius="sm" className='px-0 my-1'>{part}</Chip></span> :
                                      <span key={index}>{part}</span>)
                                ))}
                              </div>
                              <div data-testid={"sentiment-meta-keywords"}>
                                {metaData?.keywords && metaData.keywords.split(/(\s+)/).map((part, index) => (
                                  sentimentAnalysis?.positiveWords.includes(part) ?
                                    <span key={index}><Chip color="success" variant="flat" radius="sm" className='px-0 my-1'>{part}</Chip></span> :
                                    (sentimentAnalysis?.negativeWords.includes(part) ?
                                      <span key={index}><Chip color="danger" variant="flat" radius="sm" className='px-0 my-1'>{part}</Chip></span> :
                                      <span key={index}>{part}</span>)
                                ))}
                              </div>
                            </div>
                          )
                            : (
                              <div>
                                {metaData?.errorMessage}
                              </div>
                            )}
                        </>
                      )}
                  </div>

                  {/* Emotions */}
                  <h3 className="font-poppins-semibold text-lg text-jungleGreen-700 dark:text-jungleGreen-100 p-2 px-0 pb-0">
                    Emotions Confidence Score
                    <InfoPopOver
                      data-testid="popup-emotions"
                      heading="Emotions Confidence Score"
                      content="By analyzing users&apos; domain-specific metadata, we can discern specific emotional cues. This capability empowers users to fine-tune 
                        their metadata settings, thereby invoking the desired emotional responses.
                        </br></br>Note: WEE cannot guarantee the accuracy of the analysis as it is based on machine learning models."
                      placement="right-end"
                    />
                  </h3>
                  <div className='bg-zinc-200 dark:bg-zinc-700 rounded-xl p-3 mb-2'>
                    {sentimentAnalysis?.emotions && (JSON.stringify(sentimentAnalysis?.emotions) !== '{}') ? (
                      <div data-testid={"sentiment-emotions-progress-charts"} className='gap-3 grid sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7'>
                        <div className="flex justify-center">
                          <CircularProgressSentiment value={sentimentAnalysis?.emotions.anger * 100} label={"Anger"} />
                        </div>
                        <div className="flex justify-center">
                          <CircularProgressSentiment value={sentimentAnalysis?.emotions.disgust * 100} label={"Disgust"} />
                        </div>
                        <div className="flex justify-center">
                          <CircularProgressSentiment value={sentimentAnalysis?.emotions.fear * 100} label={"Fear"} />
                        </div>
                        <div className="flex justify-center">
                          <CircularProgressSentiment value={sentimentAnalysis?.emotions.joy * 100} label={"Joy"} />
                        </div>
                        <div className="flex justify-center">
                          <CircularProgressSentiment value={sentimentAnalysis?.emotions.neutral * 100} label={"Neutral"} />
                        </div>
                        <div className="flex justify-center">
                          <CircularProgressSentiment value={sentimentAnalysis?.emotions.sadness * 100} label={"Sadness"} />
                        </div>
                        <div className="flex justify-center">
                          <CircularProgressSentiment value={sentimentAnalysis?.emotions.surprise * 100} label={"Surprise"} />
                        </div>
                      </div>
                    )
                      : (
                        <div>There is no emotions to display</div>
                      )}
                  </div>

                </div>{/* EO Sentiment Analysis */}
              </CardBody>
            </Card>
          </Tab>
          <Tab key="reputation-management" data-testid="tab-rep-management" title="Reputation Management">
            <Card>
              <CardBody>
                <div>

                  {/* Social Media */}
                  <h3 className="font-poppins-semibold text-lg text-jungleGreen-700 dark:text-jungleGreen-100 p-2 px-0 pb-0">
                    Social Media Engagement Metrics
                    <InfoPopOver
                      data-testid="popup-social-media"
                      heading="Social Media Engagement Metrics"
                      content="This data reflects engagement metrics from social media platforms, including Facebook reactions, comments, shares, and Pinterest pins. It provides insights into how these interactions influence visibility 
                      and audience engagement."
                      placement="right-end"
                    />
                  </h3>
                  <div className='bg-zinc-200 dark:bg-zinc-700 rounded-xl p-3 mb-2'>
                    {shareCountData ? (

                      <div className='gap-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'>

                        <div className='bg-zinc-300 dark:bg-zinc-800 rounded-xl text-center flex justify-center items-center p-4'>
                          <div>
                            <div data-testid="result-facebook-comment-count" className='font-poppins-bold text-5xl text-[#316FF6]'>
                              {shareCountData.Facebook && shareCountData.Facebook.comment_count ? shareCountData.Facebook.comment_count : '-'}
                            </div>
                            <div className='font-poppins-semibold text-lg'>
                              Facebook Comment Count
                            </div>
                          </div>
                        </div>

                        <div className='bg-zinc-300 dark:bg-zinc-800 rounded-xl text-center flex justify-center items-center p-4'>
                          <div>
                            <div data-testid="result-facebook-reaction-count" className='font-poppins-bold text-5xl text-[#316FF6]'>
                              {shareCountData.Facebook && shareCountData.Facebook.reaction_count ? shareCountData.Facebook.reaction_count : '-'}
                            </div>
                            <div className='font-poppins-semibold text-lg'>
                              Facebook Reaction Count
                            </div>
                          </div>
                        </div>

                        <div className='bg-zinc-300 dark:bg-zinc-800 rounded-xl text-center flex justify-center items-center p-4'>
                          <div>
                            <div data-testid="result-facebook-share-count" className='font-poppins-bold text-5xl text-[#316FF6]'>
                              {shareCountData.Facebook && shareCountData.Facebook.share_count ? shareCountData.Facebook.share_count : '-'}
                            </div>
                            <div className='font-poppins-semibold text-lg'>
                              Facebook Share Count
                            </div>
                          </div>
                        </div>

                        <div className='bg-zinc-300 dark:bg-zinc-800 rounded-xl text-center flex justify-center items-center p-4'>
                          <div>
                            <div data-testid="result-pintrest-pin-count" className='font-poppins-bold text-5xl text-[#E60023]'>
                              {shareCountData.Pinterest ? shareCountData.Pinterest : '-'}
                            </div>
                            <div className='font-poppins-semibold text-lg'>
                              Pinterest Pin Count
                            </div>
                          </div>
                        </div>

                      </div>)
                      : (
                        <div className='social-media-not-available'>No social media data is currently available</div>
                      )
                    }
                  </div>

                  {/* Reviews */}
                  <h3 className="font-poppins-semibold text-lg text-jungleGreen-700 dark:text-jungleGreen-100 p-2 px-0 pb-0">
                    Reviews
                    <InfoPopOver
                      data-testid="popup-reviews"
                      heading="Reviews"
                      content="<i>Star Ratings for Reviews: </i>Displays how reviews are distributed across various star levels, providing an overview of customer feedback.</br></br>
                              <i>NPS (Net Promoter Score): </i>Reflects the likelihood of customers recommending a business, with scores below 0 indicating low likelihood, scores 
                              between 1 and 49 showing moderate likelihood, and scores above 49 signifying a strong likelihood of recommendation.</br></br>      
                              <i>Average Star Rating: </i>Offers an overall indication of customer satisfaction based on the ratings given.</br></br>
                              <i>Hellopeter TrustIndex: </i>Assesses a business's credibility by analyzing factors such as star ratings, response times, review volume, and recent 
                              review relevance. Scores range from 0 to 10, representing the quality of customer service.</br>"
                      placement="right-end"
                    />
                  </h3>
                  <div className='bg-zinc-200 dark:bg-zinc-700 rounded-xl p-3 mb-2'>
                    {reviews ? (
                      <>
                        <div className='bg-zinc-300 dark:bg-zinc-800 rounded-xl p-4'>
                          <h3 className="font-poppins-semibold text-lg text-jungleGreen-700 dark:text-jungleGreen-100 mb-2 text-center">
                            Star Ratings for Reviews
                          </h3>
                          <ColumnChartWithLables
                            dataLabel={[
                              reviews.starRatings[4].stars.toString() + ' star',
                              reviews.starRatings[3].stars.toString() + ' stars',
                              reviews.starRatings[2].stars.toString() + ' stars',
                              reviews.starRatings[1].stars.toString() + ' stars',
                              reviews.starRatings[0].stars.toString() + ' stars',
                            ]}
                            dataSeries={[
                              reviews.starRatings[4].numReviews,
                              reviews.starRatings[3].numReviews,
                              reviews.starRatings[2].numReviews,
                              reviews.starRatings[1].numReviews,
                              reviews.starRatings[0].numReviews,
                            ]}
                          />
                        </div>

                        <div className='gap-6 grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 mt-3'>

                          <div className='bg-zinc-300 dark:bg-zinc-800 rounded-xl text-center flex justify-center items-center p-4'>
                            <div>
                              <div data-testid="result-reviews-nps" className='font-poppins-bold text-5xl text-jungleGreen-800 dark:text-jungleGreen-400'>
                                {reviews && reviews.NPS ? reviews.NPS : '-'}
                              </div>
                              <div className='font-poppins-semibold text-lg'>
                                NPS
                              </div>
                            </div>
                          </div>

                          <div className='bg-zinc-300 dark:bg-zinc-800 rounded-xl text-center flex justify-center items-center p-4'>
                            <div>
                              <div data-testid="result-reviews-number-reviews" className='font-poppins-bold text-5xl text-jungleGreen-800 dark:text-jungleGreen-400'>
                                {reviews && reviews.numberOfReviews ? reviews.numberOfReviews : '-'}
                              </div>
                              <div className='font-poppins-semibold text-lg'>
                                Number of reviews
                              </div>
                            </div>
                          </div>

                          <div className='bg-zinc-300 dark:bg-zinc-800 rounded-xl text-center flex justify-center items-center p-4'>
                            <div>
                              <div data-testid="result-reviews-rating" className='font-poppins-bold text-5xl text-jungleGreen-800 dark:text-jungleGreen-400'>
                                {reviews && reviews.rating ? reviews.rating : '-'}
                              </div>
                              <div className='font-poppins-semibold text-lg'>
                                Rating
                              </div>
                            </div>
                          </div>

                          <div className='bg-zinc-300 dark:bg-zinc-800 rounded-xl text-center flex justify-center items-center p-4'>
                            <div>
                              <div data-testid="result-reviews-recommendation-status" className='font-poppins-bold text-2xl lg:text-4xl text-jungleGreen-800 dark:text-jungleGreen-400'>
                                {reviews && reviews.numberOfReviews ? reviews.recommendationStatus : '-'}
                              </div>
                              <div className='font-poppins-semibold text-lg'>
                                Recommendation Status
                              </div>
                            </div>
                          </div>

                          <div className='bg-zinc-300 dark:bg-zinc-800 rounded-xl text-center flex justify-center items-center p-4'>
                            <div>
                              <div data-testid="result-reviews-trustindex" className='font-poppins-bold text-5xl text-jungleGreen-800 dark:text-jungleGreen-400'>
                                {reviews.trustIndex}
                              </div>
                              <div className='font-poppins-semibold text-lg'>
                                Trust Index
                              </div>
                            </div>
                          </div>

                        </div>
                      </>

                    ) : (
                      <div>There are no review data currently available</div>
                    )}
                  </div>

                  {/* News Sentiment */}
                  <h3 className="font-poppins-semibold text-lg text-jungleGreen-700 dark:text-jungleGreen-100 p-2 px-0 pb-0">
                    News Sentiment
                    <InfoPopOver
                      data-testid="popup-news-sentiment"
                      heading="News Sentiment"
                      content="Reflects the overall sentiment of news coverage about a business over time, highlighting positive, negative, and neutral scores for the 10 most recent news 
                            articles to indicate public perception."
                      placement="right-end"
                    />
                  </h3>

                  <div className='bg-zinc-200 dark:bg-zinc-700 rounded-xl p-3 mb-2'>
                    {scrapeNews && scrapeNews.length > 0 ? (
                      <>
                        <div className='bg-zinc-300 dark:bg-zinc-800 rounded-xl p-4' data-testid='donut-chart-news-sentiment'>
                          <h3 className="font-poppins-semibold text-lg text-jungleGreen-700 dark:text-jungleGreen-100 mb-2 text-center">
                            Average News Sentiment
                          </h3>

                          <DonutChart
                            dataLabel={['Positive', 'Neutral', 'Negative']}
                            dataSeries={[
                              (scrapeNews.reduce((sum, news) => sum + news.sentimentScores.positive, 0) / scrapeNews.length) * 100,
                              (scrapeNews.reduce((sum, news) => sum + news.sentimentScores.neutral, 0) / scrapeNews.length) * 100,
                              (scrapeNews.reduce((sum, news) => sum + news.sentimentScores.negative, 0) / scrapeNews.length) * 100
                            ]}
                            legendPosition='right'
                          />
                        </div>
                        <div className='gap-3 grid md:grid-cols-2 my-3'>
                          {scrapeNews.map((news, index) => (
                            <div key={index} className='bg-zinc-300 dark:bg-zinc-800 rounded-xl p-4 '>
                              <div>
                                <div className='text-md text-jungleGreen-700 dark:text-jungleGreen-100 font-poppins-semibold'>
                                  {news.title}
                                </div>
                                <div><span className='font-poppins-semibold'>Published on: </span>{news.pubDate}</div>
                                <div><span className='font-poppins-semibold'>Source: </span>{news.source}</div>
                                <Link href={news.link} target="_blank" rel="noopener noreferrer">
                                  Read article
                                </Link>

                                <SentimentColumnChartWithLables
                                  dataLabel={[
                                    'Positive', 'Neutral', 'Negative'
                                  ]}
                                  dataSeries={[
                                    Math.round(news.sentimentScores.positive * 100),
                                    Math.round(news.sentimentScores.neutral * 100),
                                    Math.round(news.sentimentScores.negative * 100)
                                  ]}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </>
                    ) : (
                      <div>No news sentiment data is currently available</div>
                    )}

                  </div>
                </div>
              </CardBody>
            </Card>
          </Tab>
        </WEETabs>
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
                  errorMessage={
                    isInvalid
                      ? error === ''
                        ? 'A name must be provided for the report.'
                        : error
                      : undefined
                  }
                  value={reportName}
                  onChange={handleInputChange}
                />
              </ModalBody>
              <ModalFooter>
                <Button className="text-md font-poppins-semibold bg-jungleGreen-700 text-dark-primaryTextColor dark:bg-jungleGreen-400 dark:text-primaryTextColor" onPress={onClose}
                  data-testid="close-save-report-modal"
                >
                  Close
                </Button>
                <Button
                  className="text-md font-poppins-semibold bg-jungleGreen-700 text-dark-primaryTextColor dark:bg-jungleGreen-400 dark:text-primaryTextColor"
                  onPress={() => handleSave(reportName)}
                  disabled={isDisabled}
                  data-testid="submit-report-name"
                  isLoading={isSaving}
                  variant="flat"
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
            <p className="text-center my-2 text-lg text-gray-700 dark:text-gray-300">
              Your report has been saved. You can view it in the <strong>
                <a 
                  onClick={handleSaveModalNavigation}
                  className="text-jungleGreen-800 dark:text-dark-primaryTextColor hover:underline"
                >
                  Saved Reports
                </a>
              </strong> tab.
            </p>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}


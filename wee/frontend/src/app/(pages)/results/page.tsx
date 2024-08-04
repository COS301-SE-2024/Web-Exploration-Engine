'use client';
import React, { useEffect, useState, Suspense } from 'react';
import { Card, CardBody, Image } from '@nextui-org/react';
import {
  Button, Tabs, Tab,
  TableHeader, TableColumn, TableBody, TableRow, TableCell,
  Dropdown, DropdownTrigger, DropdownMenu, DropdownItem,
  Modal, ModalContent, ModalBody, useDisclosure, Input, ModalFooter, Link, ScrollShadow
} from '@nextui-org/react';
import { FiShare, FiDownload, FiSave } from "react-icons/fi";
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
import { TitleTagsAnalysis, HeadingAnalysis, ImageAnalysis, InternalLinksAnalysis, MetaDescriptionAnalysis, UniqueContentAnalysis, SEOError, IndustryClassification, SentimentAnalysis, Metadata, ErrorResponse } from '../../models/ScraperModels';
import WEETabs from '../../components/Util/Tabs';
import { handleDownloadReport } from '../../services/DownloadIndividualReport';
import { DonutChart } from '../../components/Graphs/DonutChart';
import CircularProgressSentiment from '../../components/CircularProgressSentiment';

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

// function isMetadata(data: Metadata | ErrorResponse): data is Metadata {
//   return 'title' in data || 'ogTitle' in data || 'description' in data || 'ogDescription' in data;
// }

function isTitleTagAnalysis(data: TitleTagsAnalysis | SEOError): data is TitleTagsAnalysis {
  return 'length' in data || 'metaDescription' in data || 'recommendations' in data || 'isUrlWordsInDescription' in data;
}

function isHeadingAnalysis(data: HeadingAnalysis | SEOError): data is HeadingAnalysis {
  return 'count' in data || 'headings' in data || 'recommendations' in data;
}

function isImageAnalysis(data: ImageAnalysis | SEOError): data is ImageAnalysis {
  return 'errorUrls' in data || 'missingAltTextCount' in data || 'nonOptimizedCount' in data || 'reasonsMap' in data || 'recommendations' in data || 'totalImages' in data ;
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

// function isSentimentAnalysis(data: SentimentAnalysis | SEOError): data is SentimentAnalysis {
//   return 'sentimentAnalysis' in data || 'positiveWords' in data || 'negativeWords' in data || 'emotions' in data;
// }

function ResultsComponent() {
  const iconClasses = "text-xl text-default-500 pointer-events-none flex-shrink-0";

  const searchParams = useSearchParams();
  const url = searchParams.get('url');

  const { results } = useScrapingContext();
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

  useEffect(() => {
    if (url) {
      const urlResults = results.filter((res) => res.url === url);
  
      if (urlResults && urlResults[0]) {
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
          setIndustryClassification(urlResults[0].industryClassification.zeroShotMetaDataClassify);
          setDomainClassification(urlResults[0].industryClassification.zeroShotDomainClassify);
          setMetaData(urlResults[0].metadata);

          const screenShotBuffer = Buffer.from(urlResults[0].screenshot, 'base64');
          const screenShotUrl = `data:image/png;base64,${screenShotBuffer.toString('base64')}`;
          setHomePageScreenShot(screenShotUrl);

          setAddresses(urlResults[0].addresses);
          setEmails(urlResults[0].contactInfo.emails);
          setPhones(urlResults[0].contactInfo.phones);
          setSocialLinks(urlResults[0].contactInfo.socialLinks);
          setTitleTagAnalysis(urlResults[0].seoAnalysis.titleTagsAnalysis);
          setHeadingAnalysis(urlResults[0].seoAnalysis.headingAnalysis);
          setImageAnalysis(urlResults[0].seoAnalysis.imageAnalysis);
          setInternalLinkingAnalysis(urlResults[0].seoAnalysis.internalLinksAnalysis);
          setMetaDescriptionAnalysis(urlResults[0].seoAnalysis.metaDescriptionAnalysis);
          setUniqueContentAnalysis(urlResults[0].seoAnalysis.uniqueContentAnalysis);
          setSentimentAnalysis(urlResults[0].sentiment);
        }
      }
    }
  }, [url]);  

  const backToScrapeResults = () => {
    router.back();
  };

  const downloadSummaryReport = (key: any) => {
    handleDownloadReport(url, summaryInfo, websiteStatus, isCrawlable, industryClassification, domainClassification, addresses,emails,phones,socialLinks,titleTagsAnalysis,headingAnalysis,imagesAnalysis,internalLinkingAnalysis,metaDescriptionAnalysis,uniqContentAnalysis);
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
  const {isOpen, onOpenChange} = useDisclosure();
  const { isOpen: isSuccessOpen, onOpenChange: onSuccessOpenChange } = useDisclosure();

  const handleInputChange = (e: { target: { value: React.SetStateAction<string>; }; }) => {
    setReportName(e.target.value);
    if(e.target.value.length > 0) {
      setIsInvalid(false);
      setIsDisabled(false);
    }
    else {
      setIsInvalid(true);
      setIsDisabled(true);
    }
  };

  const handleSave = async (reportName: string) => {
    reportName = reportName.trim();
    if(reportName.length === 0) {
      setIsInvalid(true);
      setIsDisabled(true);
      return;
    }
    const urlResults = results.filter((res) => res.url === url);
    if (urlResults && urlResults[0]) {
      try {
        await saveReport({
          reportName,
          reportData: urlResults[0],
          userId: user?.uuid,
          isSummary: false,
        });
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
    }
}, [isOpen]);


  return (
    <>
      <div className="min-h-screen p-4">
        <Button
          className="text-md font-poppins-semibold bg-jungleGreen-700 text-dark-primaryTextColor dark:bg-jungleGreen-400 dark:text-primaryTextColor"
          onClick={backToScrapeResults}
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
                    variant="flat" 
                    data-testid="btn-export-save-report"
                    startContent={<FiShare className={iconClasses}/>}
                  >
                    Export/Save
                  </Button>
                </DropdownTrigger>
                {user ? (
                  <DropdownMenu variant="flat" aria-label="Dropdown menu with icons">
                    <DropdownItem
                      key="save"
                      startContent={<FiSave className={iconClasses}/>}
                      description="Save the report on our website"
                      onAction={onOpenChange}
                      data-testid="save-report-button"
                    >
                      Save
                    </DropdownItem>
                    <DropdownItem
                      key="download"
                      startContent={<FiDownload className={iconClasses}/>}
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
                      startContent={<FiSave className={iconClasses}/>}
                      description="Sign up or log in to save the report on our website"
                    >
                      Save
                    </DropdownItem>
                    <DropdownItem
                      key="download"
                      startContent={<FiDownload className={iconClasses}/>}
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
        <WEETabs aria-label="Options">
          <Tab key="general" data-testid="tab-general" title="General Overview">
            <Card>
              <CardBody>

                {/* Summary */}
                <div className="py-3">
                  <h3 className="font-poppins-semibold text-lg text-jungleGreen-700 dark:text-jungleGreen-100 pb-2">
                    Summary 
                    <InfoPopOver 
                      heading="Website Summary" 
                      content="This section provides a brief overview of the website based on the information extracted from the website's metadata." 
                      placement="right-end" 
                    />
                  </h3>
                  <Card shadow="sm" className="col-span-3 text-center bg-zinc-100 dark:bg-zinc-800">
                    <CardBody>
                      {(summaryInfo && (summaryInfo?.title || summaryInfo?.description)) ? (
                        <div className="text-center font-poppins-semibold text-lg text-jungleGreen-800 dark:text-dark-primaryTextColor">
                          <p>
                            {summaryInfo?.title}
                          </p>
                          <br/>
                          {logo && (
                            <div className="flex justify-center">
                              <div className="flex justify-center">
                              <Image
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
                          <br/>
                          <p>
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
                  <WEETable isStriped aria-label="Example static collection table">
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

                  <WEETable isStriped aria-label="Address and contact info table">
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

                {/* Home page screenshot */}
                <div className='py-3'>
                  <h3 className="font-poppins-semibold text-lg text-jungleGreen-700 dark:text-jungleGreen-100 p-2">
                    Home page screenshot
                  </h3>

                  {(homePageScreenShot && homePageScreenShot !== 'data:image/png;base64,') 
                  ? (
                      <div className="flex justify-center">
                        <div className="flex justify-center">
                          <Image
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

                {/* Pagination of Images */}
                {imageList && imageList.length > 0 && (
                  <div className="py-3">
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
                        <Card shadow="sm" key={index} id="unique-results-image">
                          <CardBody className="overflow-visible p-0">
                            <Image
                              shadow="sm"
                              radius="lg"
                              width="100%"
                              alt={'Image'}
                              className="w-full object-cover h-[140px]"
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

              </CardBody>
            </Card>
          </Tab>
          <Tab key="seo" data-testid="tab-seo" title="SEO Analysis">
            <Card>
              <CardBody>
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
                      <div className='flex text-4xl justify-center rounded-full bg-jungleGreen-700 dark:bg-jungleGreen-300 p-2 text-dark-primaryTextColor dark:text-primaryTextColor'>
                        <FiImage />
                      </div>
                      <div className='my-auto'>
                        <h4 className='font-poppins-semibold text-jungleGreen-700 dark:text-jungleGreen-100 pl-4 text-lg'>
                          Images
                          <InfoPopOver 
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
                                <div className='font-poppins-bold text-6xl text-jungleGreen-800 dark:text-jungleGreen-400'>
                                  {imagesAnalysis?.totalImages}
                                </div>
                                <div className='font-poppins-semibold text-lg'>
                                  Total Images
                                </div>
                              </div>
                            </div>

                            <div className='bg-zinc-300 dark:bg-zinc-800 rounded-xl text-center flex justify-center items-center p-4'>
                              <div>
                                <div className='font-poppins-bold text-6xl text-jungleGreen-800 dark:text-jungleGreen-400'>
                                  {imagesAnalysis?.missingAltTextCount}
                                </div>
                                <div className='font-poppins-semibold text-lg'>
                                  Missing Alt. Text
                                </div>
                              </div>
                            </div>

                            <div className='bg-zinc-300 dark:bg-zinc-800 rounded-xl text-center flex justify-center items-center p-4'>
                              <div>                             
                                <div className='font-poppins-bold text-6xl text-jungleGreen-800 dark:text-jungleGreen-400'>
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
                                  {imagesAnalysis?.reasonsMap.format.map((formatUrl, index) => (
                                    <p key={index}>
                                      <Link href={formatUrl}>{formatUrl}</Link> 
                                    </p>                           
                                  ))}
                                </div>
                              </div>
                          }

                          {
                            imagesAnalysis?.reasonsMap.size.length != 0 &&
                              <div className='py-2'>
                                <h5 className='font-poppins-semibold text-jungleGreen-700 dark:text-jungleGreen-100'>
                                  The size of the following URLs are to big
                                </h5>
                                <div className='overflow-x-scroll'>
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
                                <div className='overflow-x-scroll'>
                                  {imagesAnalysis?.reasonsMap.other.map((otherUrl, index) => (
                                    <p key={index}>
                                      <Link href={otherUrl}>{otherUrl}</Link> 
                                    </p>
                                  ))}
                                </div>
                              </div>
                          }

                          {/* {
                            imagesAnalysis?.recommendations != '' &&
                              <div data-testid='images_recommendations' className='py-2 bg-jungleGreen-200/60 dark:bg-jungleGreen-400/40 p-2 rounded-xl mt-2'>
                                <h5 className='font-poppins-semibold text-jungleGreen-700 dark:text-jungleGreen-100'>
                                  Recommendations
                                </h5>
                                <p>{imagesAnalysis?.recommendations}</p>
                              </div>
                          } */}
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
                      <div className='flex text-4xl justify-center rounded-full bg-jungleGreen-700 dark:bg-jungleGreen-300 p-2 text-dark-primaryTextColor dark:text-primaryTextColor'>
                        <FiLink />
                      </div>
                      <div className='my-auto'>
                        <h4 className='font-poppins-semibold text-jungleGreen-700 dark:text-jungleGreen-100 pl-4 text-lg'>
                          Internal Linking
                          <InfoPopOver 
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
                                <div className='font-poppins-bold text-6xl text-jungleGreen-800 dark:text-jungleGreen-400'>
                                  {internalLinkingAnalysis?.totalLinks}
                                </div>
                                <div className='font-poppins-semibold text-lg'>
                                  Total Links
                                </div>
                              </div>
                            </div>

                            <div className='bg-zinc-300 dark:bg-zinc-800 p-4 rounded-xl text-center flex justify-center items-center'>
                              <div>
                                <div className='font-poppins-bold text-6xl text-jungleGreen-800 dark:text-jungleGreen-400'>
                                  {internalLinkingAnalysis?.uniqueLinks}
                                </div>
                                <div className='font-poppins-semibold text-lg'>
                                  Unique Links
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* {
                            internalLinkingAnalysis?.recommendations != '' &&
                              <div data-testid='internalLinking_recommendations' className='py-2 bg-jungleGreen-200/60 dark:bg-jungleGreen-400/40 p-2 rounded-xl mt-2'>
                                <h5 className='font-poppins-semibold text-jungleGreen-700 dark:text-jungleGreen-100'>
                                  Recommendations
                                </h5>
                                <p>{internalLinkingAnalysis?.recommendations}</p>
                              </div>
                          } */}
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
                      <div className='flex text-4xl justify-center rounded-full bg-jungleGreen-700 dark:bg-jungleGreen-300 p-2 text-dark-primaryTextColor dark:text-primaryTextColor'>
                        <FiUmbrella />
                      </div>
                      <div className='my-auto'>
                        <h4 className='font-poppins-semibold text-jungleGreen-700 dark:text-jungleGreen-100 pl-4 text-lg'>
                          Headings
                          <InfoPopOver 
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
                          <p>{headingAnalysis?.count}</p>
                        </div>

                        <div className='py-1'>
                          <h5 className='font-poppins-semibold text-jungleGreen-700 dark:text-jungleGreen-100'>
                            List of Headings
                          </h5>
                          <ScrollShadow hideScrollBar className="max-h-[400px]" size={150}>
                            {/* <Content /> */}                            
                            {headingAnalysis?.headings.map((heading, index) => (
                              <p key={index}>{heading}</p>
                            ))}
                          </ScrollShadow>
                        </div>

                        {/* {
                          headingAnalysis?.recommendations != '' &&
                            <div data-testid='headings_recommendations' className='py-2 bg-jungleGreen-200/60 dark:bg-jungleGreen-400/40 p-2 rounded-xl mt-2'>
                              <h5 className='font-poppins-semibold text-jungleGreen-700 dark:text-jungleGreen-100'>
                                Recommendations
                              </h5>
                              <p>{headingAnalysis?.recommendations}</p>
                            </div>
                        } */}
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
                      <div className='flex text-4xl justify-center rounded-full bg-jungleGreen-700 dark:bg-jungleGreen-300 p-2 text-dark-primaryTextColor dark:text-primaryTextColor'>
                        <FiCode />
                      </div>
                      <div className='my-auto'>
                        <h4 className='font-poppins-semibold text-jungleGreen-700 dark:text-jungleGreen-100 pl-4 text-lg'>
                          Meta Description
                          <InfoPopOver 
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
                            <p>{metaDescriptionAnalysis?.titleTag}</p>
                          </div>

                          <div className='py-1'>
                            <h5 className='font-poppins-semibold text-jungleGreen-700 dark:text-jungleGreen-100'>
                              Length
                            </h5>
                            <p>{metaDescriptionAnalysis?.length}</p>
                          </div>

                          {/* {
                            metaDescriptionAnalysis?.recommendations !== '' && (
                              <div data-testid='meta_recommendations' className='py-2 bg-jungleGreen-200/60 dark:bg-jungleGreen-400/40 p-2 rounded-xl mt-2'>
                                <h5 className='font-poppins-semibold text-jungleGreen-700 dark:text-jungleGreen-100'>
                                  Recommendations
                                </h5>
                                <p>{metaDescriptionAnalysis?.recommendations}</p>
                              </div>
                          )} */}
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
                      <div className='flex text-4xl justify-center rounded-full bg-jungleGreen-700 dark:bg-jungleGreen-300 p-2 text-dark-primaryTextColor dark:text-primaryTextColor'>
                        <FiType />
                      </div>
                      <div className='my-auto'>
                        <h4 className='font-poppins-semibold text-jungleGreen-700 dark:text-jungleGreen-100 pl-4 text-lg'>
                          Title Tags
                          <InfoPopOver 
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
                            <p>{titleTagsAnalysis?.metaDescription}</p>
                          </div>

                          <div className='py-1'>
                            <h5 className='font-poppins-semibold text-jungleGreen-700 dark:text-jungleGreen-100'>
                              Length
                            </h5>
                            <p>{titleTagsAnalysis?.length}</p>
                          </div>

                          <div className='py-1'>
                            <h5 className='font-poppins-semibold text-jungleGreen-700 dark:text-jungleGreen-100'>
                              Is URL in description?
                            </h5>
                            <p>{titleTagsAnalysis?.isUrlWordsInDescription == true ? 'Yes' : 'No'}</p>
                          </div>

                          {/* {
                            titleTagsAnalysis?.recommendations != '' && 
                              <div data-testid='titleTag_recommendations' className='py-2 bg-jungleGreen-200/60 dark:bg-jungleGreen-400/40 p-2 rounded-xl mt-2'>
                                <h5 className='font-poppins-semibold text-jungleGreen-700 dark:text-jungleGreen-100'>
                                  Recommendations
                                </h5>
                                <p>{titleTagsAnalysis?.recommendations}</p>
                              </div>
                          } */}
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
                      <div className='flex text-4xl justify-center rounded-full bg-jungleGreen-700 dark:bg-jungleGreen-300 p-2 text-dark-primaryTextColor dark:text-primaryTextColor'>
                        <FiBook />
                      </div>
                      <div className='my-auto'>
                        <h4 className='font-poppins-semibold text-jungleGreen-700 dark:text-jungleGreen-100 pl-4 text-lg'>
                          Unique Content
                          <InfoPopOver 
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
                              <div className='font-poppins-bold text-6xl text-jungleGreen-800 dark:text-jungleGreen-400'>
                                {uniqContentAnalysis?.textLength}
                              </div>
                              <div className='font-poppins-semibold text-lg'>
                                Text Length
                              </div>
                            </div>
                          </div>

                          <div className='bg-zinc-300 dark:bg-zinc-800 p-4 rounded-xl text-center flex justify-center items-center'>
                            <div>
                              <div className='font-poppins-bold text-6xl text-jungleGreen-800 dark:text-jungleGreen-400'>
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
                          <div>
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

                        {/* {
                          uniqContentAnalysis?.recommendations != '' &&
                            <div data-testid='uniqueContent_recommendations' className='py-2 bg-jungleGreen-200/60 dark:bg-jungleGreen-400/40 p-2 rounded-xl mt-2'>
                              <h5 className='font-poppins-semibold text-jungleGreen-700 dark:text-jungleGreen-100'>
                                Recommendations
                              </h5>
                              <p>{uniqContentAnalysis?.recommendations}</p>
                            </div>
                        } */}
                      </div>
                      :
                      <>
                        {uniqContentAnalysis?.error}
                      </>
                    }
                  </div> {/* EO Unique Content Analysis */}

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
                      heading="Sentiment Analysis" 
                      content="This section provides a brief overview of the website based on the information extracted from the website's metadata." 
                      placement="right-end" 
                    />
                  </h3> 
                    {sentimentAnalysis && sentimentAnalysis.sentimentAnalysis && sentimentAnalysis.sentimentAnalysis.positive > 0 && sentimentAnalysis.sentimentAnalysis.neutral > 0 && sentimentAnalysis.sentimentAnalysis.negative > 0 ? (
                      <div className='w-full md:w-1/2 md:mx-auto'>
                        <DonutChart dataLabel={['Positive', 'Neutral', 'Negative']} dataSeries={[(sentimentAnalysis?.sentimentAnalysis.positive*100), (sentimentAnalysis?.sentimentAnalysis.neutral*100), (sentimentAnalysis?.sentimentAnalysis.negative*100)]} legendPosition='right'/>
                      </div>  )
                      : (
                      <div>
                        No sentiment analysis data to display
                      </div> )
                    }

                  {/* Positive and Negative Words */}
                  <h3 className="font-poppins-semibold text-lg text-jungleGreen-700 dark:text-jungleGreen-100 p-2 px-0 pb-0">
                    Positive and Negative Words
                    <InfoPopOver 
                      heading="Positive and Negative Words" 
                      content="This section provides a brief overview of the website based on the information extracted from the website's metadata." 
                      placement="right-end" 
                    />
                  </h3> 
                  {!sentimentAnalysis || (sentimentAnalysis?.positiveWords.length == 0 && sentimentAnalysis?.negativeWords.length == 0) ? (
                    <div>There is no positive or negative words to display</div>
                  )
                  : (
                    <>                    
                      {metaData && isMetadata(metaData) ? (
                        <div>
                          <div>
                            {metaData?.title && metaData.title.split(/(\s+)/).map((part, index) => (
                              sentimentAnalysis?.positiveWords.includes(part.trim()) ? 
                              <span key={index}><Chip color="success" variant="flat" radius="sm" className='px-0 my-1'>{part}</Chip></span> : 
                              (sentimentAnalysis?.negativeWords.includes(part.trim()) ? 
                              <span key={index}><Chip color="danger" variant="flat" radius="sm" className='px-0 my-1'>{part}</Chip></span> : 
                              <span key={index}>{part}</span>)
                            ))}
                          </div>
                          <div>
                            {metaData?.description && metaData.description.split(/(\s+)/).map((part, index) => (
                              sentimentAnalysis?.positiveWords.includes(part.trim()) ? 
                              <span key={index}><Chip color="success" variant="flat" radius="sm" className='px-0 my-1'>{part}</Chip></span> : 
                              (sentimentAnalysis?.negativeWords.includes(part.trim()) ? 
                              <span key={index}><Chip color="danger" variant="flat" radius="sm" className='px-0 my-1'>{part}</Chip></span> : 
                              <span key={index}>{part}</span>)
                            ))}
                          </div>
                          <div>
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

                  {/* Emotions */}
                  <h3 className="font-poppins-semibold text-lg text-jungleGreen-700 dark:text-jungleGreen-100 p-2 px-0 pb-0">
                    Emotions
                    <InfoPopOver 
                      heading="Emotions" 
                      content="This section provides a brief overview of the website based on the information extracted from the website's metadata." 
                      placement="right-end" 
                    />
                  </h3>         
                  <div className='gap-3 grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-7'>
                    <div className="flex justify-center">
                      <CircularProgressSentiment value={20} label={"Anger"}/>
                    </div>
                    <div className="flex justify-center">
                      <CircularProgressSentiment value={12} label={"Disgust"}/>
                    </div>
                    <div className="flex justify-center">
                      <CircularProgressSentiment value={37} label={"Fear"}/>
                    </div>
                    <div className="flex justify-center">
                      <CircularProgressSentiment value={40} label={"Joy"}/>
                    </div>
                    <div className="flex justify-center">
                      <CircularProgressSentiment value={84} label={"Neutral"}/>
                    </div>
                    <div className="flex justify-center">
                      <CircularProgressSentiment value={13} label={"Sadness"}/>
                    </div>
                    <div className="flex justify-center">
                      <CircularProgressSentiment value={22} label={"Surprise"}/>
                    </div>
                  </div>       
                    
                </div>{/* EO Sentiment Analysis */}
              </CardBody>
            </Card>
          </Tab>              
        </WEETabs>
      </div>   

      {/* Confirm save */}
      <Modal 
        isOpen={isOpen} 
        onOpenChange={onOpenChange}
        placement="top-center"
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
                  errorMessage="Please provide a name for the report"
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
                  >
                  Save
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

       {/* successfull save */}
       <Modal isOpen={isSuccessOpen} onOpenChange={onSuccessOpenChange} className="font-poppins-regular">
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


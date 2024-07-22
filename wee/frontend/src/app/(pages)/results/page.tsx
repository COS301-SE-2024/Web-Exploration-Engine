'use client';
import React, { useEffect, useState, Suspense } from 'react';
import { Card, CardBody, Image } from '@nextui-org/react';
import {
  Button, Tabs, Tab,
  TableHeader, TableColumn, TableBody, TableRow, TableCell,
  Dropdown, DropdownTrigger, DropdownMenu, DropdownItem,
  Modal, ModalContent, ModalBody, useDisclosure, Input, ModalFooter,
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
import { Metadata, ErrorResponse } from '../../models/ScraperModels';
import { FiCheck, FiSearch, FiEye, FiSmartphone, FiClock, FiImage, FiAnchor } from "react-icons/fi";

interface Classifications {
  label: string;
  score: number;
}

interface SummaryInfo {
  title: string;
  description: string;
}

interface TitleTags {
  length: number;
  metaDescription: string;
  recommendations: string;
}
interface Headings {
  count: number;
  headings: string[];
  recommendations: string;
}

interface Images {
  errorUrls: string[];
  missingAltTextCount: number;
  nonOptimizedCount: number;
  reasonsMap: ReasonsMap;
  recommendations: string;
  totalImages: number;
}

interface ReasonsMap {
  format: string[];
  other: string[];
  size: string[];
}

export default function Results() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResultsComponent />
    </Suspense>
  );
}

function isMetadata(data: Metadata | ErrorResponse): data is Metadata {
  return 'title' in data || 'ogTitle' in data || 'description' in data || 'ogDescription' in data;
}

function ResultsComponent() {
  const iconClasses = "text-xl text-default-500 pointer-events-none flex-shrink-0";

  const searchParams = useSearchParams();
  const url = searchParams.get('url');

  const { results } = useScrapingContext();
  const { user } = useUserContext();

  const router = useRouter();

  const [websiteStatus, setWebsiteStatus] = useState('');
  const [isCrawlable, setIsCrawlable] = useState(false);
  const [industryClassification, setIndustryClassification] =
    useState<Classifications>();
  const [domainClassification, setDomainClassification] =
    useState<Classifications>();
  const [logo, setLogo] = useState('');
  const [imageList, setImageList] = useState<string[]>([]);
  const [summaryInfo, setSummaryInfo] = useState<SummaryInfo>();
  const [homePageScreenShot, setHomePageScreenShot] = useState('');
  const [addresses, setAddresses] = useState<string[]>([]);
  const [emails, setEmails] = useState<string[]>([]);
  const [phones, setPhones] = useState<string[]>([]);
  const [socialLinks, setSocialLinks] = useState<string[]>([]);
  const [titleTagsAnalysis, setTitleTagAnalysis] = useState<TitleTags>();
  const [headingAnalysis, setHeadingAnalysis] = useState<Headings>();
  const [imagesAnalysis, setImageAnalysis] = useState<Images>();

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
          setIndustryClassification(urlResults[0].industryClassification.metadataClass);
          setDomainClassification(urlResults[0].industryClassification.domainClass);

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
        }
      }
    }
  }, [url]);  

  const backToScrapeResults = () => {
    router.back();
  };

  const handleDownloadReport = () => {
    const doc = new jsPDF();
    
    // Title
    doc.setFontSize(20);
    const title = 'Web Exploration Engine Individual Report';
    const titleWidth = doc.getStringUnitWidth(title) * 20 / doc.internal.scaleFactor;
    const x = (doc.internal.pageSize.width - titleWidth) / 2;
    doc.text(title, x, 20);
  
    // Define table positions and dimensions
    const startY = 30;
    const margin = 14;
    const headerHeight = 10;
    const rowHeight = 10;
    const columnWidth = [60, 190];
    
    // Function to draw a horizontal line
    const drawLine = (lineY: number): void => {
      doc.setDrawColor(200, 200, 200); // Light grey color
      doc.line(0, lineY - 1, margin + columnWidth[0] + columnWidth[1], lineY - 1); 
    };
    
    // Draw Table Header
    const darkTealGreenR = 47; 
    const darkTealGreenG = 139; 
    const darkTealGreenB = 87; 
    doc.setFontSize(14);
    doc.setFillColor(darkTealGreenR, darkTealGreenG, darkTealGreenB); // Set header background color
    doc.rect(0, startY, columnWidth[0] + columnWidth[1], headerHeight, 'F');
    doc.setTextColor(255, 255, 255);
    doc.text('Category', margin + 2, startY + 7);
    doc.text('Information', margin + columnWidth[0] + 2, startY + 7);
  
    // Function to split text into lines that fit within a max width
    const splitText =(text: string, maxWidth: number): string[] => {
      const lines = [];
      let line = '';
      const words = text.split(' ');
  
      for (const word of words) {
        const testLine = line + (line.length > 0 ? ' ' : '') + word;
        const testWidth = doc.getStringUnitWidth(testLine) * 20 / doc.internal.scaleFactor;
  
        if (testWidth > maxWidth) {
          lines.push(line);
          line = word;
        } else {
          line = testLine;
        }
      }
      if (line.length > 0) {
        lines.push(line);
      }
      
      return lines;
    };
  
    // Draw Table Rows
    const rows = [
      ['URL', url || 'N/A'],
      ['Title', summaryInfo?.title || 'N/A'],
      ['Description', summaryInfo?.description || 'N/A'],
      ['Website Status', websiteStatus || 'N/A'],
      ['Crawlable', isCrawlable ? 'Yes' : 'No'],
      ['Industry', industryClassification?.label || 'N/A'],
      ['Confidence Score', isCrawlable ? `${(industryClassification?.score ? (industryClassification.score * 100).toFixed(2) : 0)}%` : 'N/A'],
      ['Domain Match', domainClassification?.label || 'N/A'],
      ['Confidence Score', isCrawlable ? `${(domainClassification?.score ? (domainClassification.score * 100).toFixed(2) : 0)}%` : 'N/A'],
    ];
  
    let y = startY + headerHeight;
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
  
    rows.forEach(row => {
      const [category, info] = row;
      const categoryLines = splitText(category, columnWidth[0] - 4);
      const infoLines = splitText(info, columnWidth[1] - 4);
      
      categoryLines.forEach((line, i) => {
        doc.text(line, margin + 2, y + (i * rowHeight) + 7);
      });
      infoLines.forEach((line, i) => {
        doc.text(line, margin + columnWidth[0] + 2, y + (i * rowHeight) + 7);
      });
      
      // Draw line after each row
      drawLine(y + Math.max(categoryLines.length, infoLines.length) * rowHeight + 3);
      
      y += Math.max(categoryLines.length, infoLines.length) * rowHeight;
      
      if (y > 270) { // Check if the y position exceeds the page limit
        doc.addPage();
        y = 20; // Reset y position on the new page
        doc.text('Category', margin + 2, y + 7);
        doc.text('Information', margin + columnWidth[0] + 2, y + 7);
        y += headerHeight;
      }
    });
  
    // Clean Filename
    const cleanFilename = (url: string | null): string => {
      if (!url) return 'website-summary-report';
      let filename = url.replace('http://', '').replace('https://', '');
      filename = filename.split('').map(char => {
        return ['/', ':', '*', '?', '"', '<', '>', '|'].includes(char) ? '_' : char;
      }).join('');
      return filename.length > 50 ? filename.substring(0, 50) : filename;
    };
  
    const filename = cleanFilename(url);
    doc.save(`${filename}.pdf`);
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
            <h1 className="mt-4 font-poppins-bold text-2xl text-jungleGreen-800 dark:text-dark-primaryTextColor">
              Results of {url}
            </h1>
            <div className="mt-4 mr-4 flex justify-end">
              <Dropdown>
                <DropdownTrigger>
                  <Button 
                    variant="flat" 
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
                      startContent={<FiSave className={iconClasses}/>}
                      description="Sign up or log in to save the report on our website"
                    >
                      Save
                    </DropdownItem>
                    <DropdownItem
                      key="download"
                      startContent={<FiDownload className={iconClasses}/>}
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

        {/* Tabs */}
        <Tabs aria-label="Options" size="lg">
          <Tab key="general" title="General Overview">
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
                          <Chip radius="sm" color="secondary" variant="flat">
                            {isCrawlable ? `${industryClassification?.label}` : 'N/A'}
                          </Chip>
                          <Chip
                            radius="sm"
                            color={
                              industryClassification?.score &&
                              industryClassification?.score * 100 > 80
                                ? 'success'
                                : industryClassification?.score &&
                                  industryClassification?.score * 100 >= 50
                                ? 'warning'
                                : 'danger'
                            }
                            variant="flat"
                            className="ml-[2px] mt-2 sm:ml-2 sm:mt-0"
                          >
                            {isCrawlable && industryClassification?.score
                              ? `Confidence Score: ${(industryClassification?.score * 100).toFixed(2)}%`
                              : 'Confidence Score: 0%'}
                          </Chip>
                        </TableCell>
                      </TableRow>
                      <TableRow key="4">
                        <TableCell>Domain match</TableCell>
                        <TableCell>
                          <Chip radius="sm" color="secondary" variant="flat">
                            {isCrawlable ? `${domainClassification?.label}` : 'N/A'}
                          </Chip>
                          <Chip
                            radius="sm"
                            color={
                              domainClassification?.score &&
                              domainClassification?.score * 100 > 80
                                ? 'success'
                                : domainClassification?.score &&
                                  domainClassification?.score * 100 >= 50
                                ? 'warning'
                                : 'danger'
                            }
                            variant="flat"
                            className="ml-[2px] mt-2 sm:ml-2 sm:mt-0"
                          >
                            {isCrawlable && domainClassification?.score
                              ? `Confidence Score: ${(domainClassification?.score * 100).toFixed(2)}%`
                              : 'Confidence Score: 0%'}
                          </Chip>
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
          <Tab key="media" title="Media">
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
          <Tab key="seo" title="SEO Analysis">
            <Card>
              <CardBody>
                {/* Keyword Analysis */}
                <div>
                  <h3 className="font-poppins-semibold text-lg text-jungleGreen-700 dark:text-jungleGreen-100 p-2 px-0">
                    Keyword Analysis
                    <InfoPopOver 
                      heading="Keyword Analysis" 
                      content="Where does this data come from or what does it mean (insigth)" 
                      placement="right-end" 
                    />
                  </h3>
                </div>

                {/* Onpage Analysis */}
                <div>
                  {/* Heading */}
                  <h3 className="font-poppins-semibold text-lg text-jungleGreen-700 dark:text-jungleGreen-100 p-2 px-0 pb-0">
                    On-Page Analysis
                    <InfoPopOver 
                      heading="On-Page Analysis" 
                      content="Where does this data come from or what does it mean (insigth)" 
                      placement="right-end" 
                    />
                  </h3>

                  {/* Heading Analysis */}
                  <div className='bg-zinc-200 dark:bg-zinc-700 rounded-xl p-3 my-2'>
                    {/* Heading */}
                    <div className='flex mb-2'>
                      <div className='flex text-4xl justify-center rounded-full bg-jungleGreen-700 dark:bg-jungleGreen-300 p-2 text-dark-primaryTextColor dark:text-primaryTextColor'>
                        <FiSearch />
                      </div>
                      <div className='my-auto'>
                        <h4 className='font-poppins-semibold text-jungleGreen-700 dark:text-jungleGreen-100 pl-4 text-lg'>
                          Headings
                        </h4>
                      </div>
                    </div>

                    {/* Content */}
                    <div>
                      <div className='py-1'>
                        <h5 className='font-poppins-semibold text-jungleGreen-700 dark:text-jungleGreen-100'>
                          List of Headings
                        </h5>
                        <ul>
                          {headingAnalysis?.headings.map((heading) => (
                            <li>{heading}</li>
                          ))}
                        </ul>
                      </div>

                      <div className='py-1'>
                        <h5 className='font-poppins-semibold text-jungleGreen-700 dark:text-jungleGreen-100'>
                          Count
                        </h5>
                        <p>{headingAnalysis?.count}</p>
                      </div>

                      <div className='py-1'>
                        <h5 className='font-poppins-semibold text-jungleGreen-700 dark:text-jungleGreen-100'>
                          Recommendations
                        </h5>
                        <p>{headingAnalysis?.recommendations}</p>
                      </div>
                    </div>
                  </div>

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
                        </h4>
                      </div>
                    </div>

                    {/* Content */}
                    <div>
                      <div className='py-1'>
                        <h5 className='font-poppins-semibold text-jungleGreen-700 dark:text-jungleGreen-100'>
                          Total images
                        </h5>
                        <p>
                          {imagesAnalysis?.totalImages}
                        </p>
                      </div>

                      <div className='py-1'>
                        <h5 className='font-poppins-semibold text-jungleGreen-700 dark:text-jungleGreen-100'>
                          Missing alternative text count
                        </h5>
                        <p>
                          {imagesAnalysis?.missingAltTextCount}
                        </p>
                      </div>

                      <div className='py-1'>
                        <h5 className='font-poppins-semibold text-jungleGreen-700 dark:text-jungleGreen-100'>
                          Non-optimized images
                        </h5>
                        <p>{imagesAnalysis?.nonOptimizedCount}</p>
                      </div>

                      <div className='py-1'>
                        <h5 className='font-poppins-semibold text-jungleGreen-700 dark:text-jungleGreen-100'>
                          The format of the following URLs are incorrect
                        </h5>
                        <p>
                          {imagesAnalysis?.reasonsMap.format.map((formatUrl) => (
                            <p>{formatUrl}</p>
                          ))}
                        </p>
                      </div>

                      <div className='py-1'>
                        <h5 className='font-poppins-semibold text-jungleGreen-700 dark:text-jungleGreen-100'>
                          The size of the following URLs are to big
                        </h5>
                        <p>
                          {imagesAnalysis?.reasonsMap.size.map((reasonUrl) => (
                            <p>{reasonUrl}</p>
                          ))}
                        </p>
                      </div>

                      <div className='py-1'>
                        <h5 className='font-poppins-semibold text-jungleGreen-700 dark:text-jungleGreen-100'>
                          The following images have some problems:
                        </h5>
                        <p>
                          {imagesAnalysis?.reasonsMap.other.map((otherUrl) => (
                            <p>{otherUrl}</p>
                          ))}
                        </p>
                      </div>

                      <div className='py-1'>
                        <h5 className='font-poppins-semibold text-jungleGreen-700 dark:text-jungleGreen-100'>
                          Recommendations
                        </h5>
                        <p>{imagesAnalysis?.recommendations}</p>
                      </div>
                    </div>
                  </div>

                  {/* Title Tags */}
                  <div className='bg-zinc-200 dark:bg-zinc-700 rounded-xl p-3 my-2'>
                    {/* Heading */}
                    <div className='flex mb-2'>
                      <div className='flex text-4xl justify-center rounded-full bg-jungleGreen-700 dark:bg-jungleGreen-300 p-2 text-dark-primaryTextColor dark:text-primaryTextColor'>
                        <FiSearch />
                      </div>
                      <div className='my-auto'>
                        <h4 className='font-poppins-semibold text-jungleGreen-700 dark:text-jungleGreen-100 pl-4 text-lg'>
                          Title Tags
                        </h4>
                      </div>
                    </div>

                    {/* Content */}
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
                          Recommendations
                        </h5>
                        <p>{titleTagsAnalysis?.recommendations}</p>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Technical Analysis */}
                <div>
                  <h3 className="font-poppins-semibold text-lg text-jungleGreen-700 dark:text-jungleGreen-100 p-2 px-0">
                    Technical Analysis
                    <InfoPopOver 
                      heading="Technical Analysis" 
                      content="Where does this data come from or what does it mean (insigth)" 
                      placement="right-end" 
                    />
                  </h3>
                </div>
              </CardBody>
            </Card>
          </Tab>
          <Tab key="wow" title="WOW factors">
            <Card>
              <CardBody>
                wow
              </CardBody>
            </Card>
          </Tab>              
        </Tabs>
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


'use client';
import React, { useEffect, useState, Suspense } from 'react';
import { Card, CardBody, Image } from '@nextui-org/react';
import {
  Button,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from '@nextui-org/react';
import { Chip } from '@nextui-org/react';
import { useSearchParams } from 'next/navigation';
import WEETable from '../../components/Util/Table';
import WEEPagination from '../../components/Util/Pagination';
import { useRouter } from 'next/navigation';
import { useScrapingContext } from '../../context/ScrapingContext';
import { InfoPopOver } from '../../components/InfoPopOver';
import { ExportDropdown } from '../../components/ExportDropdown';

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

function ResultsComponent() {
  const searchParams = useSearchParams();
  const url = searchParams.get('url');

  const { results } = useScrapingContext();

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
  

  useEffect(() => {
    if (url) {
      const urlResults = results.filter((res) => res.url === url);

      if (urlResults && urlResults[0]) {
        setWebsiteStatus(urlResults[0].domainStatus);
        if ('errorStatus' in urlResults[0].robots) {
          setIsCrawlable(false);
        } else {
          setIsCrawlable(urlResults[0].robots.isUrlScrapable);
          setWebsiteStatus(urlResults[0].domainStatus);
          setSummaryInfo({ 
            title: urlResults[0].metadata.title || urlResults[0].metadata.ogTitle,
            description: urlResults[0].metadata.description || urlResults[0].metadata.ogDescription
          });
          setLogo(urlResults[0].logo);
          setImageList(urlResults[0].images);
          setIndustryClassification(
            urlResults[0].industryClassification.metadataClass
          );
          setDomainClassification(
            urlResults[0].industryClassification.domainClass
          );
        }
      }
    }
  }, [url]);

  const backToScrapeResults = () => {
    router.push(`/scraperesults`);
  };

  //Pagination Logic
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

  return (
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
          <div className="mt-4 flex justify-center">
              <ExportDropdown />
          </div>
      </div>

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
                  color={websiteStatus === 'live' ? 'success' : 'warning'}
                  variant="flat"
                >
                  {websiteStatus === 'live' ? 'Live' : 'Parked'}
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
                  {isCrawlable
                    ? `Confidence Score: ${
                        industryClassification?.score
                          ? (industryClassification?.score * 100).toFixed(2)
                          : 0
                      }%`
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
                  {isCrawlable
                    ? `Confidence Score: ${
                        domainClassification?.score
                          ? (domainClassification?.score * 100).toFixed(2)
                          : 0
                      }%`
                    : 'Confidence Score: 0%'}
                </Chip>
              </TableCell>
            </TableRow>
          </TableBody>
        </WEETable>
      </div>

      {/* Paginatin of Images */}

      {imageList && imageList.length > 0 && (
        <div className="py-3">
          <span className="flex justify-between ">
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
            className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-2 py-6"
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
        <p className="p-4 rounded-lg mb-2 bg-zinc-200 dark:bg-zinc-700">
          No images available.
        </p>
      )}
    </div>
  );
}

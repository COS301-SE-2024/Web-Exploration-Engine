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
import WEEInput from '../../components/Util/Input';
import WEESelect from '../../components/Util/Select';
import WEEPagination from '../../components/Util/Pagination';
import { useRouter } from 'next/navigation';
import { useScrapingContext } from '../../context/ScrapingContext';

const sampleImageList = [
  'https://picsum.photos/id/0/5000/3333',
  'https://picsum.photos/id/1/5000/3333',
  'https://picsum.photos/id/2/5000/3333',
  'https://picsum.photos/id/3/5000/3333',
  'https://picsum.photos/id/4/5000/3333',
  'https://picsum.photos/id/5/5000/3334',
  'https://picsum.photos/id/6/5000/3333',
  'https://picsum.photos/id/7/4728/3168',
  'https://picsum.photos/id/8/5000/3333',
  'https://picsum.photos/id/9/5000/3269',
  'https://picsum.photos/id/10/2500/1667',
  'https://picsum.photos/id/11/2500/1667',
  'https://picsum.photos/id/12/2500/1667',
  'https://picsum.photos/id/13/2500/1667',
  'https://picsum.photos/id/14/2500/1667',
  'https://picsum.photos/id/15/2500/1667',
  'https://picsum.photos/id/16/2500/1667',
  'https://picsum.photos/id/17/2500/1667',
  'https://picsum.photos/id/18/2500/1667',
  'https://picsum.photos/id/19/2500/1667',
  'https://picsum.photos/id/20/3670/2462',
  'https://picsum.photos/id/21/3008/2008',
  'https://picsum.photos/id/22/4434/3729',
  'https://picsum.photos/id/23/3887/4899',
  'https://picsum.photos/id/24/4855/1803',
  'https://picsum.photos/id/25/5000/3333',
  'https://picsum.photos/id/26/4209/2769',
  'https://picsum.photos/id/27/3264/1836',
  'https://picsum.photos/id/28/4928/3264',
  'https://picsum.photos/id/29/4000/2670',
];

interface Classifications {
  label: string;
  score: number;
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
  const [imageList, setImageList] = useState<string[]>(sampleImageList);
  /*   const [imageList, setImageList] = useState<string[]>([]);
   */
  useEffect(() => {
    if (url) {
      const urlResults = results.filter((res) => res.url === url);

      if (urlResults && urlResults[0]) {
        setIsCrawlable(urlResults[0].robots.isUrlScrapable);
        setWebsiteStatus(urlResults[0].domainStatus);
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
  }, [url]);

  const backToScrapeResults = () => {
    router.push(`/scraperesults`);
  };
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const handlePageChange = (page: React.SetStateAction<number>) => {
    setCurrentPage(page);
  };
  const indexOfLastImage = currentPage * itemsPerPage;
  const indexOfFirstImage = indexOfLastImage - itemsPerPage;
  const currentImages = sampleImageList.slice(
    indexOfFirstImage,
    indexOfLastImage
  );

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
      </div>

      <div className="py-3">
        <h3 className="font-poppins-semibold text-lg text-jungleGreen-700 dark:text-jungleGreen-100 pb-2">
          General overview
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
                  {websiteStatus === 'true' ? 'Live' : 'Parked'}
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
                    ? `${
                        industryClassification?.score
                          ? (industryClassification?.score * 100).toFixed(2)
                          : 0
                      }%`
                    : '0%'}
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
                    ? `${
                        domainClassification?.score
                          ? (domainClassification?.score * 100).toFixed(2)
                          : 0
                      }%`
                    : '0%'}
                </Chip>
              </TableCell>
            </TableRow>
          </TableBody>
        </WEETable>
      </div>

      {logo && (
        <div className="py-3">
          <h3 className="font-poppins-semibold text-lg text-jungleGreen-700 dark:text-jungleGreen-100 pb-2">
            Logo
          </h3>
          <div className="gap-2 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5">
            <Card shadow="sm">
              <CardBody className="overflow-visible p-0">
                <Image
                  shadow="sm"
                  radius="lg"
                  width="100%"
                  alt={'Logo'}
                  className="w-full object-cover h-[140px]"
                  src={logo}
                />
              </CardBody>
            </Card>
          </div>
        </div>
      )}
      {!logo && (
        <p className="p-4 rounded-lg mb-2 bg-zinc-200 dark:bg-zinc-700">
          No logo available.
        </p>
      )}

      {/* Paginatin of Images */}

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
        {currentImages.map((item, index) => (
          <Card shadow="sm" key={index}>
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
      <WEEPagination
        total={Math.ceil(sampleImageList.length / itemsPerPage)}
        initialPage={1}
        page={currentPage}
        onChange={handlePageChange}
      />

  

      {imageList.length === 0 && (
        <p className="p-4 rounded-lg mb-2 bg-zinc-200 dark:bg-zinc-700">
          No images available.
        </p>
      )}
    </div>
  );
}

'use client';
import React, { useEffect, Suspense, useRef } from 'react';
import { FiSearch } from 'react-icons/fi';
import { SelectItem } from '@nextui-org/react';
import WEEInput from '../../components/Util/Input';
import WEESelect from '../../components/Util/Select';
import WEEPagination from '../../components/Util/Pagination';
import {
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  Button,
  Spinner,
  Selection
} from '@nextui-org/react';
import { useRouter } from 'next/navigation';
import WEETable from '../../components/Util/Table';
import { useScrapingContext } from '../../context/ScrapingContext';
import Scraping from '../../models/ScrapingModel';
import Link from 'next/link';
import { generateSummary } from '../../services/SummaryService';

function ResultsComponent() {
  const {
    urls,
    setUrls,
    results,
    setResults,
    setSummaryReport,
    processedUrls,
    setProcessedUrls,
    processingUrls,
    setProcessingUrls,
    comparisonIndexes,
    setComparisonIndexes
  } = useScrapingContext();
  const [isLoading, setIsLoading] = React.useState(true);

  const [searchValue, setSearchValue] = React.useState('');
  const hasSearchFilter = Boolean(searchValue);
  const [selectedStatusFilter, setSelectedStatusFilter] = React.useState('');
  const [selectedCrawlableFilter, setSelectedCrawlableFilter] =
    React.useState('');
  const router = useRouter();

  const filteredItems = React.useMemo(() => {
    let filteredUrls = [...results];

    // Apply status filter
    if (selectedStatusFilter === 'Parked') {
      filteredUrls = filteredUrls.filter(
        (url) => url.domainStatus === 'parked'
      );
    } else if (selectedStatusFilter === 'Live') {
      filteredUrls = filteredUrls.filter((url) => url.domainStatus === 'live');
    }

    // Apply crawlable filter
    if (selectedCrawlableFilter === 'Yes') {
      filteredUrls = filteredUrls.filter(
        (url) => url.robots && url.robots.isUrlScrapable
      );
    } else if (selectedCrawlableFilter === 'No') {
      filteredUrls = filteredUrls.filter(
        (url) => url.robots && !url.robots.isUrlScrapable
      );
    }

    // Apply search filter
    if (hasSearchFilter) {
      filteredUrls = filteredUrls.filter((url) =>
        url.url.toLowerCase().includes(searchValue.toLowerCase())
      );
    }

    return filteredUrls;
  }, [results, searchValue, selectedStatusFilter, selectedCrawlableFilter]);

  const handleResultPage = (url: string) => {
    router.push(`/results?url=${encodeURIComponent(url)}`);
  };

  // Pagination
  const [page, setPage] = React.useState(1);
  const [resultsPerPage, setResultsPerPage] = React.useState(5);
  const pages = Math.ceil(filteredItems.length / resultsPerPage);

  const handleResultsPerPageChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const newResultsPerPage = parseInt(event.target.value, 10);
    setResultsPerPage(newResultsPerPage);
    setPage(1);
  };

  const items = React.useMemo(() => {
    const start = (page - 1) * resultsPerPage;
    const end = start + resultsPerPage;

    return filteredItems.slice(start, end);
  }, [page, filteredItems, resultsPerPage]);

  useEffect(() => {
    console.log('urls length: ', urls.length);
    if (urls && urls.length > 0 && urls.length !== results.length) {
      urls.forEach((url) => {
        if (!processedUrls.includes(url) && !processingUrls.includes(url)) {
          // add to array of urls still being processed
          processingUrls.push(url);
          console.log('API call for:', url);
          getScrapingResults(url);
          processingUrls.splice(processingUrls.indexOf(url), 1);
          processedUrls.push(url);
        }
      });
    } else {
      // allows to naviagte back to this page without rescraping the urls
      if (processedUrls.length > 1) {
        // Generate summary report
        console.log('Results:', results);
        const summary = generateSummary(results);
        console.log('Summary:', summary);
        setSummaryReport(summary);
      }
      setIsLoading(false);
    }
  }, [urls.length]);

  useEffect(() => {
    if (urls.length === results.length) {
      setIsLoading(false);
      // allows to navigate back to this page without rescraping the urls
      setUrls([]);
    }
  }, [results]);

  const getScrapingResults = async (url: string) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/scraper?url=${encodeURIComponent(url)}`
      );
      const data = (await response.json()) as Scraping;
      console.log('Response', data);
      setResults((prevResults: Scraping[]) => [...prevResults, data]);
    } catch (error) {
      console.error('Error when scraping website:', error);
    }
  };

  const onSearchChange = (value: string) => {
    if (value) {
      setSearchValue(value);
      setPage(1);
    } else {
      setSearchValue('');
    }
  };

  const handleStatusFilterChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const status = event.target.value;
    setSelectedStatusFilter(status);
  };

  const handleCrawlableFilterChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const crawlable = event.target.value;
    setSelectedCrawlableFilter(crawlable);
  };

  const handleSummaryPage = () => {
    router.push(`/summaryreport`);
  };

  const handleComparisonPage = () => {
    router.push(`/comparison`);
  };

  const [selectedKeys, setSelectedKeys] = React.useState<Selection>(new Set([]));
  
  useEffect(() => {
    if (selectedKeys == 'all') {
      console.log(selectedKeys);
    }
    else {
      console.log("SELECTED KEYS: ", Array.from(selectedKeys));
      setComparisonIndexes(Array.from(selectedKeys));
    }
  }, [selectedKeys]);

  return (
    <div className="p-4">
      <div className="flex justify-center">
        <WEEInput
          data-testid="search-urls"
          isClearable
          type="text"
          placeholder="https://www.takealot.com/"
          labelPlacement="outside"
          className="py-3  w-full md:w-4/5 md:px-5"
          startContent={
            <FiSearch className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
          }
          value={searchValue}
          onValueChange={onSearchChange}
        />
      </div>
      <div className="md:flex md:justify-between md:w-4/5 md:m-auto md:px-5">
        <WEESelect
          label="Live/Parked"
          className="w-full pb-3 md:w-1/3"
          onChange={handleStatusFilterChange}
        >
          <SelectItem key={'Parked'}>Parked</SelectItem>
          <SelectItem key={'Live'}>Live</SelectItem>
        </WEESelect>

        <WEESelect
          label="Crawlable"
          className="w-full pb-3 md:w-1/3"
          onChange={handleCrawlableFilterChange}
        >
          <SelectItem key={'Yes'}>Yes</SelectItem>
          <SelectItem key={'No'}>No</SelectItem>
        </WEESelect>
      </div>

      <h1 className="my-4 font-poppins-bold text-2xl text-jungleGreen-800 dark:text-dark-primaryTextColor">
        Results
      </h1>

      <div className="flex justify-between items-center mb-2">
        <span className="text-default-400 text-small">
          Total {filteredItems.length} results
        </span>
        <label className="flex items-center text-default-400 text-small">
          Results per page:
          <select
            value={resultsPerPage}
            className="bg-transparent outline-none text-default-400 text-small"
            onChange={handleResultsPerPageChange}
            aria-label="Number of results per page"
          >
            <option value="2">2</option>
            <option value="5">5</option>
            <option value="7">7</option>
            <option value="9">9</option>
          </select>
        </label>
      </div>

      <WEETable
        aria-label="Scrape result table"
        selectionMode="multiple" 
        checkboxesProps={{
          classNames: {
            wrapper: "after:bg-foreground after:text-background text-background",
          },
        }}
        onSelectionChange={setSelectedKeys}
        bottomContent={
          <>
            {isLoading ? (
              <div className="flex w-full justify-center">
                <Spinner color="default" />
              </div>
            ) : null}

            {results.length > 0 && (
              <div className="flex w-full justify-center">
                <WEEPagination
                  loop
                  showControls
                  color="stone"
                  page={page}
                  total={pages}
                  onChange={(page) => setPage(page)}
                  aria-label="Pagination"
                />
              </div>
            )}
          </>
        }
        classNames={{
          wrapper: 'min-h-[222px]',
        }}
      >
        <TableHeader>
          <TableColumn key="name" className="rounded-r-lg sm:rounded-none">
            URL
          </TableColumn>
          <TableColumn key="role" className="text-center hidden sm:table-cell">
            CRAWLABLE
          </TableColumn>
          <TableColumn
            key="status"
            className="text-center hidden sm:table-cell"
          >
            RESULT &amp; REPORT
          </TableColumn>
        </TableHeader>

        <TableBody emptyContent={'There are no results to be displayed'}>
          {items.map((item, index) => (
            <TableRow key={index}>
              <TableCell>
                <Link href={`/results?url=${encodeURIComponent(item.url)}`}>
                  {item.url}
                </Link>
              </TableCell>
              <TableCell className="text-center hidden sm:table-cell">
                <Chip
                  radius="sm"
                  color={item.domainStatus === 'live' ? 'success' : 'warning'}
                  variant="flat"
                >
                  {item.domainStatus === 'live' ? 'Yes' : 'No'}
                </Chip>
              </TableCell>
              <TableCell className="text-center hidden sm:table-cell">
                <Button
                  className="font-poppins-semibold bg-jungleGreen-700 text-dark-primaryTextColor dark:bg-jungleGreen-400 dark:text-primaryTextColor"
                  onClick={() => handleResultPage(item.url)}
                  data-testid={'btnView' + index}
                >
                  View
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </WEETable>

      <h1 className="my-4 mt-6 font-poppins-bold text-2xl text-jungleGreen-800 dark:text-dark-primaryTextColor">
        Summary
      </h1>
      <Button
        data-testid="btn-report-summary"
        className="text-md font-poppins-semibold bg-jungleGreen-700 text-dark-primaryTextColor dark:bg-jungleGreen-400 dark:text-primaryTextColor disabled:bg-jungleGreen-600 disabled:dark:bg-jungleGreen-300 disabled:cursor-wait"
        onClick={handleSummaryPage}
        disabled={isLoading}
      >
        View overall summary report
      </Button>

      <h1 className="my-4 mt-6 font-poppins-bold text-2xl text-jungleGreen-800 dark:text-dark-primaryTextColor">
        Comparison
      </h1>
      <Button
        data-testid="btn-report-summary"
        className="text-md font-poppins-semibold bg-jungleGreen-700 text-dark-primaryTextColor dark:bg-jungleGreen-400 dark:text-primaryTextColor disabled:bg-jungleGreen-600 disabled:dark:bg-jungleGreen-300 disabled:cursor-wait"
        onClick={handleComparisonPage}
      >
        View comparison report
      </Button>
    </div>
  );
}
export default function ScrapeResults() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResultsComponent />
    </Suspense>
  );
}

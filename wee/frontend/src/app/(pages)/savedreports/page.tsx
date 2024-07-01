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
} from '@nextui-org/react';
import { useRouter } from 'next/navigation';
import WEETable from '../../components/Util/Table';
import { useScrapingContext } from '../../context/ScrapingContext';
import Scraping from '../../models/ScrapingModel';
import Link from 'next/link';
import { generateSummary } from '../../services/SummaryService';
import { is } from 'cypress/types/bluebird';

function ResultsComponent() {
  const {
    urls,
    setUrls,
    results,
    setResults,
    setSummaryReport,
    processedUrls,
    processingUrls,
  } = useScrapingContext();

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

  // let items = React.useMemo(() => {
  //   const start = (page - 1) * resultsPerPage;
  //   const end = start + resultsPerPage;

  //   return filteredItems.slice(start, end);
  // }, [page, filteredItems, resultsPerPage]);

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
    }
  }, [urls.length]);

  useEffect(() => {
    if (urls.length === results.length) {
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

  // Mock data for demonstration
  const mockItems = [
    {
      reportName: 'Report 1',
      timestamp: '2021-09-01 12:00:00',
      isSummary: false,
    },
    {
      reportName: 'Report for https://example.com',
      timestamp: '2021-09-01 12:00:00',
      isSummary: false,
    },
    {
      reportName: 'Summary Report 1',
      timestamp: '2021-09-01 12:00:00',
      isSummary: true,
    },
    // Add more mock items as needed
  ];

  // Use mockItems for initial display
  const items = mockItems;

  return (
    <div className="p-4">
      <h1 className="my-4 font-poppins-bold text-2xl text-jungleGreen-800 dark:text-dark-primaryTextColor">
        Saved Reports
      </h1>

      <div className="flex justify-between items-center mb-2">
        <span className="text-default-400 text-small">
          Total {filteredItems.length} reports saved
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
        bottomContent={
          <>
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
          <TableColumn key="name" className="rounded-lg sm:rounded-none">
            NAME
          </TableColumn>
          <TableColumn key="role" className="text-center hidden sm:table-cell">
            TIMESTAMP
          </TableColumn>
          <TableColumn
            key="status"
            className="text-center hidden sm:table-cell"
          >
            RESULT &amp; REPORT
          </TableColumn>
        </TableHeader>

        <TableBody emptyContent={'You have no saved reports'}>
          {items
            .filter(item => !item.isSummary)
            .map((item, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Link href={`/results?url=${encodeURIComponent(item.reportName)}`}>
                    {item.reportName}
                  </Link>
                </TableCell>
                <TableCell className="text-center hidden sm:table-cell">
                  {item.timestamp}
                </TableCell>
                <TableCell className="text-center hidden sm:table-cell">
                  <Button
                    className="font-poppins-semibold bg-jungleGreen-700 text-dark-primaryTextColor dark:bg-jungleGreen-400 dark:text-primaryTextColor"
                    onClick={() => handleResultPage(item.reportName)}
                    data-testid={'btnView' + index}
                  >
                    View
                  </Button>
                </TableCell>
              </TableRow>
            )
          )}
        </TableBody>
      </WEETable>
      <h1 className="mt-8 my-4 font-poppins-bold text-2xl text-jungleGreen-800 dark:text-dark-primaryTextColor">
        Saved Summary Reports
      </h1>

      <div className="flex justify-between items-center mb-2">
        <span className="text-default-400 text-small">
          Total {filteredItems.length} saved summary reports
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
        bottomContent={
          <>
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
        <TableColumn key="name" className="rounded-lg sm:rounded-none">
            NAME
          </TableColumn>
          <TableColumn key="role" className="text-center hidden sm:table-cell">
            TIMESTAMP
          </TableColumn>
          <TableColumn
            key="status"
            className="text-center hidden sm:table-cell"
          >
            RESULT &amp; REPORT
          </TableColumn>
        </TableHeader>

        <TableBody emptyContent={'You have no saved summary reports'}>
        {items
            .filter(item => item.isSummary)
            .map((item, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Link href={`/results?url=${encodeURIComponent(item.reportName)}`}>
                    {item.reportName}
                  </Link>
                </TableCell>
                <TableCell className="text-center hidden sm:table-cell">
                  {item.timestamp}
                </TableCell>
                <TableCell className="text-center hidden sm:table-cell">
                  <Button
                    className="font-poppins-semibold bg-jungleGreen-700 text-dark-primaryTextColor dark:bg-jungleGreen-400 dark:text-primaryTextColor"
                    onClick={() => handleResultPage(item.reportName)}
                    data-testid={'btnView' + index}
                  >
                    View
                  </Button>
                </TableCell>
              </TableRow>
            )
          )}
        </TableBody>
      </WEETable>
    </div>
  );
}
export default function SavedReports() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResultsComponent />
    </Suspense>
  );
}

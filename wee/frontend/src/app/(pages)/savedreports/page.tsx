'use client';
import {Tabs, Tab, Card, CardBody} from "@nextui-org/react";
import React, { Suspense, useEffect, useState } from 'react';
import WEEPagination from '../../components/Util/Pagination';
import {
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
} from '@nextui-org/react';
import { FiTrash2 } from "react-icons/fi";
import { useRouter } from 'next/navigation';
import WEETable from '../../components/Util/Table';
import Link from 'next/link';
import { getReports } from '../../services/SaveReportService';
import { useUserContext } from '../../context/UserContext';
import { ReportRecord } from '../../models/ReportModels';
import { deleteReport } from "../../services/SaveReportService";


function ResultsComponent() {
  const { user } = useUserContext();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [reports, setReports] = useState<ReportRecord[]>([]);
  const [summaryReports, setSummaryReports] = useState<ReportRecord[]>([]);
  const [error, setError] = useState<string>('');

  
  const handleResultPage = (url: string) => {
    router.push(`/results?url=${encodeURIComponent(url)}`);
  };

  async function fetchReports() {
    console.log("Fetching reports for user: ", user)
    if(!user) {
      console.error('User not found');
      return;
    };
    try {
      setLoading(true);
      const reportsData = await getReports(user); // Replace with your actual getReports function
      // console.log("Reports Data: ", reportsData);
      const formattedReports = reportsData.filter(item => !item.isSummary);
      const formattedSummaryReports = reportsData.filter(item => item.isSummary);
      setReports(formattedReports);
      setSummaryReports(formattedSummaryReports);
      setLoading(false);
    } catch (error) {
      setError((error as Error).message || 'An error occurred');
      console.error('Error fetching reports:', error);
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchReports();
    console.log("Reports: ", reports);
    console.log("Summary Reports: ", summaryReports);
  }, []);

  // Report pagination
  const [page, setPage] = React.useState(1);
  const [resultsPerPage, setResultsPerPage] = React.useState(5);
  const pages = Math.ceil(reports.length / resultsPerPage);

  const handleReportsPerPageChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const newResultsPerPage = parseInt(event.target.value, 10);
    setResultsPerPage(newResultsPerPage);
    setPage(1);
  };

  const splitReports = React.useMemo(() => {
    const start = (page - 1) * resultsPerPage;
    const end = start + resultsPerPage;
    return reports.slice(start, end);
  }, [page, resultsPerPage, reports]);

  // Summary report pagination
  const [summaryPage, setSummaryPage] = React.useState(1);
  const [summaryResultsPerPage, setSummaryResultsPerPage] = React.useState(5);
  const summaryPages = Math.ceil(summaryReports.length / summaryResultsPerPage);

  const handleSummaryReportsPerPageChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const newResultsPerPage = parseInt(event.target.value, 10);
    setSummaryResultsPerPage(newResultsPerPage);
    setSummaryPage(1);
  };

  const splitSummaryReports = React.useMemo(() => {
    const start = (summaryPage - 1) * summaryResultsPerPage;
    const end = start + summaryResultsPerPage;
    return summaryReports.slice(start, end);
  }, [summaryPage, summaryResultsPerPage, summaryReports]);

  const handleDelete = async (reportId: number) => {
    try {
      console.log("Deleting report with id: ", reportId);
      await deleteReport(reportId);
    } catch (error) {
      console.error('Error deleting report:', error);
    } finally
    {
      await fetchReports();
    }
  };

  return (
    <div className="p-4">
      <div className="text-center">
        <h1 className="my-4 mx-9 font-poppins-bold text-3xl md:text-6xl text-jungleGreen-800 dark:text-dark-primaryTextColor">
          My Reports
        </h1>
      </div>
      <div className="flex flex-col">
        <Tabs aria-label="Options" size="lg">
          <Tab key="individual" title="Reports">
            <Card>
              <CardBody>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-default-400 text-small">
                    Total {reports.length} reports saved
                  </span>
                  <label className="flex items-center text-default-400 text-small">
                    Results per page:
                    <select
                      value={resultsPerPage}
                      className="bg-transparent outline-none text-default-400 text-small"
                      onChange={handleReportsPerPageChange}
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
                      {reports.length > 0 && (
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
                    <TableColumn
                      key="delete"
                      className="text-center hidden sm:table-cell"
                    >
                      DELETE
                    </TableColumn>
                  </TableHeader>

                  <TableBody emptyContent={'You have no saved reports'}>
                    {splitReports.map((item, index) => (
                        <TableRow key={item.id}>
                          <TableCell>
                            <Link href={`/results?url=${encodeURIComponent(item.reportName)}`}>
                              {item.reportName}
                            </Link>
                          </TableCell>
                          <TableCell className="text-center hidden sm:table-cell">
                            {item.savedAt}
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
                          <TableCell className="text-center hidden sm:table-cell">
                            <Button
                              className="font-poppins-semibold text-xl bg-transparent text-primaryTextColor dark:text-dark-primaryTextColor"
                              data-testid={'btnDelete' + index}
                              onClick={() => handleDelete(item.id as number)}
                            >
                              <FiTrash2 />
                            </Button>
                          </TableCell>
                        </TableRow>
                      )
                    )}
                  </TableBody>
                </WEETable>
              </CardBody>
            </Card>  
          </Tab>
          <Tab key="summary" title="Summaries">
            <Card>
              <CardBody>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-default-400 text-small">
                    Total {summaryReports.length} saved summary reports
                  </span>
                  <label className="flex items-center text-default-400 text-small">
                    Results per page:
                    <select
                      value={summaryResultsPerPage}
                      className="bg-transparent outline-none text-default-400 text-small"
                      onChange={handleSummaryReportsPerPageChange}
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
                      {summaryReports.length > 0 && (
                        <div className="flex w-full justify-center">
                          <WEEPagination
                            loop
                            showControls
                            color="stone"
                            page={summaryPage}
                            total={summaryPages}
                            onChange={(page) => setSummaryPage(page)}
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
                    <TableColumn
                      key="delete"
                      className="text-center hidden sm:table-cell"
                    >
                      DELETE
                    </TableColumn>

                  </TableHeader>

                  <TableBody emptyContent={'You have no saved summary reports'}>
                  {splitSummaryReports.map((item, index) => (
                        <TableRow key={item.id}>
                          <TableCell>
                            <Link href={`/results?url=${encodeURIComponent(item.reportName)}`}>
                              {item.reportName}
                            </Link>
                          </TableCell>
                          <TableCell className="text-center hidden sm:table-cell">
                            {item.savedAt}
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
                          <TableCell className="text-center hidden sm:table-cell">
                            <Button
                              className="font-poppins-semibold text-xl bg-transparent text-primaryTextColor dark:text-dark-primaryTextColor"
                              data-testid={'btnDelete' + index}
                              onClick={() => handleDelete(item.id as number)}
                            >
                              <FiTrash2 />
                            </Button>
                          </TableCell>
                        </TableRow>
                      )
                    )}
                  </TableBody>
                </WEETable>
              </CardBody>
            </Card>  
          </Tab>
        </Tabs>
      </div>  
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

'use client';
import {Tabs, Tab, Card, CardBody} from "@nextui-org/react";
import React, { Suspense, useEffect, useState } from 'react';
import WEEPagination from '../../components/Util/Pagination';
import {
  TableHeader, TableColumn, TableBody, TableRow, TableCell,
  Button,
  Link,
  Modal, ModalContent, ModalBody, useDisclosure, ModalFooter,
} from '@nextui-org/react';
import { FiTrash2 } from "react-icons/fi";
import { useRouter } from 'next/navigation';
import WEETable from '../../components/Util/Table';
import { getReports } from '../../services/SaveReportService';
import { useUserContext } from '../../context/UserContext';
import { deleteReport } from "../../services/SaveReportService";
import WEETabs from "../../components/Util/Tabs";


function ResultsComponent() {
  const { user, results, setResults, summaries, setSummaries } = useUserContext();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  
  const handleResultPage = (reportID: number) => {
    router.push(`/savedresults?id=${reportID}`);
  };

  const handleSummaryPage = (reportID: number) => {
    router.push(`/savedsummaries?id=${reportID}`);
  }

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
      setResults(formattedReports);
      setSummaries(formattedSummaryReports);
      setLoading(false);
    } catch (error) {
      setError((error as Error).message || 'An error occurred');
      console.error('Error fetching reports:', error);
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchReports();
  }, []);

  // Report pagination
  const [page, setPage] = React.useState(1);
  const [resultsPerPage, setResultsPerPage] = React.useState(5);
  const pages = Math.ceil(results.length / resultsPerPage);

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
    return results.slice(start, end);
  }, [page, resultsPerPage, results]);

  // Summary report pagination
  const [summaryPage, setSummaryPage] = React.useState(1);
  const [summaryResultsPerPage, setSummaryResultsPerPage] = React.useState(5);
  const summaryPages = Math.ceil(summaries.length / summaryResultsPerPage);

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
    return summaries.slice(start, end);
  }, [summaryPage, summaryResultsPerPage, summaries]);


  // Delete report
  const {isOpen, onOpenChange} = useDisclosure();
  const [idToDelete, setIdToDelete] = useState<number>(0);

  const handleDelete = async (reportId: number) => {
    try {
      await deleteReport(reportId);
    } catch (error) {
      console.error('Error deleting report:', error);
    } finally
    {
      await fetchReports();
    }
  };

  return (
    <>
      <div className="p-4 min-h-screen">
        <div className="text-center">
          <h1 className="my-4 mx-9 font-poppins-bold text-3xl md:text-6xl text-jungleGreen-800 dark:text-dark-primaryTextColor">
            My Reports
          </h1>
        </div>
        <div className="flex flex-col">
          <WEETabs aria-label="Options" size="lg">
            <Tab data-testid="tab-reports" key="individual" title="Reports">
              <Card>
                <CardBody>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-default-400 text-small">
                      Total {results.length} reports saved
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

                  <WEETable data-testid="table-reports" 
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
                              <Link onClick={() => handleResultPage(item.id as number)} style={{ textDecoration: 'none', color: 'inherit' }}>
                                {item.reportName}
                              </Link>
                            </TableCell>
                            <TableCell className="text-center hidden sm:table-cell">
                              {item.savedAt}
                            </TableCell>
                            <TableCell className="text-center hidden sm:table-cell">
                              <Button
                                className="font-poppins-semibold bg-jungleGreen-700 text-dark-primaryTextColor dark:bg-jungleGreen-400 dark:text-primaryTextColor"
                                onClick={() => handleResultPage(item.id as number)}
                                data-testid={'btnView' + index}
                              >
                                View
                              </Button>
                            </TableCell>
                            <TableCell className="text-center hidden sm:table-cell">
                              <Button
                                className="font-poppins-semibold text-xl bg-transparent text-primaryTextColor dark:text-dark-primaryTextColor"
                                data-testid={'btnDelete' + index}
                                onClick={() => {setIdToDelete(item.id as number); onOpenChange()}}
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
            <Tab data-testid="tab-summaries" key="summary" title="Summaries">
              <Card>
                <CardBody>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-default-400 text-small">
                      Total {summaries.length} saved summary reports
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

                  <WEETable data-testid="table-summaries"
                    aria-label="Scrape result table"
                    bottomContent={
                      <>
                        {summaries.length > 0 && (
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
                              <Link onClick={() => handleSummaryPage(item.id as number)} style={{ textDecoration: 'none', color: 'inherit' }}>
                                {item.reportName}
                              </Link>
                            </TableCell>
                            <TableCell className="text-center hidden sm:table-cell">
                              {item.savedAt}
                            </TableCell>
                            <TableCell className="text-center hidden sm:table-cell">
                              <Button
                                className="font-poppins-semibold bg-jungleGreen-700 text-dark-primaryTextColor dark:bg-jungleGreen-400 dark:text-primaryTextColor"
                                onClick={() => handleSummaryPage(item.id as number)}
                                data-testid={'btnView' + index}
                              >
                                View
                              </Button>
                            </TableCell>
                            <TableCell className="text-center hidden sm:table-cell">
                              <Button
                                className="font-poppins-semibold text-xl bg-transparent text-primaryTextColor dark:text-dark-primaryTextColor"
                                data-testid={'btnDelete' + index}
                                onClick={() => {setIdToDelete(item.id as number); onOpenChange() }}
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
          </WEETabs>
        </div>  
      </div>

      {/* Confirm delete */}
      <Modal 
        isOpen={isOpen} 
        onOpenChange={onOpenChange}
        placement="top-center"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalBody>
                <h1 className="text-center my-4 font-poppins-bold text-lg text-jungleGreen-800 dark:text-dark-primaryTextColor">
                    Are you sure you want to delete this report?
                </h1>
              </ModalBody>
              <ModalFooter>
                <Button className="text-md font-poppins-semibold bg-jungleGreen-700 text-dark-primaryTextColor dark:bg-jungleGreen-400 dark:text-primaryTextColor" 
                  onPress={() => {handleDelete(idToDelete); onClose();}}
                >
                  Yes
                </Button>
                <Button 
                  className="text-md font-poppins-semibold bg-jungleGreen-700 text-dark-primaryTextColor dark:bg-jungleGreen-400 dark:text-primaryTextColor" 
                  onPress={onClose}
                  >
                  Cancel
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

export default function SavedReports() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResultsComponent />
    </Suspense>
  );
}

/* eslint-disable @typescript-eslint/no-empty-function */
import { render, screen, fireEvent } from '@testing-library/react';
import SummaryReport from '../../src/app/(pages)/summaryreport/page';
import { useRouter } from 'next/navigation'; // Use 'next/router' instead of 'next/navigation'
import { useScrapingContext } from '../../src/app/context/ScrapingContext';
import jsPDF from 'jspdf'; 
import '@testing-library/jest-dom';
// Mock useRouter and useScrapingContext
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));
jest.mock('../../src/app/context/ScrapingContext', () => ({
  useScrapingContext: jest.fn(),
}));

class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

global.ResizeObserver = ResizeObserver;
jest.mock('jspdf', () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(() => ({
    text: jest.fn(),
    addPage: jest.fn(),
    save: jest.fn(),
    internal: {
      pageSize: { width: 200, height: 300 }, // Adjust dimensions as needed
    },
  })),
}));
jest.mock('html2canvas', () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(() => ({
    toDataURL: jest.fn().mockResolvedValue('data:image/png;base64,MockImage'),
  })),
}));
// Mocking apexcharts default export
jest.mock('apexcharts', () => {
  return {
    __esModule: true, // This property makes it work with the default import
    default: jest.fn(() => ({
      render: jest.fn(),
      updateSeries: jest.fn(),
      destroy: jest.fn(),
      updateOptions: jest.fn(),
    })),
  };
});

describe('SummaryReport Page', () => {
  const mockPush = jest.fn();
  
  beforeEach(() => {
    (useRouter as jest.Mock)?.mockReturnValue({ push: mockPush });
    (useScrapingContext as jest.Mock).mockReturnValue({ summaryReport: mockSummaryReport });
  });

  const mockSummaryReport = {

    domainStatus: [200, 404],
    domainErrorStatus: 1,
    industryClassification: {
      unclassifiedUrls: ['https://www.example.com'],
      industryPercentages: {
        industries: ['E-commerce', 'Unknown'],
        percentages: [75, 25],
      },
      weakClassification: [
        {
          url: 'https://www.example3.com',
          metadataClass: 'E-commerce',
          score: 21,
        },
      ],
    },
    domainMatch: {
      percentageMatch: 75,
      mismatchedUrls: [
        {
          url: 'https://www.example.com',
          metadataClass: 'Automotive',
          domainClass: 'Unknown',
        },
      ],
    },
    totalUrls: 3,
    parkedUrls: ['https://www.example2.com'],
    scrapableUrls: 2,
    avgTime: 100,
  };
  it('renders the summary report page correctly', async () => {
    render(<SummaryReport />);
    expect(screen.getByText('Summary Report')).toBeDefined();
    expect(screen.getByText('General stats')).toBeDefined();
  });

  it('navigates back to scrape results on button click', () => {
    render(<SummaryReport />);
    fireEvent.click(screen.getByText('Back'));
    expect(mockPush).toHaveBeenCalledWith('/scraperesults');
  });

  it('displays general stats correctly', () => {
    render(<SummaryReport />);
    expect(screen.getByText('3 Urls')).toBeDefined();
    expect(screen.getByText('Scraped')).toBeDefined();
    expect(screen.getByText('2 Urls')).toBeDefined(); // Scrapable URLs
    expect(screen.getByText('100 sec')).toBeDefined(); // Average Time
  });
  it('should call jsPDF and download the PDF when download button is clicked', async () => {
      render(<SummaryReport />);
      const dropdownButton = screen.getByRole('button', { name: /export\/save/i });
      expect(dropdownButton).toBeInTheDocument();

      //Click the dropdown button to open the menu
      fireEvent.click(dropdownButton);
  
      // Wait for the download button to appear
      const downloadButton = await screen.findByTestId('download-report-button');
      expect(downloadButton).toBeInTheDocument();

    });
});
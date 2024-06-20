/* eslint-disable @typescript-eslint/no-empty-function */
import { render, screen, fireEvent } from '@testing-library/react';
import SummaryReport from '../../src/app/(pages)/summaryreport/page';
import { useRouter } from 'next/navigation'; // Use 'next/router' instead of 'next/navigation'
import { useScrapingContext } from '../../src/app/context/ScrapingContext';
import { after, before } from 'node:test';

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

// Mocking apexcharts default export
// Mocking apexcharts default export
jest.mock('apexcharts', () => {
  const actualApexCharts = jest.requireActual('apexcharts');
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
    expect(screen.getByText('Scraping Dashboard/Summary')).toBeDefined();
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
});

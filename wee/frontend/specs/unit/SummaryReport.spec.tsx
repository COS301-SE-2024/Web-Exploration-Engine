/* eslint-disable @typescript-eslint/no-empty-function */
import { render, screen, fireEvent } from '@testing-library/react';
import SummaryReport from '../../src/app/(pages)/summaryreport/page';
import { useRouter } from 'next/navigation'; // Use 'next/router' instead of 'next/navigation'
import { useScrapingContext } from '../../src/app/context/ScrapingContext';
import { useUserContext } from 'frontend/src/app/context/UserContext';

// Mock useRouter and useScrapingContext
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));
jest.mock('../../src/app/context/ScrapingContext', () => ({
  useScrapingContext: jest.fn(),
}));
jest.mock('frontend/src/app/context/UserContext', () => ({
  useUserContext: jest.fn(),
}));

class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

global.ResizeObserver = ResizeObserver;

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
  const mockBack = jest.fn();
  
  beforeEach(() => {
    (useRouter as jest.Mock)?.mockReturnValue({ push: mockPush, back: mockBack});
    (useScrapingContext as jest.Mock).mockReturnValue({ summaryReport: mockSummaryReport });
    (useUserContext as jest.Mock).mockReturnValue({ user: mockUser });
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

  const mockUser = {
    uuid: '48787157-7555-4104-bafc-e2c95bbaa959',
    emailVerified: true,
  };
  
  it('renders the summary report page correctly', async () => {
    render(<SummaryReport />);
    expect(screen.getByText('Summary Report')).toBeDefined();
    expect(screen.getByText('General stats')).toBeDefined();
  });

  it('navigates back to scrape results on button click', () => {
    render(<SummaryReport />);
    fireEvent.click(screen.getByText('Back'));
    expect(mockBack).toHaveBeenCalled();
  });

  it('displays general stats correctly', () => {
    render(<SummaryReport />);
    expect(screen.getByText('3 Urls')).toBeDefined();
    expect(screen.getByText('Scraped')).toBeDefined();
    expect(screen.getByText('2 Urls')).toBeDefined(); // Scrapable URLs
    expect(screen.getByText('100 sec')).toBeDefined(); // Average Time
  });
});

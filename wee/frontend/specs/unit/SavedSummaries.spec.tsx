/* eslint-disable @typescript-eslint/no-empty-function */
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SummaryComponent from '../../src/app/(pages)/savedsummaries/page';
import { useRouter, useSearchParams } from 'next/navigation';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import '@testing-library/jest-dom';
import { useUserContext } from '../../src/app/context/UserContext';

// Mock useRouter and useScrapingContext
jest.mock('next/navigation', () => ({
  useSearchParams: jest.fn(),
  useRouter: jest.fn(),
}));

jest.mock('../../src/app/context/UserContext', () => ({
  useUserContext: jest.fn(),
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
    addImage: jest.fn(),
    save: jest.fn(),
    setFontSize: jest.fn(),
    splitTextToSize: jest.fn(),
    setTextColor: jest.fn(),
    setDrawColor: jest.fn(),
    setFillColor: jest.fn(),
    getStringUnitWidth: jest.fn(),
    rect: jest.fn(),
    line: jest.fn(),
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
jest.mock('apexcharts', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    render: jest.fn(),
    updateSeries: jest.fn(),
    destroy: jest.fn(),
    updateOptions: jest.fn(),
  })),
}));


describe('Saved summaries', () => {
  const mockPush = jest.fn();
  const mockBack = jest.fn();

  const mockSummaries = [
    {
      id: 1,
      userId: '48787157-7555-4104-bafc-e2c95bbaa959',
      reportName: 'Test Report',
      reportData: {
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
      },
      isSummary: true,
      savedAt: '2021-01-01',
    },
  ] 

  const mockUser = {
    uuid: '48787157-7555-4104-bafc-e2c95bbaa959',
    emailVerified: true,
  };

  beforeEach(() => {
    (useSearchParams as jest.Mock).mockReturnValue(new URLSearchParams(`id=1`));   
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush, back: mockBack});
    (useUserContext as jest.Mock).mockReturnValue({ user: mockUser, summaries: mockSummaries });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  
  it('renders the summary report page correctly', async () => {
    render(<SummaryComponent />);
    expect(screen.getByText('Test Report')).toBeInTheDocument();
  });

  it('navigates back to scrape results on button click', () => {
    render(<SummaryComponent />);
    fireEvent.click(screen.getByText('Back'));
    expect(mockBack).toHaveBeenCalled();
  });

  it('displays general stats correctly', () => {
    render(<SummaryComponent />);
    expect(screen.getByText('3 Urls')).toBeInTheDocument();
    expect(screen.getByText('Scraped')).toBeInTheDocument();
    expect(screen.getByText('2 Urls')).toBeInTheDocument(); // Scrapable URLs
    expect(screen.getByText('100 sec')).toBeInTheDocument(); // Average Time
  });
});

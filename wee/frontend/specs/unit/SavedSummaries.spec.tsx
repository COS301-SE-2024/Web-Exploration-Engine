/* eslint-disable @typescript-eslint/no-empty-function */
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SavedSummaries from '../../src/app/(pages)/savedsummaries/page';
import { useRouter } from 'next/navigation';
import { useScrapingContext } from '../../src/app/context/ScrapingContext';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import '@testing-library/jest-dom';
import { useUserContext } from '../../src/app/context/UserContext';
import { saveReport } from '../../src/app/services/SaveReportService';

// Mock useRouter and useScrapingContext
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));
jest.mock('../../src/app/context/ScrapingContext', () => ({
  useScrapingContext: jest.fn(),
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

jest.mock('../../src/app/services/SaveReportService', () => ({
  saveReport: jest.fn(),
}));

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
    render(<SavedSummaries />);
    expect(screen.getByText('Summary Report')).toBeInTheDocument();
    expect(screen.getByText('General stats')).toBeInTheDocument();
  });

  it('navigates back to scrape results on button click', () => {
    render(<SavedSummaries />);
    fireEvent.click(screen.getByText('Back'));
    expect(mockBack).toHaveBeenCalled();
  });

  it('displays general stats correctly', () => {
    render(<SavedSummaries />);
    expect(screen.getByText('3 Urls')).toBeInTheDocument();
    expect(screen.getByText('Scraped')).toBeInTheDocument();
    expect(screen.getByText('2 Urls')).toBeInTheDocument(); // Scrapable URLs
    expect(screen.getByText('100 sec')).toBeInTheDocument(); // Average Time
  });

  it('should call jsPDF and download the PDF when download button is clicked', async () => {
    render(<SavedSummaries />);
    const dropdownButton = screen.getByRole('button', { name: /export/i });
    expect(dropdownButton).toBeInTheDocument();

    // Click the dropdown button to open the menu
    fireEvent.click(dropdownButton);

    // Wait for the download button to appear
    const downloadButton = await screen.findByTestId('download-report-button');
    expect(downloadButton).toBeInTheDocument();

    // Create mock chart elements
    const pieChart = document.createElement('div');
    pieChart.id = 'pie-chart';
    document.body.appendChild(pieChart);

    const barChart = document.createElement('div');
    barChart.id = 'bar-chart';
    document.body.appendChild(barChart);

    const radialChart = document.createElement('div');
    radialChart.id = 'radial-chart';
    document.body.appendChild(radialChart);

    // Simulate click on download button
    fireEvent.click(downloadButton);

    await waitFor(() => {
      expect(jsPDF).toHaveBeenCalled();
      expect(html2canvas).toHaveBeenCalledTimes(3);
    });

    // Cleanup mock elements
    document.body.removeChild(pieChart);
    document.body.removeChild(barChart);
    document.body.removeChild(radialChart);
  });
});

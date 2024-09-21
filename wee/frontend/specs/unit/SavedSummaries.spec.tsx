/* eslint-disable @typescript-eslint/no-empty-function */
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SummaryReport from '../../src/app/(pages)/savedsummaries/page';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import '@testing-library/jest-dom';
import { useUserContext } from '../../src/app/context/UserContext';
import { Summary } from '../../src/models/ScraperModels';

// mocks
import { mockSummaries } from '../../src/mocks/reportMocks';


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

jest.mock('../../src/app/services/SaveReportService', () => ({
  saveReport: jest.fn(),
}));


const setSummaryDate = jest.fn();
const setSummaryName = jest.fn();
const setDomainStatus = jest.fn();
const setDomainErrorStatus = jest.fn();
const setUnclassifiedUrls = jest.fn();
const setIndustries = jest.fn();
const setIndustryPercentages = jest.fn();
const setWeakClassification = jest.fn();
const setPercentageMatch = jest.fn();
const setMismatchedUrls = jest.fn();
const setTotalUrls = jest.fn();
const setParkedUrls = jest.fn();
const setscrapableUrls = jest.fn();
const setAvgTime = jest.fn();
const setMetaRadar = jest.fn();
const setDomainRadar = jest.fn();
const setEmotionsArea = jest.fn();

describe('SummaryReport Page', () => {
  const mockPush = jest.fn();
  const mockBack = jest.fn();
  const mockID = mockSummaries[0].id;
  
  beforeEach(() => {
    (useRouter as jest.Mock)?.mockReturnValue({ push: mockPush, back: mockBack});
    (useUserContext as jest.Mock).mockReturnValue({ 
      summaries: mockSummaries,
      setSummaries: jest.fn(),
    });
    (useSearchParams as jest.Mock).mockReturnValue(new URLSearchParams(`id=${mockID}`));
  });

  
  it('renders the summary report page correctly', async () => {
    render(<SummaryReport />);
    expect(screen.getByTestId('summary-title').textContent).toBe('Test Summary');

  });


  it('navigates back to scrape results on button click', () => {
    render(<SummaryReport />);
    fireEvent.click(screen.getByText('Back'));
    expect(mockBack).toHaveBeenCalled();
  });
 

  describe('Download Report', () => {
    it('should call jsPDF and download the PDF when download button is clicked', async () => {
      render(<SummaryReport />);
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
  
      const radarChart = document.createElement('div');
      radialChart.id = 'radar-chart';
      document.body.appendChild(radarChart);
  
      const areaChart = document.createElement('div');
      radialChart.id = 'area-chart';
      document.body.appendChild(areaChart);
  
      fireEvent.click(downloadButton);
  
      await waitFor(() => {
        expect(jsPDF).toHaveBeenCalled();
        expect(html2canvas).toHaveBeenCalledTimes(5);
      });
  
      // Cleanup mock elements
      document.body.removeChild(pieChart);
      document.body.removeChild(barChart);
      document.body.removeChild(radialChart);
    });
  });

    

  it('displays general stats correctly', () => {
    render(<SummaryReport />);
    expect(screen.getByText('3 Urls')).toBeInTheDocument();
    expect(screen.getByText('Scraped')).toBeInTheDocument();
    expect(screen.getByText('2 Urls')).toBeInTheDocument(); // Scrapable URLs
    expect(screen.getByText('100 sec')).toBeInTheDocument(); // Average Time
  });

  it("display radar graphs on bigger screens", () => {
    render(<SummaryReport />);

    expect(screen.queryByTestId('metaRadar')).toBeInTheDocument();
    expect(screen.queryByTestId('domainRadar')).toBeInTheDocument();
  });

  it("don't display radar graphs on mobile phone", () => {
    global.innerWidth = 150;
    global.dispatchEvent(new Event('resize'));

    render(<SummaryReport />);

    expect(screen.getByText('Sorry, the metadata radar graph is not available on mobile devices')).toBeInTheDocument();
    expect(screen.getByText('Sorry, the domain radar graph is not available on mobile devices')).toBeInTheDocument();

    const metaRadar = screen.queryByTestId('metaRadar');
    const domainRadar = screen.queryByTestId('domainRadar');

    expect(metaRadar).toBeInTheDocument();
    expect(domainRadar).toBeInTheDocument();

    expect(metaRadar).toHaveClass('hidden');
    expect(domainRadar).toHaveClass('hidden');
  });
});

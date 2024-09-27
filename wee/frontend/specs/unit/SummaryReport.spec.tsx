/* eslint-disable @typescript-eslint/no-empty-function */
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SummaryReport from '../../src/app/(pages)/summaryreport/page';
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
    domainRadar: {
      categories: [
        "Finance and Banking",
        "Marine and Shipping",
        "Logistics and Supply Chain Management",
        "Entertainment and Media",
        "Arts and Culture"
      ],
      series: [
        {
            name: "https://www.nedbank.co.za",
            data: [
                68.24797987937927,
                15.913596749305725,
                14.516602456569672,
                0,
                0
            ],
            group: "apexcharts-axis-0"
        },
        {
            name: "https://www.readerswarehouse.co.za",
            data: [
                0,
                0,
                16.29459708929062,
                23.511777818202972,
                16.00102037191391
            ],
            group: "apexcharts-axis-0"
        }
      ]
    },
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
    metaRadar: {
      categories: [
        "Finance and Banking",
        "Utilities",
        "Marine Resources",
        "Hospitality",
        "Marine and Shipping",
        "Telecommunications"
      ],
      series: [
        {
            name: "https://www.nedbank.co.za",
            data: [
                68.75752806663513,
                18.95316243171692,
                18.465912342071533,
                0,
                0,
                0
            ],
            group: "apexcharts-axis-0"
        },
        {
            name: "https://www.readerswarehouse.co.za",
            data: [
                0,
                0,
                0,
                16.464106738567352,
                15.834927558898926,
                15.723402798175812
            ],
            group: "apexcharts-axis-0"
        }
      ]
    },
    topNPS : {
      urls: [
        "http://example2.com",
        "http://example1.com",
        "http://example4.com",
      ],
      scores: [-57, -58, -77]
    },
    topTrustIndex : {
      urls: [
        "http://example2.com",
        "http://example1.com",
        "http://example4.com",
      ],
      scores: [2.8, 2.7, 2.2]
    },
    topRating : {
      urls: [
        "http://example1.com",
        "http://example2.com",
        "http://example4.com",
      ],
      scores: [1.83, 1.65, 1.56]
    },
    averageStarRating: [827.75, 85, 98, 1757, 6846.25],
    socialMetrics: {
      urls: ["http://example1.com", "http://example2.com", "http://example3.com", "http://example4.com"],
      facebookShareCount: [7037, 6631, 15790, 3032],
      facebookCommentCount: [180,714,589,841],
      facebookReactionCount: [12103, 1905,17311,10190],
    },
    newsSentiment: {
      urls: ["http://example1.com", "http://example2.com", "http://example3.com", "http://example4.com"],
      positive: [31,31,3,3],
      neutral: [68,68,51,51],
      negative: [0,0,46,46]
    }
  };

  const mockUser = {
    uuid: '48787157-7555-4104-bafc-e2c95bbaa959',
    emailVerified: true,
  };
  
  it('renders the summary report page correctly', async () => {
    render(<SummaryReport />);
    expect(screen.getByText('Summary Report')).toBeInTheDocument();
    expect(screen.getByText('General Statistics')).toBeInTheDocument();
    expect(screen.getByText('Domain match')).toBeInTheDocument();
    expect(screen.getByText('Industry Classification Distribution')).toBeInTheDocument();
    expect(screen.getByText('Website status')).toBeInTheDocument();
  });

  it('navigates back to scrape results on button click', () => {
    render(<SummaryReport />);
    fireEvent.click(screen.getByText('Back'));
    expect(mockBack).toHaveBeenCalled();
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

  it('determine whether social media engagement graph and info are displayed', () => {
    render(<SummaryReport />);
    expect(screen.queryByTestId('socialMetricsGraph')).toBeInTheDocument();
  });

  it('determine that the 4 review related graphs are present', () => {
    render(<SummaryReport />);
    expect(screen.queryByTestId('nps-scores-graph')).toBeInTheDocument();
    expect(screen.queryByTestId('trustindex-scores-graph')).toBeInTheDocument();
    expect(screen.queryByTestId('rating-scores-graph')).toBeInTheDocument();
    expect(screen.queryByTestId('star-ratings-review-graph')).toBeInTheDocument();
  })

  it('determine that news sentiment graph is present', () => {
    render(<SummaryReport />);
    expect(screen.queryByTestId('stacked-column-chart-news-sentiment')).toBeInTheDocument();
  });

  it('should call jsPDF and download the PDF when download button is clicked', async () => {
    render(<SummaryReport />);
    const dropdownButton = screen.getByRole('button', { name: /export\/save/i });
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
      expect(html2canvas).toHaveBeenCalledTimes(8);
    });

    // Cleanup mock elements
    document.body.removeChild(pieChart);
    document.body.removeChild(barChart);
    document.body.removeChild(radialChart);
  });

  it('should display a popup when the save button is clicked', async () => {
    render(<SummaryReport />);
  
    // Ensure the component has rendered and the dropdown button is available
    const dropdownButton = screen.getByRole('button', { name: /export\/save/i });
    expect(dropdownButton).toBeInTheDocument();
  
    // Click the dropdown button to open the menu
    fireEvent.click(dropdownButton);
  
    // Wait for the save button to appear
    const saveButton = await screen.findByTestId('save-report-button');
    expect(saveButton).toBeInTheDocument();
  
    // Click the save button
    fireEvent.click(saveButton);
  
    // wait for popup to appear
    const modal = await screen.findByTestId('save-report-modal');
    expect(modal).toBeInTheDocument();
  });

  it('should enter an error state when no report name is provided', async () => {
    render(<SummaryReport />);
  
    // Ensure the component has rendered and the dropdown button is available
    const dropdownButton = screen.getByRole('button', { name: /export\/save/i });
    expect(dropdownButton).toBeInTheDocument();
  
    // Click the dropdown button to open the menu
    fireEvent.click(dropdownButton);
  
    // Wait for the save button to appear
    const saveButton = await screen.findByTestId('save-report-button');
    expect(saveButton).toBeInTheDocument();
  
    // Click the save button
    fireEvent.click(saveButton);
  
    // wait for popup to appear
    const modal = await screen.findByTestId('save-report-modal');
    expect(modal).toBeInTheDocument();
  
    // Click the save button in the modal
    const saveModalButton = screen.getByRole('button', { name: /Save/i });
    expect(saveModalButton).toBeInTheDocument();
    fireEvent.click(saveModalButton);
  
    await waitFor(() => {
      expect(saveReport).not.toHaveBeenCalled();
    });

    // Ensure the error state is displayed in the Input component
    const inputWithError = screen.getByLabelText('Report Name', { invalid: true, disabled: true });
    expect(inputWithError).toBeInTheDocument();
  });

  it('should enter an error state if name is entered then removed', async () => {
    render(<SummaryReport />);

    // Ensure the component has rendered and the dropdown button is available
    const dropdownButton = screen.getByRole('button', { name: /export\/save/i });
    expect(dropdownButton).toBeInTheDocument();

    // Click the dropdown button to open the menu
    fireEvent.click(dropdownButton);

    // Wait for the save button to appear
    const saveButton = await screen.findByTestId('save-report-button');
    expect(saveButton).toBeInTheDocument();

    // Click the save button
    fireEvent.click(saveButton);

    // wait for popup to appear
    const modal = await screen.findByTestId('save-report-modal');
    expect(modal).toBeInTheDocument();

    // Enter a report name
    const reportNameInput = screen.getByLabelText(/Report Name/i);
    expect(reportNameInput).toBeInTheDocument();
    fireEvent.change(reportNameInput, { target: { value: 'Test Report' } });

    // Clear the report name
    fireEvent.change(reportNameInput, { target: { value: '' } });

    const inputWithError = screen.getByLabelText('Report Name', { invalid: true });
    expect(inputWithError).toBeInTheDocument();
  });

  it('should call the saveReport function when the save button is clicked', async () => {
      render(<SummaryReport />);
    
      // Ensure the component has rendered and the dropdown button is available
      const dropdownButton = screen.getByRole('button', { name: /export\/save/i });
      expect(dropdownButton).toBeInTheDocument();
    
      // Click the dropdown button to open the menu
      fireEvent.click(dropdownButton);
    
      // Wait for the save button to appear
      const saveButton = await screen.findByTestId('save-report-button');
      expect(saveButton).toBeInTheDocument();
    
      // Click the save button
      fireEvent.click(saveButton);
    
      // wait for popup to appear
      const modal = await screen.findByTestId('save-report-modal');
      expect(modal).toBeInTheDocument();

      // Enter a report name
      const reportNameInput = screen.getByLabelText(/Report Name/i);
      expect(reportNameInput).toBeInTheDocument();
      fireEvent.change(reportNameInput, { target: { value: 'Test Report' } });
    
      // Click the save button in the modal
      const saveModalButton = screen.getByRole('button', { name: /Save/i });
      expect(saveModalButton).toBeInTheDocument();
      fireEvent.click(saveModalButton);
    
      await waitFor(() => {
        expect(saveReport).toHaveBeenCalled();
      });
  });

  it('should display a success message when the report is saved successfully', async () => {
    render(<SummaryReport />);
  
    // Ensure the component has rendered and the dropdown button is available
    const dropdownButton = screen.getByRole('button', { name: /export\/save/i });
    expect(dropdownButton).toBeInTheDocument();
  
    // Click the dropdown button to open the menu
    fireEvent.click(dropdownButton);
  
    // Wait for the save button to appear
    const saveButton = await screen.findByTestId('save-report-button');
    expect(saveButton).toBeInTheDocument();
  
    // Click the save button
    fireEvent.click(saveButton);
  
    // wait for popup to appear
    const modal = await screen.findByTestId('save-report-modal');
    expect(modal).toBeInTheDocument();

    // Enter a report name
    const reportNameInput = screen.getByLabelText(/Report Name/i);
    expect(reportNameInput).toBeInTheDocument();
    fireEvent.change(reportNameInput, { target: { value: 'Test Report' } });
  
    // Click the save button in the modal
    const saveModalButton = screen.getByRole('button', { name: /Save/i });
    expect(saveModalButton).toBeInTheDocument();
    fireEvent.click(saveModalButton);
  
    await waitFor(() => {
      expect(screen.getByText('Report saved successfully')).toBeDefined();
    });
  });
});

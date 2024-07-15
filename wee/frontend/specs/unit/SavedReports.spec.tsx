import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SavedReports from '../../src/app/(pages)/savedreports/page';
import { useUserContext } from '../../src/app/context/UserContext';
import { getReports, deleteReport } from '../../src/app/services/SaveReportService';
import { useRouter } from 'next/navigation';
import '@testing-library/jest-dom';


jest.mock('../../src/app/services/SaveReportService');
jest.mock('../../src/app/context/UserContext');
jest.mock('next/navigation', () => ({
  useSearchParams: jest.fn(),
  useRouter: jest.fn(),
}));

describe('SavedReports Page', () => {
  const mockReports = [
    {
      id: 0,
      userId: '1ad80d59-e8b1-426c-8254-4cb96abc4857',
      reportName: 'Test Report',
      reportData: { 
        url: 'https://example.com',
        domainStatus: "live",
        robots: {
          baseUrl: 'https://example.com',
          allowedPaths: [],
          disallowedPaths: [],
          isUrlScrapable: true,
          isBaseUrlAllowed: true,
        },
        metadata: {
          title: 'Example',
          description: 'Example description',
          keywords: 'example, keywords',
          ogTitle: 'Example',
          ogDescription: 'Example description',
          ogImage: 'https://example.com/image.jpg',
        },
        industryClassification: {
          metadataClass: {
            label: 'Example',
            score: 0.5,
          },
          domainClass: {
            label: 'Example',
            score: 0.5,
          },
        },
        logo: 'https://example.com/logo.jpg',
        images: ['https://example.com/image.jpg'],
        slogan: 'Example slogan',
        time: 0,
      },
      isSummary: false,
      savedAt: '2021-01-01',
    },
  ];

  beforeEach(() => {
    (useUserContext as jest.Mock).mockReturnValue({
      user: { uuid: "1ad80d59-e8b1-426c-8254-4cb96abc4857", emailVerified: true },
      results: mockReports, // Mocked reports should be set here
      setResults: jest.fn(),
      summaries: [], // Mocked summaries can be set if needed
      setSummaries: jest.fn(),
    });
    
    (useRouter as jest.Mock).mockReturnValue({
      push: jest.fn(),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('fetches reports on mount', async () => {
    (getReports as jest.Mock).mockResolvedValue(mockReports);
    const { getByText } = render(<SavedReports />);
    await waitFor(() => expect(getReports).toHaveBeenCalledTimes(1));

    expect(getByText('Test Report')).toBeDefined();
  });

  it('handles pagination correctly', async () => {
    // Render the SavedReports component with mocked reports and pagination controls
    const { getByText, getByLabelText } = render(<SavedReports />);

    // Mock getReports to resolve with mockReports
    (getReports as jest.Mock).mockResolvedValue(mockReports);

    // Ensure initial page is loaded correctly
    await waitFor(() => expect(getReports).toHaveBeenCalledTimes(1));
    expect(getByText('Test Report')).toBeDefined();

    // Change page and verify the change
    fireEvent.change(getByLabelText('Number of results per page'), { target: { value: '2' } });
    await waitFor(() => expect(getByText('Test Report')).toBeDefined());
  });
  
  it('deletes a report correctly', async () => {
    // Mock deleteReport to resolve successfully
    (deleteReport as jest.Mock).mockResolvedValueOnce();

    // Render the SavedReports component with mocked reports
    const { getByText, getByTestId } = render(<SavedReports />);
    await waitFor(() => expect(getReports).toHaveBeenCalledTimes(1));

    // Click delete button
    fireEvent.click(getByTestId('btnDelete0'));

    // Confirm delete and check if deleteReport is called with correct ID
    fireEvent.click(getByText('Yes'));
    await waitFor(() => expect(deleteReport).toHaveBeenCalledWith(mockReports[0].id));

    // Ensure fetchReports is called after deletion
    expect(getReports).toHaveBeenCalledTimes(2); // Check the correct number of calls
  });
});
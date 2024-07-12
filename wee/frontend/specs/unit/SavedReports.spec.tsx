import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SavedReports from '../../src/app/(pages)/savedreports/page';
import { useUserContext } from '../../src/app/context/UserContext';
import { getReports, deleteReport } from '../../src/app/services/SaveReportService';
import { useRouter } from 'next/navigation';

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
});
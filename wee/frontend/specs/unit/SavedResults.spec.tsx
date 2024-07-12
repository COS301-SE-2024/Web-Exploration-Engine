import React from 'react';
import { render, screen, act, waitFor, fireEvent } from '@testing-library/react';
import SavedResults from '../../src/app/(pages)/savedresults/page'; 
import { useRouter, useSearchParams } from 'next/navigation';
import { useUserContext } from '../../src/app/context/UserContext';
import '@testing-library/jest-dom';

// Mock the useSearchParams hook
jest.mock('next/navigation', () => ({
    useSearchParams: jest.fn(),
    useRouter: jest.fn(),
}));

jest.mock('jspdf', () => ({
    __esModule: true,
    default: jest.fn().mockImplementation(() => ({
      setFontSize: jest.fn(),
      text: jest.fn(),
      rect: jest.fn(),
      setFillColor: jest.fn(),
      setTextColor: jest.fn(),
      setDrawColor: jest.fn(),
      line: jest.fn(),
      addPage: jest.fn(),
      save: jest.fn(),
      getStringUnitWidth: jest.fn().mockReturnValue(50),
      internal: {
        scaleFactor: 1.5,
        pageSize: { width: 180, height: 297 },
      },
    })),
}));
  
jest.mock('../../src/app/context/ScrapingContext', () => ({
    useScrapingContext: jest.fn(),
}));

jest.mock('../../src/app/context/UserContext', () => ({
    useUserContext: jest.fn(),
}));

jest.mock('../../src/app/services/SaveReportService', () => ({
    saveReport: jest.fn(),
}));

describe('Saved Results', () => {
    const mockUrl = 'https://www.example.com';
    const mockPush = jest.fn();
    const mockBack = jest.fn();

    const mockResults = [
      {
        id: 1,
        reportName: 'Test Report',
        reportData: {
            url: mockUrl,
            robots: { isUrlScrapable: true },
            metadata: {
                title: 'Example Title',
                description: 'Example Description',
                keywords: 'example, keywords',
                ogTitle: 'Example OG Title',
                ogDescription: 'Example OG Description',
                ogImage: 'https://www.example.com/ogimage.png',
            },
            domainStatus: 'live',
            logo: 'https://www.example.com/logo.png',
            images: ['https://www.example.com/image1.png', 'https://www.example.com/image2.png'],
            industryClassification: {
                metadataClass: { label: 'E-commerce', score: 95 },
                domainClass: { label: 'Retail', score: 90 },
            },
        },
        isSummary: false,
        savedAt: '2021-01-01',
      },
    ];

    const mockUser = {
        uuid: '48787157-7555-4104-bafc-e2c95bbaa959',
        emailVerified: true,
    };

    beforeEach(() => {
        (useSearchParams as jest.Mock).mockReturnValue(new URLSearchParams(`id=1`));   
        (useRouter as jest.Mock).mockReturnValue({ push: mockPush, back: mockBack});   
        (useUserContext as jest.Mock).mockReturnValue({ user: mockUser, results: mockResults });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should display website status, crawlable status, industry classification, and domain classification', async () => {
        await act(async () => {
            render(<SavedResults />);
        });

        await waitFor(() => {
            expect(screen.queryByText('Yes')).toBeDefined();
            expect(screen.queryByText('Live')).toBeDefined();
            expect(screen.queryByText('E-commerce - 95')).toBeDefined();
            expect(screen.queryByText('Retail - 90')).toBeDefined();
        });
    });

    it('should display no logo available when logo is not present', async () => {
      const updatedMockResults = mockResults.map((item) => ({
        ...item,
        reportData: {
          ...item.reportData,
          logo: '', // Set images to an empty array
        },
      }));
      (useUserContext as jest.Mock).mockReturnValueOnce({user: mockUser, results: updatedMockResults});

      await act(async () => {
          render(<SavedResults />);
      });

      await waitFor(() => {
          expect(screen.getByText('No logo available.')).toBeDefined();
      });
  });

    it('should display no images available when images are not present', async () => {
      const updatedMockResults = mockResults.map((item) => ({
        ...item,
        reportData: {
          ...item.reportData,
          images: [], // Set images to an empty array
        },
      }));
      (useUserContext as jest.Mock).mockReturnValueOnce({user: mockUser, results: updatedMockResults});

        await act(async () => {
            render(<SavedResults />);
        });

        await waitFor(() => {
            expect(screen.getByText('No images available.')).toBeDefined();
        });
    });

    it('should navigate back to scrape results when Back button is clicked', async () => {
        await act(async () => {
            render(<SavedResults />);
        });

        await waitFor(() => {
            expect(screen.getByRole('button', { name: /Back/i })).toBeDefined();
        });

        const backButton = screen.getByRole('button', { name: /Back/i });
        fireEvent.click(backButton);

        expect(mockBack).toHaveBeenCalled();
    });

    it('should set crawlable status to No when an error response is returned', async () => {
      const updatedMockResults = mockResults.map((item) => ({
        ...item,
        reportData: {
          ...item.reportData,
          robots: { errorStatus: 404, errorCode: 'Not Found', errorMessage: 'Page not found'},
        },
      }));
        (useUserContext as jest.Mock).mockReturnValueOnce({user: mockUser, results: updatedMockResults});

        await act(async () => {
            render(<SavedResults />);
        });

        await waitFor(() => {
            expect(screen.queryByText('No')).toBeDefined();
        });
    });
    
    it('should display correct summary information', async () => {
        await act(async () => {
            render(<SavedResults />);
        });

        await waitFor(() => {
            expect(screen.queryByText('Example Title')).toBeDefined();
            expect(screen.queryByText('Example Description')).toBeDefined();
        });
    });

    it('should display a fallback message when summary information is not available', async () => {
        const updatedMockResults = mockResults.map((item) => ({
            ...item,
            reportData: {
                ...item.reportData,
                metadata: {
                    title: '',
                    description: '',
                    ogTitle: '',
                    ogDescription: '',
                },
            },
        }));
        (useUserContext as jest.Mock).mockReturnValueOnce({user: mockUser, results: updatedMockResults});

        await act(async () => {
            render(<SavedResults />);
        });

        await waitFor(() => {
            expect(screen.getByText('No summary information available.')).toBeDefined();
        });
    });

    it('should display images correctly when images are present', async () => {
        await act(async () => {
            render(<SavedResults />);
        });

        await waitFor(() => {
            expect(screen.getAllByAltText('Image').length).toBe(mockResults[0].reportData.images.length);
        });
    });
});
 
import React from 'react';
import { render, screen, act, fireEvent, waitFor } from '@testing-library/react';
import ScrapeResults from '../../src/app/(pages)/scraperesults/page'; // Adjust the import according to your file structure
import '@testing-library/jest-dom';
import { useRouter } from 'next/navigation';
import userEvent from '@testing-library/user-event';
import { pollForResult } from '../../src/app/services/PubSubService';
import { isScrapedResult } from '../../src/Utils/scrapingUtils';

jest.mock('next/navigation', () => ({
    useRouter: jest.fn(),
}));

// Mock fetch globally
global.fetch = jest.fn().mockResolvedValue({
    json: () => Promise.resolve({}), // Mock the json() method to return a Promise
    headers: { 'Content-Type': 'application/json' }, // Example headers
    ok: true, // Example ok status
    status: 200, // Example status code
});

jest.mock('../../src/app/services/PubSubService', () => ({
    pollForResult: jest.fn()
}));

jest.mock('frontend/src/app/context/ScrapingContext', () => ({
    useScrapingContext: () => ({
        urls: ['https://www.example.com', 'https://www.example2.com', 'https://www.example3.com', 'https://www.example5.com', 'https://www/example6.com'],
        setUrls: jest.fn(),
        results: [
            {
                url: "https://www.example.com'",
                domainStatus: 'parked',
                robots: {
                    "errorStatus": 500,
                    "errorCode": "500 Internal Server Error",
                    "errorMessage": "An error occurred while interpreting robots.txt file"
                }
            },
            {
                url: 'https://www.example2.com',
                domainStatus: 'live',
                robots: {
                    isUrlScrapable: true,
                },
            },
        ],
        errorResults: [
            {
                errorStatus: 500,
                errorCode: '500 Internal Server Error',
                errorMessage: `Failed to scrape url`,
                url: 'https://www.example5.com'
            }
        ],
        undefinedResults: [
            { url: 'https://www/example6.com' }
        ],
        processedUrls: ['https://www.example.com', 'https://www.example2.com', 'https://www.example5.com', 'https://www/example6.com'],
        setProcessedUrls: jest.fn(),
        processingUrls: [],
        setProcessingUrls: jest.fn(),
        setResults: jest.fn(),
        setErrorResults: jest.fn(),
        setUndefinedResults: jest.fn(),
        setSummaryReport: jest.fn(),
    }),
}));

describe("isScrapedResult type guard", () => {
    // Example ScraperResult object
    const validScraperResult = {
        url: "https://example.com",
        domainStatus: "active",
        robots: {},
        metadata: {},
        industryClassification: "technology",
        logo: "https://example.com/logo.png",
        images: [],
        slogan: "Example Slogan",
        contactInfo: { email: "contact@example.com" },
        time: "2023-09-27",
        addresses: [],
        screenshot: "data:image/png;base64,...",
        seoAnalysis: {},
        sentiment: {},
        scrapeNews: [],
        reviews: [],
        shareCountdata: {}
    };

    // Example ErrorResponse object
    const errorResponse = {
        error: "Some error message"
    };

    // Example UndefinedResponse object
    const undefinedResponse = {
        undefinedField: undefined
    };

    it("should return true for a valid ScraperResult", () => {
        const result = isScrapedResult(validScraperResult);
        expect(result).toBe(true);
    });

    it("should return false for an ErrorResponse", () => {
        const result = isScrapedResult(errorResponse);
        expect(result).toBe(false);
    });

    it("should return false for an UndefinedResponse", () => {
        const result = isScrapedResult(undefinedResponse);
        expect(result).toBe(false);
    });

    it("should return false if a required field is missing", () => {
        const incompleteScraperResult = { ...validScraperResult };
        delete incompleteScraperResult.url; // Missing required field

        const result = isScrapedResult(incompleteScraperResult);
        expect(result).toBe(false);
    });
});

describe('Scrape Results Component', () => {
    const mockPush = jest.fn();
    const mockResponse = {
        json: jest.fn().mockResolvedValue(true),
    };

    beforeEach(() => {
        jest.clearAllMocks();
        (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should display 4 results', async () => {
        await act(async () => {
            render(<ScrapeResults />);
        });

        expect(screen.getByText('Total 4 results')).toBeDefined();
    });

    it('should filter items based on searchValue - test 1', () => {
        render(<ScrapeResults />);

        expect(screen.getByText(/https:\/\/www\.example\.com'/)).toBeDefined();
        expect(screen.getByText('https://www.example2.com')).toBeDefined();
        expect(screen.getByText('https://www.example5.com')).toBeDefined();

        const searchInput = screen.getByPlaceholderText('https://www.takealot.com/');
        fireEvent.change(searchInput, { target: { value: 'example2' } });

        expect(screen.queryByText(/https:\/\/www\.example\.com'/)).toBeNull();
        expect(screen.getByText('https://www.example2.com')).toBeDefined();
        expect(screen.queryByText('https://www.example5.com')).toBeNull();
    });

    it('should not filter items when searchValue is empty', () => {
        render(<ScrapeResults />);

        expect(screen.getByText(/https:\/\/www\.example\.com'/)).toBeDefined();
        expect(screen.getByText('https://www.example2.com')).toBeDefined();
        expect(screen.getByText('https://www.example5.com')).toBeDefined();

        const searchInput = screen.getByPlaceholderText('https://www.takealot.com/');
        fireEvent.change(searchInput, { target: { value: '' } });

        expect(screen.getByText(/https:\/\/www\.example\.com'/)).toBeDefined();
        expect(screen.getByText('https://www.example2.com')).toBeDefined();
        expect(screen.getByText('https://www.example5.com')).toBeDefined();
    });

    it('should not process the URL if it is already processed', async () => {
        render(<ScrapeResults />);

        await waitFor(() => expect(fetch).toHaveBeenCalled());

        expect(fetch).toHaveBeenCalledTimes(1); // Assuming 3 URLs were processed
        expect(fetch).toHaveBeenCalledWith('http://localhost:3002/api/scraper?url=https%3A%2F%2Fwww.example3.com');
    });

    it('count the number of view buttons', () => {
        render(<ScrapeResults />);

        const viewButtons = screen.getAllByRole('button', { name: /View/i });
        expect(viewButtons.length).toBe(2);
    });

    it('Filter Crawlable - No', async () => {
        render(<ScrapeResults />);

        expect(screen.getByText(/https:\/\/www\.example\.com'/)).toBeDefined();
        expect(screen.getByText('https://www.example2.com')).toBeDefined();
        expect(screen.getByText('https://www.example5.com')).toBeDefined();

        const crawlableFilterTrigger = screen.getByTestId('crawlable-filter');
        expect(crawlableFilterTrigger).toBeInTheDocument();

        fireEvent.click(crawlableFilterTrigger);

        await waitFor(() => {
            expect(screen.getByTestId('crawlable-filter-yes')).toBeInTheDocument();
            expect(screen.getByTestId('crawlable-filter-no')).toBeInTheDocument();
        });

        const noCrawlableOption = screen.getByTestId('crawlable-filter-no');
        fireEvent.click(noCrawlableOption);

        await waitFor(() => {
            const rows = screen.getAllByTestId('table-row');
            expect(rows.length).toBeGreaterThan(0);
        });

        await waitFor(() => {
            expect(screen.getByText(/https:\/\/www\.example\.com'/)).toBeDefined();
            expect(screen.queryByText('https://www.example2.com')).toBeNull();
            expect(screen.getByText('https://www.example5.com')).toBeDefined();
        });
    });

    it('Filter Crawlable - Yes', async () => {
        render(<ScrapeResults />);

        expect(screen.getByText(/https:\/\/www\.example\.com'/)).toBeDefined();
        expect(screen.getByText('https://www.example2.com')).toBeDefined();
        expect(screen.getByText('https://www.example5.com')).toBeDefined();

        const crawlableFilterTrigger = screen.getByTestId('crawlable-filter');
        expect(crawlableFilterTrigger).toBeInTheDocument();

        fireEvent.click(crawlableFilterTrigger);

        await waitFor(() => {
            expect(screen.getByTestId('crawlable-filter-yes')).toBeInTheDocument();
            expect(screen.getByTestId('crawlable-filter-no')).toBeInTheDocument();
        });

        const yesCrawlableOption = screen.getByTestId('crawlable-filter-yes');
        fireEvent.click(yesCrawlableOption);

        await waitFor(() => {
            const rows = screen.getAllByTestId('table-row');
            expect(rows.length).toBeGreaterThan(0);
        });

        await waitFor(() => {
            expect(screen.queryByText(/https:\/\/www\.example\.com'/)).toBeNull();
            expect(screen.getByText('https://www.example2.com')).toBeDefined();
            expect(screen.queryByText('https://www.example5.com')).toBeNull();
        });
    });

    it('Filter Status - Parked', async () => {
        render(<ScrapeResults />);

        expect(screen.getByText(/https:\/\/www\.example\.com'/)).toBeDefined();
        expect(screen.getByText('https://www.example2.com')).toBeDefined();
        expect(screen.getByText('https://www.example5.com')).toBeDefined();

        const statusFilterTrigger = screen.getByTestId('status-filter');
        expect(statusFilterTrigger).toBeInTheDocument();

        fireEvent.click(statusFilterTrigger);

        await waitFor(() => {
            expect(screen.getByTestId('status-filter-parked')).toBeInTheDocument();
            expect(screen.getByTestId('status-filter-live')).toBeInTheDocument();
        });

        const parkedStatusOption = screen.getByTestId('status-filter-parked');
        fireEvent.click(parkedStatusOption);

        await waitFor(() => {
            const rows = screen.getAllByTestId('table-row');
            expect(rows.length).toBeGreaterThan(0);
        });

        await waitFor(() => {
            expect(screen.getByText(/https:\/\/www\.example\.com'/)).toBeDefined();
            expect(screen.queryByText('https://www.example2.com')).toBeNull();
            expect(screen.queryByText('https://www.example5.com')).toBeNull();
        });
    });

    it('Filter Status - Live', async () => {
        render(<ScrapeResults />);

        expect(screen.getByText(/https:\/\/www\.example\.com'/)).toBeDefined();
        expect(screen.getByText('https://www.example2.com')).toBeDefined();
        expect(screen.getByText('https://www.example5.com')).toBeDefined();

        const statusFilterTrigger = screen.getByTestId('status-filter');
        expect(statusFilterTrigger).toBeInTheDocument();

        fireEvent.click(statusFilterTrigger);

        await waitFor(() => {
            expect(screen.getByTestId('status-filter-parked')).toBeInTheDocument();
            expect(screen.getByTestId('status-filter-live')).toBeInTheDocument();
        });

        const parkedStatusOption = screen.getByTestId('status-filter-live');
        fireEvent.click(parkedStatusOption);

        await waitFor(() => {
            const rows = screen.getAllByTestId('table-row');
            expect(rows.length).toBeGreaterThan(0);
        });

        await waitFor(() => {
            expect(screen.queryByText(/https:\/\/www\.example\.com'/)).toBeNull();
            expect(screen.getByText('https://www.example2.com')).toBeDefined();
            expect(screen.queryByText('https://www.example5.com')).toBeNull();
        });
    });

    it('pollForResult function - ErrorResult', async () => {
        const mockErrorResult = {
            errorStatus: 500,
            errorCode: '500 Internal Server Error',
            errorMessage: `Failed to scrape url`,
            url: 'https://www.example6.com'
        };

        (pollForResult as jest.Mock).mockResolvedValueOnce(mockErrorResult);
        render(<ScrapeResults />);

        await waitFor(() => {
            expect(pollForResult).toHaveBeenCalled();
        });
    });

    it('pollForResult function - Result', async () => {
        const mockResult = {
            url: 'https://www.example7.com',
            domainStatus: 'live',
            robots: {
                isUrlScrapable: true,
            },
        };

        (pollForResult as jest.Mock).mockResolvedValueOnce(mockResult);
        render(<ScrapeResults />);

        await waitFor(() => {
            expect(pollForResult).toHaveBeenCalled();
        });
    });

});
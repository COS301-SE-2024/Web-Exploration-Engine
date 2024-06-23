import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import ScrapeResults from '../../src/app/(pages)/scraperesults/page'; // Adjust the import according to your file structure

import { useRouter } from 'next/navigation';

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
  

jest.mock('frontend/src/app/context/ScrapingContext', () => ({
    useScrapingContext: () => ({
        urls: ['https://www.example.com', 'https://www.example2.com', 'https://www.example3.com'],
        setUrls: jest.fn(),
        results: [        
            {
                url: 'https://www.example.com',
                robots: { isUrlScrapable: false },
            },
            {
                url: 'https://www.example2.com',
                robots: { isUrlScrapable: true },
            },
        ],
        processedUrls: ['https://www.example.com', 'https://www.example2.com'],
        setProcessedUrls: jest.fn(),
        processingUrls: [],
        setProcessingUrls: jest.fn(), 
        setResults: jest.fn(),
        setSummaryReport: jest.fn(),
    }),
}));

describe('Scrape Results Component', () => {
    const mockPush = jest.fn();
    const mockResponse = {
        json: jest.fn().mockResolvedValue(true),
    };

    beforeEach(() => {
        jest.clearAllMocks();
        (useRouter as jest.Mock).mockReturnValue({ push: mockPush }); 
    });

    it('should display 2 results', async () => {
        await act(async () => {
            render(<ScrapeResults />);
        });

        expect(screen.getByText('Total 2 results')).toBeDefined();
    });

    it('should filter items based on searchValue', () => {
        render(<ScrapeResults />);

        expect(screen.getByText('https://www.example.com')).toBeDefined();
        expect(screen.getByText('https://www.example2.com')).toBeDefined();

        const searchInput = screen.getByPlaceholderText('https://www.takealot.com/');
        fireEvent.change(searchInput, { target: { value: 'example2' } });

        expect(screen.queryByText('https://www.example.com')).toBeNull();
        expect(screen.getByText('https://www.example2.com')).toBeDefined();
    });

    it('should not filter items when searchValue is empty', () => {
        render(<ScrapeResults />);

        expect(screen.getByText('https://www.example.com')).toBeDefined();
        expect(screen.getByText('https://www.example2.com')).toBeDefined();

        const searchInput = screen.getByPlaceholderText('https://www.takealot.com/');
        fireEvent.change(searchInput, { target: { value: '' } });

        expect(screen.getByText('https://www.example.com')).toBeDefined();
        expect(screen.getByText('https://www.example2.com')).toBeDefined();
    });

    it('should not process the URL if it is already processed', () => {
        render(<ScrapeResults />);

        expect(fetch).toHaveBeenCalledTimes(1); // Assuming 2 URLs were processed
        expect(fetch).toHaveBeenCalledWith('http://localhost:3000/api/scraper?url=https%3A%2F%2Fwww.example3.com');
    });

    
});
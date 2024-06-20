import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import ScrapeResults from '../../src/app/(pages)/scraperesults/page'; // Adjust the import according to your file structure

import { useRouter } from 'next/navigation';

jest.mock('next/navigation', () => ({
    useRouter: jest.fn(),
}));

jest.mock('frontend/src/app/context/ScrapingContext', () => ({
    useScrapingContext: () => ({
        urls: ['https://www.example.com', 'https://www.example2.com'],
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

    it('should navigate to different pages on pagination change', () => {
        render(<ScrapeResults />);
    
        const mockFilteredItems = Array.from({ length: 15 }, (_, index) => ({
          url: `https://www.example${index + 1}.com`,
          robots: { isUrlScrapable: index % 2 === 0 },
        }));
    
        jest.spyOn(React, 'useMemo').mockImplementation(() => mockFilteredItems);
    });

    it('should not make API calls if the URL is already processed', async () => {
        
        await act(async () => {
            render(<ScrapeResults />);
        });
        
    });
});
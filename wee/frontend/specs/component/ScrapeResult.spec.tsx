import React from 'react';
import { render, screen, act, waitFor, fireEvent } from '@testing-library/react';
import ScrapeResults from 'frontend/src/app/(pages)/scraperesults/page';

import { useRouter } from 'next/navigation';
import { useScrapingContext } from 'frontend/src/app/context/ScrapingContext';

jest.mock('next/navigation', () => ({
    // useSearchParams: jest.fn(),
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
        setResults: jest.fn(),
    }),
}));

describe('Scrape Results Component', () => {
    beforeEach(() => {
        jest.clearAllMocks(); // Clear all mock function calls before each test
    });

    it('should display 2 results', async () => {
        await act(async () => {
            render(<ScrapeResults />);
        });

        expect(screen.getByText('Total 2 results')).toBeDefined();
    });

    it('should filter items based on searchValue', () => {
        render(<ScrapeResults />);

        // Initially, no search filter should return all items
        expect(screen.getByText('https://www.example.com')).toBeDefined();
        expect(screen.getByText('https://www.example2.com')).toBeDefined();

        // Simulate setting a search filter
        const searchInput = screen.getByPlaceholderText('https://www.takealot.com/');
        fireEvent.change(searchInput, { target: { value: 'example2' } });

        // After setting the search filter, only the matching item should be visible
        expect(screen.queryByText('https://www.example.com')).toBeNull();
        expect(screen.getByText('https://www.example2.com')).toBeDefined();
    });

    it('should not filter items when searchValue is empty', () => {
        render(<ScrapeResults />);

        // Initially, no search filter should return all items
        expect(screen.getByText('https://www.example.com')).toBeDefined();
        expect(screen.getByText('https://www.example2.com')).toBeDefined();

        // Simulate clearing the search filter (empty searchValue)
        const searchInput = screen.getByPlaceholderText('https://www.takealot.com/');
        fireEvent.change(searchInput, { target: { value: '' } });

        // After clearing the search filter, all items should be visible again
        expect(screen.getByText('https://www.example.com')).toBeDefined();
        expect(screen.getByText('https://www.example2.com')).toBeDefined();
    });

});
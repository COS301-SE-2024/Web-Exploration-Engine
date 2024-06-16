import React from 'react';
import { render, screen, act, waitFor, fireEvent } from '@testing-library/react';
import Results from '../../src/app/(pages)/results/page'; // Adjust the import according to your file structure
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import {useScrapingContext} from '../../src/app/context/ScrapingContext'

// Mock the useSearchParams hook
jest.mock('next/navigation', () => ({
    useSearchParams: jest.fn(),
    useRouter: jest.fn(),
}));

jest.mock('frontend/src/app/context/ScrapingContext', () => ({
    useScrapingContext: jest.fn(),
}));

describe('Results Component', () => {
    const mockUrl = 'https://www.example.com';
    const mockPush = jest.fn();

    const mockResults = [
        {
            url: mockUrl,
            robots: { isUrlScrapable: true },
            domainStatus: 'live',
            logo: 'https://www.example.com/logo.png',
            images: ['https://www.example.com/image1.png', 'https://www.example.com/image2.png'],
            industryClassification: {
                metadataClass: { label: 'E-commerce', score: 95 },
                domainClass: { label: 'Retail', score: 90 },
            },
        },
    ];

    beforeEach(() => {
        (useSearchParams as jest.Mock).mockReturnValue(new URLSearchParams(`url=${mockUrl}`));   
        (useRouter as jest.Mock).mockReturnValue({ push: mockPush });   
        (useScrapingContext as jest.Mock).mockReturnValue({ results: mockResults }); 
    });

    it('should display website status, crawlable status, industry classification, and domain classification', async () => {
        await act(async () => {
            render(<Results />);
        });

        await waitFor(() => {
            expect(screen.queryByText('Yes')).toBeDefined();
            expect(screen.queryByText('Live')).toBeDefined();
            expect(screen.queryByText('E-commerce - 95')).toBeDefined();
            expect(screen.queryByText('Retail - 90')).toBeDefined();
        });
    });

    it('should display no logo available when logo is not present', async () => {
        (useScrapingContext as jest.Mock).mockReturnValueOnce({
            results: [
                {
                    ...mockResults[0],
                    logo: '',
                },
            ],
        });

        await act(async () => {
            render(<Results />);
        });

        await waitFor(() => {
            expect(screen.getByText('No logo available.')).toBeDefined();
        });
    });

    it('should display no images available when images are not present', async () => {
        (useScrapingContext as jest.Mock).mockReturnValueOnce({
            results: [
                {
                    ...mockResults[0],
                    images: [],
                },
            ],
        });

        await act(async () => {
            render(<Results />);
        });

        await waitFor(() => {
            expect(screen.getByText('No images available.')).toBeDefined();
        });
    });

    it('should navigate back to scrape results when Back button is clicked', async () => {
        await act(async () => {
            render(<Results />);
        });

        await waitFor(() => {
            expect(screen.getByRole('button', { name: /Back/i })).toBeDefined();
        });

        const backButton = screen.getByRole('button', { name: /Back/i });
        fireEvent.click(backButton);

        expect(mockPush).toHaveBeenCalledWith('/scraperesults');
    });
});

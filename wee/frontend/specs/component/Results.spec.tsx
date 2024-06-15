import React from 'react';
import { render, screen, act, waitFor } from '@testing-library/react';
import Results from '../../src/app/(pages)/results/page'; // Adjust the import according to your file structure
import { useSearchParams } from 'next/navigation';
import { ScrapingProvider } from 'frontend/src/app/provider/ScrapingProvider';
import { useRouter } from 'next/navigation';

// Mock the useSearchParams hook
jest.mock('next/navigation', () => ({
    useSearchParams: jest.fn(),
    useRouter: jest.fn(),
}));

describe('Results Component', () => {
    const mockUrl = 'https://www.example.com';

    beforeEach(() => {
        (useSearchParams as jest.Mock).mockReturnValue(new URLSearchParams(`url=${mockUrl}`));   
        (useRouter as jest.Mock).mockReturnValue({ push: jest.fn() });    
    });

    it('should display website status, crawlable status, and industry classification', async () => {
        await act(async () => {
            render(
                <ScrapingProvider>
                    <Results />
                </ScrapingProvider>
            );
        });

        screen.debug();

        await waitFor(() => {
            expect(screen.queryByText('Yes')).toBeDefined();
            expect(screen.queryByText('Live')).toBeDefined();
            expect(screen.queryByText('E-commerce')).toBeDefined();
        });
    });
});

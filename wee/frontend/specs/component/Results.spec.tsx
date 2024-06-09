import React from 'react';
import { render, screen, act } from '@testing-library/react';
import Results from '../../src/app/(pages)/results/page'; // Adjust the import according to your file structure
import { useSearchParams } from 'next/navigation';

// Mock the useSearchParams hook
jest.mock('next/navigation', () => ({
    useSearchParams: jest.fn(),
}));

describe('Results Component', () => {
    const mockUrl = 'https://www.example.com';
    const mockWebsiteStatus = 'true';
    const mockIsCrawlable = 'true';
    const mockIndustry = 'E-commerce';

    beforeEach(() => {
        (useSearchParams as jest.Mock).mockReturnValue(new URLSearchParams(`url=${mockUrl}&websiteStatus=${mockWebsiteStatus}&isCrawlable=${mockIsCrawlable}&industry=${mockIndustry}`));       
    });

    it('should display website status, crawlable status, and industry classification', async () => {
        await act(async () => {
            render(<Results />);
        });

        expect(screen.getByText('Yes')).toBeDefined();
        expect(screen.getByText('Live')).toBeDefined();
        expect(screen.getByText('E-commerce')).toBeDefined();
    });
});

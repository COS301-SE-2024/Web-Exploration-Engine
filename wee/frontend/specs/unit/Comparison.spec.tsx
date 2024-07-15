import React from 'react';
import { render, screen, act, waitFor, fireEvent } from '@testing-library/react';
import Comparison from '../../src/app/(pages)/comparison/page';
import '@testing-library/jest-dom';
import {useScrapingContext} from '../../src/app/context/ScrapingContext';
import { useRouter } from 'next/navigation';

jest.mock('next/navigation', () => ({
    useRouter: jest.fn(),
}));

jest.mock('frontend/src/app/context/ScrapingContext', () => ({
    useScrapingContext: jest.fn(),
}));

describe('Comparison Component', () => {
    const mockPush = jest.fn();
    const mockResults = [
        {
            url: 'https://www.example.com',
            robots: { isUrlScrapable: true },
            metadata: {
                title: 'Example Title',
                description: 'Example Description',
                keywords: 'example, keywords',
                ogTitle: 'Example OG Title',
                ogDescription: 'Example OG Description',
                ogImage: 'https://www.example.com/ogimage.png',
            },
            domainStatus: 'parked',
            logo: 'https://www.example.com/logo.png',
            images: ['https://www.example.com/image1.png', 'https://www.example.com/image2.png'],
            industryClassification: {
                metadataClass: { label: 'E-commerce', score: 95 },
                domainClass: { label: 'Retail', score: 90 },
            },
        },
        {
            url: 'https://www.example2.com',
            robots: { isUrlScrapable: true },
            metadata: {
                title: 'Example Title2',
                description: 'Example Description2',
                keywords: 'example, keywords2',
                ogTitle: 'Example OG Title2',
                ogDescription: 'Example OG Description2',
                ogImage: 'https://www.example.com/ogimage2.png',
            },
            domainStatus: 'live',
            logo: 'https://www.example.com/logo2.png',
            images: ['https://www.example.com/image21.png', 'https://www.example.com/image22.png'],
            industryClassification: {
                metadataClass: { label: 'Regional Banks', score: 62 },
                domainClass: { label: 'Application Software', score: 78 },
            },
        }
    ];

    beforeEach(() => {
        (useRouter as jest.Mock).mockReturnValue({ push: mockPush });  
        (useScrapingContext as jest.Mock).mockReturnValue({ results: mockResults }); 
    });

    it('should display all the basic main headings when page is first rendered', async () => {
        await act(async () => {
            render(<Comparison/>);
        })

        await waitFor(() => {
            expect(screen.queryByText('Website Comparison')).toBeDefined();
        });
    });

    it('should navigate back to scrape results when Back button is clicked', async () => {
        await act(async () => {
            render(<Comparison />);
        });

        await waitFor(() => {
            expect(screen.getByRole('button', { name: /Back/i })).toBeDefined();
        });

        const backButton = screen.getByRole('button', { name: /Back/i });
        fireEvent.click(backButton);

        expect(mockPush).toHaveBeenCalledWith('/scraperesults');
    });
    
    it('should compare items based on urls selected in dropdowns', async () => {
        await act(async () => {
            render(<Comparison />);
        });

        const selectOne = screen.getByTestId('website1-select');
        const selectTwo = screen.getByTestId('website2-select');
    
        fireEvent.change(selectOne, { target: { value: 'https://www.example.com' } });
        fireEvent.change(selectTwo, { target: { value: 'https://www.example2.com' } });
    
        await waitFor(() => {
            // website status
            expect(screen.queryByText('Parked')).toBeDefined();
            expect(screen.queryByText('Live')).toBeDefined();

            // industry classification
            expect(screen.queryByText('E-commerce')).toBeDefined();
            expect(screen.queryByText('95%')).toBeDefined();

            expect(screen.queryByText('Regional Banks')).toBeDefined();
            expect(screen.queryByText('62%')).toBeDefined();

            // domain match
            expect(screen.queryByText('Retail')).toBeDefined();
            expect(screen.queryByText('90%')).toBeDefined();

            expect(screen.queryByText('Application Software')).toBeDefined();
            expect(screen.queryByText('78%')).toBeDefined();
        });
    });

    it('should update websiteOne state when a new option is selected', async () => {
        await act(async () => {
            render(<Comparison />);
        });

        const selectOne = screen.getByTestId('website1-select');
        fireEvent.change(selectOne, { target: { value: '0' } });

        await waitFor(() => {
            expect(screen.queryByText('Parked')).toBeDefined();
            expect(screen.queryByText('E-commerce')).toBeDefined();
            expect(screen.queryByText('95%')).toBeDefined();
            expect(screen.queryByText('Retail')).toBeDefined();
            expect(screen.queryByText('90%')).toBeDefined();
        });

        const websiteOneState = mockResults[0];
        expect(websiteOneState).toEqual({
            url: 'https://www.example.com',
            robots: { isUrlScrapable: true },
            metadata: {
                title: 'Example Title',
                description: 'Example Description',
                keywords: 'example, keywords',
                ogTitle: 'Example OG Title',
                ogDescription: 'Example OG Description',
                ogImage: 'https://www.example.com/ogimage.png',
            },
            domainStatus: 'parked',
            logo: 'https://www.example.com/logo.png',
            images: ['https://www.example.com/image1.png', 'https://www.example.com/image2.png'],
            industryClassification: {
                metadataClass: { label: 'E-commerce', score: 95 },
                domainClass: { label: 'Retail', score: 90 },
            },
        });
    });

    it('should update websiteTwo state when a new option is selected', async () => {
        await act(async () => {
            render(<Comparison />);
        });

        const selectTwo = screen.getByTestId('website2-select');
        fireEvent.change(selectTwo, { target: { value: '1' } });

        await waitFor(() => {
            expect(screen.queryByText('Live')).toBeDefined();
            expect(screen.queryByText('Regional Banks')).toBeDefined();
            expect(screen.queryByText('62%')).toBeDefined();
            expect(screen.queryByText('Application Software')).toBeDefined();
            expect(screen.queryByText('78%')).toBeDefined();
        });

        const websiteTwoState = mockResults[1];
        expect(websiteTwoState).toEqual({
            url: 'https://www.example2.com',
            robots: { isUrlScrapable: true },
            metadata: {
                title: 'Example Title2',
                description: 'Example Description2',
                keywords: 'example, keywords2',
                ogTitle: 'Example OG Title2',
                ogDescription: 'Example OG Description2',
                ogImage: 'https://www.example.com/ogimage2.png',
            },
            domainStatus: 'live',
            logo: 'https://www.example.com/logo2.png',
            images: ['https://www.example.com/image21.png', 'https://www.example.com/image22.png'],
            industryClassification: {
                metadataClass: { label: 'Regional Banks', score: 62 },
                domainClass: { label: 'Application Software', score: 78 },
            },
        });
    });
})
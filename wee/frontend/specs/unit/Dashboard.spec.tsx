import React from 'react';
import { render, screen, act, waitFor, fireEvent } from '@testing-library/react';
import Dashboard from '../../src/app/(pages)/dashboard/page';
import { useScheduledScrapeContext } from '../../src/app/context/ScheduledScrapingContext';
import { useRouter, useSearchParams } from 'next/navigation';
import '@testing-library/jest-dom';

jest.mock('next/navigation', () => ({
    useSearchParams: jest.fn(),
    useRouter: jest.fn(),
}));

// if this isn't included a resize observer problem is thrown
jest.mock('react-apexcharts', () => () => null);

jest.mock('../../src/app/context/ScheduledScrapingContext', () => ({
    useScheduledScrapeContext: jest.fn(),
}));

describe('Dashboard page - no data', () => {
    const mockPush = jest.fn();
    const mockSetScheduledScrape = jest.fn();
  
    beforeEach(() => {
    (useSearchParams as jest.Mock).mockReturnValue(new URLSearchParams(`id=5000`));
      (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
      (useScheduledScrapeContext as jest.Mock).mockReturnValue({
        scheduledScrapeResponse: [
            {
                id: '5000',
                keyword_results: [],
                result_history: {
                    NPS: [],
                    accessibilityScore: [],
                    bestPracticesScore: [],
                    commentCount: [],
                    newsSentiment: {
                        neutralAvg: [],
                        negativeAvg: [],
                        positiveAvg: [],
                    },
                    numReviews: [],
                    performanceScore: [],
                    pinCount: [],
                    rating: [],
                    reactionCount: [],
                    recommendationStatus: [],
                    shareCount: [],
                    siteSpeed: [],
                    starRatings: [],
                    timestampArr: [],
                    totalEngagement: [],
                    trustIndex: []
                },
            },
        ],
        setScheduledScrapeResponse: mockSetScheduledScrape,
      });
    });
  
    afterEach(() => {
      jest.clearAllMocks();
    });

    it('Render the dashboard page successfully', () => {
        render(<Dashboard />);
    });

    it('Summary section is not available', () => {
        render(<Dashboard />);

        const dashboardSummaryEngagement = screen.queryByTestId('dashboard-summary-engagements');
        expect(dashboardSummaryEngagement).toBeNull();

        const dashboardSummarySiteSpeed = screen.queryByTestId('dashboard-summary-sitespeed');
        expect(dashboardSummarySiteSpeed).toBeNull();
    });

    it('SEO Tech Analysis Light House section is not available', () => {
        render(<Dashboard />);

        const dashboardLightHouse = screen.queryByTestId('dashboard-lighthouse-not-available');
        expect(dashboardLightHouse).toBeInTheDocument();
        expect(dashboardLightHouse).toHaveTextContent('There are no Ligth House Technical SEO Analysis currently available');
    });

    it('SEO Tech Analysis Site Speed section is not available', () => {
        render(<Dashboard />);

        const dashboardSiteSpeed = screen.queryByTestId('dashboard-sitespeed-not-available');
        expect(dashboardSiteSpeed).toBeInTheDocument();
        expect(dashboardSiteSpeed).toHaveTextContent('There are no Site Speed Technical SEO Analysis currently available');
    });
})
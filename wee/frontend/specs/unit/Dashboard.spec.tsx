import React from 'react';
import { render, screen, act, waitFor, fireEvent } from '@testing-library/react';
import Dashboard from '../../src/app/(pages)/dashboard/page';
import { useScheduledScrapeContext } from '../../src/app/context/ScheduledScrapingContext';
import { useRouter, useSearchParams } from 'next/navigation';

jest.mock('next/navigation', () => ({
    useSearchParams: jest.fn(),
    useRouter: jest.fn(),
}));

// if this isn't included a resize observer problem is thrown
jest.mock('react-apexcharts', () => () => null);

jest.mock('../../src/app/context/ScheduledScrapingContext', () => ({
    useScheduledScrapeContext: jest.fn(),
}));

describe('Dashboard page', () => {
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
})
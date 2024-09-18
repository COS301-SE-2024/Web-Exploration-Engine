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

    it('SEO Keyword Analysis is not available', () => {
        render(<Dashboard />);

        const dashboardKeyword = screen.queryByTestId('dashboard-keyword-not-available');
        expect(dashboardKeyword).toBeInTheDocument();
        expect(dashboardKeyword).toHaveTextContent('No keywords are being tracked');
    });

    it('News Sentiment is not available', () => {
        render(<Dashboard />);

        const dashboardNews = screen.queryByTestId('dashboard-news-not-available');
        expect(dashboardNews).toBeInTheDocument();
        expect(dashboardNews).toHaveTextContent('There are no News Sentiment currently available');
    });

    it('Engagements is not available', () => {
        render(<Dashboard />);

        const dashboardEngagements = screen.queryByTestId('dashboard-engagements-not-available');
        expect(dashboardEngagements).toBeInTheDocument();
        expect(dashboardEngagements).toHaveTextContent('There are no Total Engagements currently available');
    });

    it('Comment Count is not available', () => {
        render(<Dashboard />);

        const dashboardCommentCount = screen.queryByTestId('dashboard-comment-count-not-available');
        expect(dashboardCommentCount).toBeInTheDocument();
        expect(dashboardCommentCount).toHaveTextContent('There are no Facebook Comment Count currently available');
    });

    it('Share Count is not available', () => {
        render(<Dashboard />);

        const dashboardShareCount = screen.queryByTestId('dashboard-share-count-not-available');
        expect(dashboardShareCount).toBeInTheDocument();
        expect(dashboardShareCount).toHaveTextContent('There are no Facebook Share Count currently available');
    });

    it('Reaction Count is not available', () => {
        render(<Dashboard />);

        const dashboardReactionCount = screen.queryByTestId('dashboard-reaction-count-not-available');
        expect(dashboardReactionCount).toBeInTheDocument();
        expect(dashboardReactionCount).toHaveTextContent('There are no Facebook Reaction Count currently available');
    });

    it('Pin Count is not available', () => {
        render(<Dashboard />);

        const dashboardReactionCount = screen.queryByTestId('dashboard-pin-count-not-available');
        expect(dashboardReactionCount).toBeInTheDocument();
        expect(dashboardReactionCount).toHaveTextContent('There are no Pintrest Pin Count currently available');
    });

    it('Rating is not available', () => {
        render(<Dashboard />);

        const dashboardRating = screen.queryByTestId('dashboard-rating-not-available');
        expect(dashboardRating).toBeInTheDocument();
        expect(dashboardRating).toHaveTextContent('There are no Ratings currently available');
    });

    it('Number of reviews is not available', () => {
        render(<Dashboard />);

        const dashboardReviews = screen.queryByTestId('dashboard-reviews-not-available');
        expect(dashboardReviews).toBeInTheDocument();
        expect(dashboardReviews).toHaveTextContent('There are no Number of Reviews currently available');
    });

    it('Star Ratings is not available', () => {
        render(<Dashboard />);

        const dashboardStarRatings = screen.queryByTestId('dashboard-star-rating-not-available');
        expect(dashboardStarRatings).toBeInTheDocument();
        expect(dashboardStarRatings).toHaveTextContent('There are no rating data currently available');
    });

    it('Star Ratings Heatmap is not available', () => {
        render(<Dashboard />);

        const dashboardStarRatings = screen.queryByTestId('dashboard-star-rating-heatmap-not-available');
        expect(dashboardStarRatings).toBeInTheDocument();
        expect(dashboardStarRatings).toHaveTextContent('The heatmap is not currently available');
    });

    it('Trust Index is not available', () => {
        render(<Dashboard />);

        const dashboardTrustIndex = screen.queryByTestId('dashboard-trust-index-not-available');
        expect(dashboardTrustIndex).toBeInTheDocument();
        expect(dashboardTrustIndex).toHaveTextContent('There are no Trust Index currently available');
    });

    it('NPS is not available', () => {
        render(<Dashboard />);

        const dashboardTrustIndex = screen.queryByTestId('dashboard-nps-not-available');
        expect(dashboardTrustIndex).toBeInTheDocument();
        expect(dashboardTrustIndex).toHaveTextContent('There are no NPS Reviews currently available');
    });
});

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
                        NPS: [12, 12, 12],
                        accessibilityScore: [85, 85, 85],
                        bestPracticesScore: [100, 100, 100],
                        commentCount: [63, 49, 55],
                        newsSentiment: {
                            neutralAvg: [0.6809093508869409, 0.6460568338632584, 0.6207376215606928],
                            negativeAvg: [0.00650408846559003, 0.006996740307658911, 0.0069127309252507985],
                            positiveAvg: [0.3125865735113621, 0.3469464309513569, 0.3723496563732624],
                        },
                        numReviews: [64, 64, 64],
                        performanceScore: [79, 80, 79],
                        pinCount: [0, 0, 0],
                        rating: [2.91, 2.91, 2.91],
                        reactionCount: [356, 339, 336],
                        recommendationStatus: ['Likely', 'Likely', 'Likely'],
                        shareCount: [4255, 4261, 4246],
                        siteSpeed: [4.879087537976563, 5.688592593989111, 4.703195877486319],
                        starRatings: [
                            [
                                {
                                    "stars": 5,
                                    "numReviews": 24
                                },
                                {
                                    "stars": 4,
                                    "numReviews": 5
                                },
                                {
                                    "stars": 3,
                                    "numReviews": 1
                                },
                                {
                                    "stars": 2,
                                    "numReviews": 9
                                },
                                {
                                    "stars": 1,
                                    "numReviews": 25
                                }
                            ],
                            [
                                {
                                    "stars": 5,
                                    "numReviews": 24
                                },
                                {
                                    "stars": 4,
                                    "numReviews": 5
                                },
                                {
                                    "stars": 3,
                                    "numReviews": 1
                                },
                                {
                                    "stars": 2,
                                    "numReviews": 9
                                },
                                {
                                    "stars": 1,
                                    "numReviews": 25
                                }
                            ],
                            [
                                {
                                    "stars": 5,
                                    "numReviews": 24
                                },
                                {
                                    "stars": 4,
                                    "numReviews": 5
                                },
                                {
                                    "stars": 3,
                                    "numReviews": 1
                                },
                                {
                                    "stars": 2,
                                    "numReviews": 9
                                },
                                {
                                    "stars": 1,
                                    "numReviews": 25
                                }
                            ]
                        ],
                        timestampArr: [
                            "2024-09-13T15:14:12.722Z",
                            "2024-09-14T15:16:01.727Z",
                            "2024-09-18T08:41:34.957Z"
                        ],
                        totalEngagement: [4674, 4649, 4637],
                        trustIndex: [3.7, 3.7, 3.7]
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
});
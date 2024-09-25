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

describe('Dashboard page - WITH data', () => {
    const mockPush = jest.fn();
    const mockSetScheduledScrape = jest.fn();

    const mockScheduledScrape = [
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
    ];

    beforeEach(() => {
        (useSearchParams as jest.Mock).mockReturnValue(new URLSearchParams(`id=5000`));
        (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
        (useScheduledScrapeContext as jest.Mock).mockReturnValue({
            scheduledScrapeResponse: mockScheduledScrape,
            setScheduledScrapeResponse: mockSetScheduledScrape,
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('Render the dashboard page successfully', () => {
        render(<Dashboard />);
    });

    it('Summary Section - Star Ratings', () => {
        render(<Dashboard />);

        const dashboardSummaryStarRating = screen.queryByTestId('dashboard-summary-star-ratings');
        expect(dashboardSummaryStarRating).toBeInTheDocument();
        expect(dashboardSummaryStarRating).toHaveTextContent('Average Star Rating2.91');
    });

    it('Summary Section - Recommendation Status - Likely', () => {
        render(<Dashboard />);

        const dashboardSummaryRecommendationStatus = screen.queryByTestId('dashboard-summary-recommendation-status');
        expect(dashboardSummaryRecommendationStatus).toBeInTheDocument();
        expect(dashboardSummaryRecommendationStatus).toHaveTextContent('Recommendation StatusLikely');
    });

    it('Summary Section - Recommendation Status - N/A', () => {
        (useScheduledScrapeContext as jest.Mock).mockReturnValue({
            scheduledScrapeResponse: [
                {
                    id: '5000',
                    keyword_results: [],
                    result_history: {
                        ...mockScheduledScrape[0].result_history,  // Keep other properties unchanged
                        recommendationStatus: ['Likely', 'Likely', ''],  // Overwrite only recommendationStatus
                    },
                },
            ],
            setScheduledScrapeResponse: mockSetScheduledScrape,
        });

        render(<Dashboard />);

        const dashboardSummaryRecommendationStatus = screen.queryByTestId('dashboard-summary-recommendation-status');
        expect(dashboardSummaryRecommendationStatus).toBeInTheDocument();
        expect(dashboardSummaryRecommendationStatus).toHaveTextContent('Recommendation StatusN/A');
    });

    it('Summary Section - Total Engagements', () => {
        render(<Dashboard />);

        const dashboardSummaryEngagements = screen.queryByTestId('dashboard-summary-engagements');
        expect(dashboardSummaryEngagements).toBeInTheDocument();
        expect(dashboardSummaryEngagements).toHaveTextContent('12.00Total Engagement4637');
    });

    it('Summary Section - SiteSpeed', () => {
        render(<Dashboard />);

        const dashboardSummarySiteSpeed = screen.queryByTestId('dashboard-summary-sitespeed');
        expect(dashboardSummarySiteSpeed).toBeInTheDocument();
        expect(dashboardSummarySiteSpeed).toHaveTextContent('0.99Site Speed4.7');
    });
    
    it('SEO Tech Section - Light House Graph Present', () => {
        render(<Dashboard />);

        const dashboardLightHouseGraph = screen.queryByTestId('dashboard-sitespeed-graph');
        expect(dashboardLightHouseGraph).toBeInTheDocument();
    });

    it('SEO Tech Section - Site Speed Graph Present', () => {
        render(<Dashboard />);

        const dashboardSiteSpeedGraph = screen.queryByTestId('dashboard-sitespeed-graph');
        expect(dashboardSiteSpeedGraph).toBeInTheDocument();
    });

    it('News Sentiment Graph Present', () => {
        render(<Dashboard />);

        const dashboardNewsSentimentGraph = screen.queryByTestId('dashboard-newssentiment-graph');
        expect(dashboardNewsSentimentGraph).toBeInTheDocument();
    });

    it('Total Engagement Graph Present', () => {
        render(<Dashboard />);

        const dashboardEngagementGraph = screen.queryByTestId('dashboard-engagement-graph');
        expect(dashboardEngagementGraph).toBeInTheDocument();
    });

    it('Comment Count Graph Present', () => {
        render(<Dashboard />);

        const dashboardCommentCountGraph = screen.queryByTestId('dashboard-comment-count-graph');
        expect(dashboardCommentCountGraph).toBeInTheDocument();
    });

    it('Share Count Graph Present', () => {
        render(<Dashboard />);

        const dashboardShareCountGraph = screen.queryByTestId('dashboard-share-count-graph');
        expect(dashboardShareCountGraph).toBeInTheDocument();
    });

    it('Reaction Count Graph Present', () => {
        render(<Dashboard />);

        const dashboardReactionCountGraph = screen.queryByTestId('dashboard-reaction-count-graph');
        expect(dashboardReactionCountGraph).toBeInTheDocument();
    });

    it('Pin Count Graph Present', () => {
        render(<Dashboard />);

        const dashboardPinCountGraph = screen.queryByTestId('dashboard-pin-count-graph');
        expect(dashboardPinCountGraph).toBeInTheDocument();
    });

    it('Average Star Rating Graph Present', () => {
        render(<Dashboard />);

        const dashboardAvgStarGraph = screen.queryByTestId('dashboard-avg-star-rating-graph');
        expect(dashboardAvgStarGraph).toBeInTheDocument();
    });

    it('Num Reviews Graph Present', () => {
        render(<Dashboard />);

        const dashboardNumReviewsGraph = screen.queryByTestId('dashboard-number-reviews-graph');
        expect(dashboardNumReviewsGraph).toBeInTheDocument();
    });

    it('Rating Distribution Graph Present', () => {
        render(<Dashboard />);

        const dashboardRatingDistrGraph = screen.queryByTestId('dashboard-rating-distribution-graph');
        expect(dashboardRatingDistrGraph).toBeInTheDocument();
    });

    it('Heatmap Graph Present', () => {
        render(<Dashboard />);

        const dashboardHeatMapGraph = screen.queryByTestId('dashboard-heatmap-graph');
        expect(dashboardHeatMapGraph).toBeInTheDocument();
    });

    it('Trust Index Graph Present', () => {
        render(<Dashboard />);

        const dashboardTrustIndexGraph = screen.queryByTestId('trust-index-graph');
        expect(dashboardTrustIndexGraph).toBeInTheDocument();
    });

    it('NPS Graph Present', () => {
        render(<Dashboard />);

        const dashboardNPSGraph = screen.queryByTestId('nps-graph');
        expect(dashboardNPSGraph).toBeInTheDocument();
    });
});
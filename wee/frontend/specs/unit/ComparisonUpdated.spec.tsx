import React from 'react';
import { render, screen, act, waitFor, fireEvent } from '@testing-library/react';
import Comparison from '../../src/app/(pages)/comparison/page';
import { useRouter, useSearchParams } from 'next/navigation';
import { useUserContext } from '../../src/app/context/UserContext';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';

jest.mock('next/navigation', () => ({
    useRouter: jest.fn(),
}));

// if this isn't included a resize observer problem is thrown
jest.mock('react-apexcharts', () => () => null);

global.fetch = jest.fn().mockResolvedValue({
    json: () => Promise.resolve({}), // Mock the json() method to return a Promise
    headers: { 'Content-Type': 'application/json' }, // Example headers
    ok: true, // Example ok status
    status: 200, // Example status code
});

jest.mock('../../src/app/context/ScrapingContext', () => ({
    useScrapingContext: () => ({
        urls: ['https://www.example.com', 'https://www.example2.com', 'https://www.example3.com'],
        setUrls: jest.fn(),
        results: [
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
                    zeroShotDomainClassify: [
                        {
                            "label": "Finance and Banking",
                            "score": 0.6868
                        },
                        {
                            "label": "Marine and Shipping",
                            "score": 0.1616
                        },
                        {
                            "label": "Logistics and Supply Chain Management",
                            "score": 0.1515
                        }
                    ],
                    zeroShotMetaDataClassify: [                    
                        {
                            "label": "Tech",
                            "score": 0.6969
                        },
                        {
                            "label": "Restuarant",
                            "score": 0.1919
                        },
                        {
                            "label": "Marine Resources",
                            "score": 0.1818
                        }                    
                    ]
                },
                seoAnalysis: {
                    imageAnalysis: {
                        errorUrls: [],
                        missingAltTextCount: 11,
                        nonOptimizedCount: 3,
                        reasonsMap: {
                            format: ['https://www.exampleOne.com/coast.png', 'https://www.exampleTwo.com/lion.svg', 'https://www.exampleThree.com/ocean.jpg'],
                            other: [],
                            size: [],
                        },
                        recommendations: '11 images are missing alt text. 3 images are not optimized.',
                        totalImages: 27,
                    },
                    uniqueContentAnalysis: {
                        recommendations: '',
                        textLength: 743,
                        uniqueWordsPercentage: 41.72,
                        repeatedWords: [
                            {
                                word: 'repeatedWordsOne',
                                count: 19,
                            }
                        ]
                    },
                    lighthouseAnalysis: {
                        scores: {
                            accessibility: 85,
                            bestPractices: 93,
                            performance: 24,
                        },
                        diagnostics: undefined,
                    },
                    siteSpeedAnalysis: {
                        loadTime: 2.88,
                        recommendations: '',
                    },
                    mobileFriendlinessAnalysis: {
                        isResponsive: false,
                        recommendations: '',
                    },
                },
                scrapeNews: [
                    {
                        title: "Level up your Heritage Day with Nando’s tips for the perfect braai - CapeTown ETC",
                        link: "https://news.google.com/rss/articles/CBMihAFBVV95cUxOVU9aT3l1aENfUHlOS0w2THl3RlZoOUZTU1RoZEcydU9LU1JaYlBpTDd2ZmQwbG1PMjRVbE5NTUR1RjJVOFVhTFg0bGphVmtYU28xTGhyTXRHQ045N0ZGQ2NmaXdReXVwSmRwcmMxaEJJV2lvSWZ4OEN1Tk4xNGFQMW03cGk?oc=5",
                        source: "CapeTown ETC",
                        pubDate: "Sun, 22 Sep 2024 13:00:56 GMT",
                        sentimentScores: {
                            positive: 0.7899376153945923,
                            negative: 0.0015594614669680595,
                            neutral: 0.2085028886795044
                        }
                    },
                    {
                        title: "Nando's Stick it out ad brings humour to South Africa's daily struggles - Bizcommunity.com",
                        link: "https://news.google.com/rss/articles/CBMitAFBVV95cUxOT2M3dU9fMEEyNFdGNXZmUHVrenBiQjR6Y2o0NVljNnVZcDJTYktzdmtPVnVvRWpLUGRrNHh4OFRQVkN4cmJMZlJCNUxjU0ZNNHZwYXFzOGkzT0Vic09LcG5vQzFmSkZ5V1ZiRDU4RnAzNVJFaFFHclp5VlJZeXVpbGZPekFWYy16bmhMMFROYXpKOHFBdlItcDgtVEx4ZWhrQ2ZneE9vbGlMYkFUcmFHcDhEY2U?oc=5",
                        source: "Bizcommunity.com",
                        pubDate: "Thu, 12 Sep 2024 07:00:00 GMT",
                        sentimentScores: {
                            positive: 0.3234110176563263,
                            negative: 0.005732724908739328,
                            neutral: 0.670856237411499
                        }
                    },
                    {
                        title: "South African restaurant Nando's Peri-Peri prepares for first Austin opening while eyeing expansion - The Business Journals",
                        link: "https://news.google.com/rss/articles/CBMimwFBVV95cUxNXzc2NlFuZDlwY2FZRXc4dFlxN2N1Rkxla2JZT2J4emtBY2pvblVuQzVoc2hKZUcxSDVBYWU3TU9XSUZZTmxqN3N4N0ozd0d4NUZ6QjlOc1Q5UWRJZTRvRTVUSHZNM0E1dGZ4azYtdEp4UERlUlJMTnlST0pkMzFPWmtJdzdWbWFuMnVZVVRfUjJLWnlyODRVV2dMMA?oc=5",
                        source: "The Business Journals",
                        pubDate: "Mon, 23 Sep 2024 12:56:00 GMT",
                        sentimentScores: {
                            positive: 0.09960536658763885,
                            negative: 0.0022338044364005327,
                            neutral: 0.8981608748435974
                        }
                    },
                    {
                        title: "The men behind Nando’s – South Africa’s global peri-peri chicken empire - BusinessTech",
                        link: "https://news.google.com/rss/articles/CBMitwFBVV95cUxOVnlJbkhXalBkei1URzY3R3dkVmdDUTZTSF9NcDVFYWdmV3pyUVlXZF8ySkk3WVJCNGNMR0lwQ0lhNFhvM3lJbl9BSW0zbjViYXpDamhwOW50X2RaU0ZBUlVlQ3EybnpSZ2QwMWMxV2FZN0JEVWtrSmZaN3FPa2pGek9UdjZKOWkxblhLYlNzNUpvU29lX2twSThKdVFuaGRneUk5OTNyMDR3S1NpSUdTcUh1M0JiWEk?oc=5",
                        source: "BusinessTech",
                        pubDate: "Thu, 25 Jul 2024 07:00:00 GMT",
                        sentimentScores: {
                            positive: 0.020457826554775238,
                            negative: 0.010590984486043453,
                            neutral: 0.9689511060714722
                        }
                    },
                    {
                        title: "Nando’s is SA’s official support group — and releases new dish to prove it - TimesLIVE",
                        link: "https://news.google.com/rss/articles/CBMixgFBVV95cUxNaWtIUHliTWREZkUxVlJnMHNOWl94ZGRYTnNKVnhVVWZKQThqRWZmZHUxVDlDZXl5aENJOW16RkF1eGxNZG5LR1VXRXN3N2VBNjQ4WjJFZmY0bTVNRW93NWlFTElINUh2c1pyTDVocjVIVmVWUW56eDhoWEtyLU8yX1AydTd1czM5WVBnZ1QwTFA5ODYyZHZxN1JkS3luXzRleHh4UkhXd2lha1NTcGJUd1lYaWc0N0lRaDlxOWV5Tm9ZY0E3UEHSAcsBQVVfeXFMUEdadVBzZjMwNmhRcUZkOHdBWGVyNzIzX1V0NlhzblVfOXg5cFNGQjhQUlM3a3dBMkZ5WHlfOHI3QUliMEREa05vN0Q0LWJpTEtGaFRqQmtUbG03eEZ6WFFFbWU3TFgtQzRDVXlaVEx0dzN6RzVVYjNhaU9ZRmxjU081OGhWbS1jM1hUWFlwbmdJRmktYlROQ1FWajYyVW5zamc5YUlva0ZLaDM0Wmc2OTlSa0xmRVdfMVlNRTc1dkIyQWZ6REUtVy1pUlk?oc=5",
                        source: "TimesLIVE",
                        pubDate: "Fri, 30 Aug 2024 07:00:00 GMT",
                        sentimentScores: {
                            positive: 0.32251447439193726,
                            negative: 0.0028901200275868177,
                            neutral: 0.6745954155921936
                        }
                    }
                ],
                shareCountdata: {
                    Facebook: {
                        comment_plugin_count: 0,
                        total_count: 19320,
                        og_object: null,
                        comment_count: 180,
                        share_count: 7037,
                        reaction_count: 12103
                    },
                    Pinterest: 1
                },
                reviews: {
                    rating: 1.83,
                    numberOfReviews: 1,
                    trustIndex: 2.7,
                    NPS: -58,
                    recommendationStatus: "Unlikely",
                    starRatings: [
                        {
                            stars: 5,
                            numReviews: 298
                        },
                        {
                            stars: 4,
                            numReviews: 35
                        },
                        {
                            stars: 3,
                            numReviews: 22
                        },
                        {
                            stars: 2,
                            numReviews: 131
                        },
                        {
                            stars: 1,
                            numReviews: 1280
                        }
                    ]
                }
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
                    zeroShotDomainClassify: [
                        {
                            "label": "Hospitality",
                            "score": 0.7070
                        },
                        {
                            "label": "Telecommunications",
                            "score": 0.8338
                        },
                        {
                            "label": "Arts and Culture",
                            "score": 0.2772
                        }
                    ],
                    zeroShotMetaDataClassify: [                    
                        {
                            "label": "Retail and Consumer Goods",
                            "score": 0.9696
                        },
                        {
                            "label": "Entertainment and Media",
                            "score": 0.8118
                        },
                        {
                            "label": "Fitness and Wellness",
                            "score": 0.1001
                        }                    
                    ]
                },
                seoAnalysis: {
                    imageAnalysis: {
                        errorUrls: [],
                        missingAltTextCount: 14,
                        nonOptimizedCount: 13,
                        reasonsMap: {
                            format: ['https://www.exampleOne.com/coast.png', 'https://www.exampleTwo.com/lion.svg', 'https://www.exampleThree.com/ocean.jpg'],
                            other: [],
                            size: [],
                        },
                        recommendations: '14 images are missing alt text. 13 images are not optimized.',
                        totalImages: 27,
                    },
                    uniqueContentAnalysis: {
                        recommendations: '',
                        textLength: 813,
                        uniqueWordsPercentage: 71.42,
                        repeatedWords: [
                            {
                                word: 'repeatedWordsOne',
                                count: 19,
                            }
                        ]
                    },
                    lighthouseAnalysis: {
                        scores: {
                            accessibility: 84,
                            bestPractices: 78,
                            performance: 60,
                        },
                        diagnostics: undefined,
                    },
                    siteSpeedAnalysis: {
                        loadTime: 6.60,
                        recommendations: '',
                    },
                    mobileFriendlinessAnalysis: {
                        isResponsive: true,
                        recommendations: '',
                    },
                },
                scrapeNews: [
                    {
                        title: "Level up your Heritage Day with Nando’s tips for the perfect braai - CapeTown ETC",
                        link: "https://news.google.com/rss/articles/CBMihAFBVV95cUxOVU9aT3l1aENfUHlOS0w2THl3RlZoOUZTU1RoZEcydU9LU1JaYlBpTDd2ZmQwbG1PMjRVbE5NTUR1RjJVOFVhTFg0bGphVmtYU28xTGhyTXRHQ045N0ZGQ2NmaXdReXVwSmRwcmMxaEJJV2lvSWZ4OEN1Tk4xNGFQMW03cGk?oc=5",
                        source: "CapeTown ETC",
                        pubDate: "Sun, 22 Sep 2024 13:00:56 GMT",
                        sentimentScores: {
                            positive: 0.7899376153945923,
                            negative: 0.0015594614669680595,
                            neutral: 0.2085028886795044
                        }
                    },
                    {
                        title: "Nando's Stick it out ad brings humour to South Africa's daily struggles - Bizcommunity.com",
                        link: "https://news.google.com/rss/articles/CBMitAFBVV95cUxOT2M3dU9fMEEyNFdGNXZmUHVrenBiQjR6Y2o0NVljNnVZcDJTYktzdmtPVnVvRWpLUGRrNHh4OFRQVkN4cmJMZlJCNUxjU0ZNNHZwYXFzOGkzT0Vic09LcG5vQzFmSkZ5V1ZiRDU4RnAzNVJFaFFHclp5VlJZeXVpbGZPekFWYy16bmhMMFROYXpKOHFBdlItcDgtVEx4ZWhrQ2ZneE9vbGlMYkFUcmFHcDhEY2U?oc=5",
                        source: "Bizcommunity.com",
                        pubDate: "Thu, 12 Sep 2024 07:00:00 GMT",
                        sentimentScores: {
                            positive: 0.3234110176563263,
                            negative: 0.005732724908739328,
                            neutral: 0.670856237411499
                        }
                    },
                    {
                        title: "South African restaurant Nando's Peri-Peri prepares for first Austin opening while eyeing expansion - The Business Journals",
                        link: "https://news.google.com/rss/articles/CBMimwFBVV95cUxNXzc2NlFuZDlwY2FZRXc4dFlxN2N1Rkxla2JZT2J4emtBY2pvblVuQzVoc2hKZUcxSDVBYWU3TU9XSUZZTmxqN3N4N0ozd0d4NUZ6QjlOc1Q5UWRJZTRvRTVUSHZNM0E1dGZ4azYtdEp4UERlUlJMTnlST0pkMzFPWmtJdzdWbWFuMnVZVVRfUjJLWnlyODRVV2dMMA?oc=5",
                        source: "The Business Journals",
                        pubDate: "Mon, 23 Sep 2024 12:56:00 GMT",
                        sentimentScores: {
                            positive: 0.09960536658763885,
                            negative: 0.0022338044364005327,
                            neutral: 0.8981608748435974
                        }
                    },
                    {
                        title: "The men behind Nando’s – South Africa’s global peri-peri chicken empire - BusinessTech",
                        link: "https://news.google.com/rss/articles/CBMitwFBVV95cUxOVnlJbkhXalBkei1URzY3R3dkVmdDUTZTSF9NcDVFYWdmV3pyUVlXZF8ySkk3WVJCNGNMR0lwQ0lhNFhvM3lJbl9BSW0zbjViYXpDamhwOW50X2RaU0ZBUlVlQ3EybnpSZ2QwMWMxV2FZN0JEVWtrSmZaN3FPa2pGek9UdjZKOWkxblhLYlNzNUpvU29lX2twSThKdVFuaGRneUk5OTNyMDR3S1NpSUdTcUh1M0JiWEk?oc=5",
                        source: "BusinessTech",
                        pubDate: "Thu, 25 Jul 2024 07:00:00 GMT",
                        sentimentScores: {
                            positive: 0.020457826554775238,
                            negative: 0.010590984486043453,
                            neutral: 0.9689511060714722
                        }
                    },
                    {
                        title: "Nando’s is SA’s official support group — and releases new dish to prove it - TimesLIVE",
                        link: "https://news.google.com/rss/articles/CBMixgFBVV95cUxNaWtIUHliTWREZkUxVlJnMHNOWl94ZGRYTnNKVnhVVWZKQThqRWZmZHUxVDlDZXl5aENJOW16RkF1eGxNZG5LR1VXRXN3N2VBNjQ4WjJFZmY0bTVNRW93NWlFTElINUh2c1pyTDVocjVIVmVWUW56eDhoWEtyLU8yX1AydTd1czM5WVBnZ1QwTFA5ODYyZHZxN1JkS3luXzRleHh4UkhXd2lha1NTcGJUd1lYaWc0N0lRaDlxOWV5Tm9ZY0E3UEHSAcsBQVVfeXFMUEdadVBzZjMwNmhRcUZkOHdBWGVyNzIzX1V0NlhzblVfOXg5cFNGQjhQUlM3a3dBMkZ5WHlfOHI3QUliMEREa05vN0Q0LWJpTEtGaFRqQmtUbG03eEZ6WFFFbWU3TFgtQzRDVXlaVEx0dzN6RzVVYjNhaU9ZRmxjU081OGhWbS1jM1hUWFlwbmdJRmktYlROQ1FWajYyVW5zamc5YUlva0ZLaDM0Wmc2OTlSa0xmRVdfMVlNRTc1dkIyQWZ6REUtVy1pUlk?oc=5",
                        source: "TimesLIVE",
                        pubDate: "Fri, 30 Aug 2024 07:00:00 GMT",
                        sentimentScores: {
                            positive: 0.32251447439193726,
                            negative: 0.0028901200275868177,
                            neutral: 0.6745954155921936
                        }
                    }
                ],
                shareCountdata: {
                    Facebook: {
                        comment_plugin_count: 0,
                        total_count: 9250,
                        og_object: null,
                        comment_count: 714,
                        share_count: 6631,
                        reaction_count: 1905
                    },
                    Pinterest: 5
                },
                reviews: {
                    rating: 1.65,
                    numberOfReviews: 6,
                    trustIndex: 2.8,
                    NPS: -57,
                    recommendationStatus: "",
                    starRatings: [
                        {
                            stars: 5,
                            numReviews: 580
                        },
                        {
                            stars: 4,
                            numReviews: 64
                        },
                        {
                            stars: 3,
                            numReviews: 61
                        },
                        {
                            stars: 2,
                            numReviews: 1342
                        },
                        {
                            stars: 1,
                            numReviews: 4112
                        }
                    ]
                }
            }
        ],
        processedUrls: ['https://www.example.com', 'https://www.example2.com'],
        setProcessedUrls: jest.fn(),
        processingUrls: [],
        setProcessingUrls: jest.fn(), 
        setResults: jest.fn(),
        setSummaryReport: jest.fn(),
    }),
}));

describe('Comparison testing TWO', () => {
    const mockPush = jest.fn();
    const mockResponse = {
        json: jest.fn().mockResolvedValue(true),
    };

    beforeEach(() => {
        jest.clearAllMocks();
        (useRouter as jest.Mock).mockReturnValue({ push: mockPush }); 
    });

    it('correct options in two respective dropdowns have rendered', async () => {
        render(<Comparison />);
    
        const selectOneTrigger = screen.getByTestId('website1-select');
        const selectTwoTrigger = screen.getByTestId('website2-select');
    
        expect(selectOneTrigger).toBeInTheDocument();
        expect(selectTwoTrigger).toBeInTheDocument();
    
        fireEvent.click(selectOneTrigger);
        fireEvent.click(selectTwoTrigger);
    
        await waitFor(() => {
            const optionsOne = screen.getAllByTestId(/website1-option-/);
            const optionsTwo = screen.getAllByTestId(/website2-option-/);
    
            expect(optionsOne).toHaveLength(2); 
            expect(optionsTwo).toHaveLength(2); 
    
            expect(optionsOne.map(option => option.textContent.trim())).toEqual([
                'https://www.example.com',
                'https://www.example2.com'
            ]);
    
            expect(optionsTwo.map(option => option.textContent.trim())).toEqual([
                'https://www.example.com',
                'https://www.example2.com'
            ]);
        });
    });

    it('simulate a user selecting the first option from the website ONE dropdown', async () => {
        render(<Comparison />);
    
        const selectOneTrigger = screen.getByTestId('website1-select');
    
        expect(selectOneTrigger).toBeInTheDocument();
    
        fireEvent.click(selectOneTrigger);
    
        await waitFor(() => {
            expect(screen.getByTestId('website1-option-0')).toBeInTheDocument();
            expect(screen.getByTestId('website1-option-1')).toBeInTheDocument();
        });

        const firstOption = screen.getByTestId('website1-option-0');
        fireEvent.click(firstOption);
    
        expect(screen.getByTestId('website1-status').textContent.trim()).toBe('Parked');
        expect(screen.getByTestId('website1-meta-score').textContent.trim()).toBe('69.69%');
        expect(screen.getByTestId('website1-meta-label').textContent.trim()).toBe('Tech');
        expect(screen.getByTestId('website1-domain-score').textContent.trim()).toBe('68.68%');
        expect(screen.getByTestId('website1-domain-label').textContent.trim()).toBe('Finance and Banking');
        expect(screen.getByTestId('website1-uniquewords').textContent.trim()).toBe('41.72%');
        expect(screen.getByTestId('website1-missingAltText').textContent.trim()).toBe('11');
        expect(screen.getByTestId('website1-nonOptimized').textContent.trim()).toBe('3');
        expect(screen.getByTestId('website1-lighthouse-performance').textContent.trim()).toBe('24%Performance');
        expect(screen.getByTestId('website1-lighthouse-accessibility').textContent.trim()).toBe('85%Accessibility');
        expect(screen.getByTestId('website1-lighthouse-bestpractices').textContent.trim()).toBe('93%Best Practices');
        expect(screen.getByTestId('website1-mobilefriendly').textContent.trim()).toBe('No');
        expect(screen.getByTestId('website1-sitespeed').textContent.trim()).toBe('2.88');
        expect(screen.getByTestId('website1-commentcount').textContent.trim()).toBe('180');
        expect(screen.getByTestId('website1-reactioncount').textContent.trim()).toBe('12103');
        expect(screen.getByTestId('website1-sharecount').textContent.trim()).toBe('7037');
        expect(screen.getByTestId('website1-nps').textContent.trim()).toBe('-58');
        expect(screen.getByTestId('website1-rating').textContent.trim()).toBe('1.83');
        expect(screen.getByTestId('website1-trustindex').textContent.trim()).toBe('2.7');
        expect(screen.getByTestId('website1-recommendation-status').textContent.trim()).toBe('Unlikely');
    });

    it('simulate a user selecting the first option from the website TWO dropdown', async () => {
        render(<Comparison />);
    
        const selectTwoTrigger = screen.getByTestId('website2-select');
    
        expect(selectTwoTrigger).toBeInTheDocument();
    
        fireEvent.click(selectTwoTrigger);
    
        await waitFor(() => {
            expect(screen.getByTestId('website2-option-0')).toBeInTheDocument();
            expect(screen.getByTestId('website2-option-1')).toBeInTheDocument();
        });

        const firstOption = screen.getByTestId('website2-option-1');
        fireEvent.click(firstOption);
    
        expect(screen.getByTestId('website2-status').textContent.trim()).toBe('Live');
        expect(screen.getByTestId('website2-meta-score').textContent.trim()).toBe('96.96%');
        expect(screen.getByTestId('website2-meta-label').textContent.trim()).toBe('Retail and Consumer Goods');
        expect(screen.getByTestId('website2-domain-score').textContent.trim()).toBe('70.70%');
        expect(screen.getByTestId('website2-domain-label').textContent.trim()).toBe('Hospitality');
        expect(screen.getByTestId('website2-uniquewords').textContent.trim()).toBe('71.42%');
        expect(screen.getByTestId('website2-missingAltText').textContent.trim()).toBe('14');
        expect(screen.getByTestId('website2-nonOptimized').textContent.trim()).toBe('13');
        expect(screen.getByTestId('website2-lighthouse-performance').textContent.trim()).toBe('60%Performance');
        expect(screen.getByTestId('website2-lighthouse-accessibility').textContent.trim()).toBe('84%Accessibility');
        expect(screen.getByTestId('website2-lighthouse-bestpractices').textContent.trim()).toBe('78%Best Practices');
        expect(screen.getByTestId('website2-mobilefriendly').textContent.trim()).toBe('Yes');
        expect(screen.getByTestId('website2-sitespeed').textContent.trim()).toBe('6.60');
        expect(screen.getByTestId('website2-commentcount').textContent.trim()).toBe('714');
        expect(screen.getByTestId('website2-reactioncount').textContent.trim()).toBe('1905');
        expect(screen.getByTestId('website2-sharecount').textContent.trim()).toBe('6631');
        expect(screen.getByTestId('website2-nps').textContent.trim()).toBe('-57');
        expect(screen.getByTestId('website2-rating').textContent.trim()).toBe('1.65');
        expect(screen.getByTestId('website2-trustindex').textContent.trim()).toBe('2.8');
        expect(screen.getByTestId('website2-recommendation-status').textContent.trim()).toBe('N/A');
    });
    
});
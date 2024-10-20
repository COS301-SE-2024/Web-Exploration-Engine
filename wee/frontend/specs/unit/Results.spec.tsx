import React from 'react';
import { render, screen, act, waitFor, fireEvent } from '@testing-library/react';
import Results from '../../src/app/(pages)/results/page';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { useUserContext } from '../../src/app/context/UserContext';
import { useScrapingContext } from '../../src/app/context/ScrapingContext'
import jsPDF from 'jspdf';
import { saveReport } from '../../src/app/services/SaveReportService';
import '@testing-library/jest-dom';
import exp from 'constants';

// Mock the u'seSearchParams hook
jest.mock('next/navigation', () => ({
    useSearchParams: jest.fn(),
    useRouter: jest.fn(),
}));

jest.mock('jspdf', () => ({
    __esModule: true,
    default: jest.fn().mockImplementation(() => ({
        setFontSize: jest.fn(),
        text: jest.fn(),
        rect: jest.fn(),
        setFillColor: jest.fn(),
        setTextColor: jest.fn(),
        setDrawColor: jest.fn(),
        line: jest.fn(),
        addPage: jest.fn(),
        save: jest.fn(),
        getStringUnitWidth: jest.fn().mockReturnValue(50),
        internal: {
            scaleFactor: 1.5,
            pageSize: { width: 180, height: 297 },
        },
    })),
}));

// if this isn't included a resize observer problem is thrown
jest.mock('react-apexcharts', () => () => null);

jest.mock('../../src/app/context/ScrapingContext', () => ({
    useScrapingContext: jest.fn(),
}));

jest.mock('../../src/app/context/UserContext', () => ({
    useUserContext: jest.fn(),
}));

jest.mock('../../src/app/services/SaveReportService', () => ({
    saveReport: jest.fn(),
}));

describe('Results Component', () => {
    const mockUrl = 'https://www.example.com';
    const mockPush = jest.fn();
    const mockBack = jest.fn();

    const mockResults = [
        {
            url: mockUrl,
            robots: { isUrlScrapable: true },
            metadata: {
                title: 'Burgers and Flame Grills | Steers South Africa',
                description: 'Nothing slaps more than 100% Flame-Grilled flavour. Steers South Africa is the takeaway restaurant of choice for burgers, chicken, ribs and hand-cut chips.',
                keywords: 'example, keywords',
                ogTitle: 'Example OG Title',
                ogDescription: 'Example OG Description',
                ogImage: 'https://www.example.com/ogimage.png',
            },
            domainStatus: 'live',
            logo: 'https://www.example.com/logo.png',
            images: ['https://www.example.com/image1.png', 'https://www.example.com/image2.png'],
            industryClassification: {
                metadataClass: { label: 'E-commerce', score: 95 },
                domainClass: { label: 'Retail', score: 90 },
                zeroShotDomainClassification: [
                    {
                        "label": "Finance and Banking",
                        "score": 68
                    },
                    {
                        "label": "Marine and Shipping",
                        "score": 16
                    },
                    {
                        "label": "Logistics and Supply Chain Management",
                        "score": 15
                    }
                ],
                zeroShotMetaDataClassify: [
                    {
                        "label": "Tech",
                        "score": 69
                    },
                    {
                        "label": "Utilities",
                        "score": 19
                    },
                    {
                        "label": "Marine Resources",
                        "score": 18
                    }
                ]

            },
            screenshot: 'iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==',
            addresses: ['15 Troye Street, Johannesburg, Gauteng'],
            contactInfo: {
                emails: [],
                phones: [],
                socialLinks: [
                    "https://www.facebook.com/AbsaSouthAfrica/",
                    "https://twitter.com/AbsaSouthAfrica",
                    "https://www.linkedin.com/company/absa/"
                ]
            },
            sentiment: {
                sentimentAnalysis: {
                    positive: 0.94,
                    negative: 0.001,
                    neutral: 0.05,
                },
                positiveWords: ['Flame', '100%', 'choice'],
                negativeWords: ['Nothing', 'slaps'],
                emotions: {
                    neutral: 0.88,
                    joy: 0.02,
                    surprise: 0.1,
                    anger: 0.01,
                    disgust: 0.2,
                    sadness: 0.003,
                    fear: 0.002,
                },
            },
            seoAnalysis: {
                XMLSitemapAnalysis: {
                    isSitemapValid: true,
                    recommendations: "The XML sitemap at https://www.steers.co.za/sitemap.xml is present and accessible.",
                },
                canonicalTagAnalysis: {
                    canonicalTag: "https://www.bargainbooks.co.za/",
                    isCanonicalTagPresent: true,
                    recommendations: "The canonical tag for the page is set to https://www.bargainbooks.co.za/.",
                },
                headingAnalysis: {
                    count: 2,
                    headings: ['HeadingOne', 'HeadingTwo'],
                    recommendations: 'This is a heading recommendation',
                },
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
                indexabilityAnalysis: {
                    isIndexable: true,
                    recommendations: "Your page is currently set to be indexed by search engines, which is great for visibility.",
                },
                internalLinksAnalysis: {
                    recommendations: 'This is the internal linking recommendation',
                    totalLinks: 17,
                    uniqueLinks: 9,
                },
                lighthouseAnalysis: {
                    scores: {
                        accessibility: 89,
                        bestPractices: 78,
                        performance: 87
                    },
                    diagnostics: {
                        recommendations: [
                            {
                                title: "First Contentful Paint",
                                description: "First Contentful Paint marks the time at which the first text or image is painted. .",
                                score: 0.99,
                                displayValue: "0.6s"
                            },
                            {
                                title: "Reduced unused JavaScript",
                                description: "Random description",
                                score: 0.99,
                                // displayValue: "0.6s"
                            }
                        ]
                    }
                },
                metaDescriptionAnalysis: {
                    isUrlWordsInDescription: false,
                    length: 88,
                    metaDescription: "Buy computers, hardware, software, laptops & more from South Africa's best online store.",
                    recommendations: 'Meta description length should be between 120 and 160 characters. Consider including words from the URL in the meta description: wootware.',
                },
                mobileFriendlinessAnalysis: {
                    isResponsive: true,
                    recommendations: "Your site is responsive on a 375px viewport, which is a common width for smartphones.",
                },
                siteSpeedAnalysis: {
                    loadTime: 3.15987747,
                    recommendations: "The page load time is 3.16 seconds, which is above the recommended 3 seconds. Try to streamline your page by minimizing the size of resources and improving server performance for a better user experience."
                },
                structuredDataAnalysis: {
                    count: 0,
                    recommendations: "Your site currently lacks structured data, which can help search engines understand your content better. Consider implementing structured data using Schema.org to enhance visibility and improve your SEO.",
                },
                titleTagsAnalysis: {
                    length: 80,
                    recommendations: "Title tag length should be between 50 and 60 characters.",
                    titleTag: "South African Online Computer Store",
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
        },
    ];

    const mockUser = {
        uuid: '48787157-7555-4104-bafc-e2c95bbaa959',
        emailVerified: true,
    };

    beforeEach(() => {
        (useSearchParams as jest.Mock).mockReturnValue(new URLSearchParams(`url=${mockUrl}`));
        (useRouter as jest.Mock).mockReturnValue({ push: mockPush, back: mockBack });
        (useScrapingContext as jest.Mock).mockReturnValue({ results: mockResults });
        (useUserContext as jest.Mock).mockReturnValue({ user: mockUser });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should display website status, crawlable status, industry classification, and domain classification', async () => {
        (useScrapingContext as jest.Mock).mockReturnValueOnce({
            results: [
                {
                    ...mockResults[0],
                    industryClassification: {
                        metadataClass: { label: 'E-commerce', score: 95 },
                        domainClass: { label: 'Retail', score: 90 },
                        zeroShotDomainClassification: [
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
                },
            ],
        });

        await act(async () => {
            render(<Results />);
        });

        await waitFor(() => {
            expect(screen.getByText('Yes')).toBeDefined();
            expect(screen.getByText('Live')).toBeDefined();
            expect(screen.queryByText('Finance and Banking')).toBeDefined();
            expect(screen.queryByText('Confidence Score: 68.68%')).toBeDefined();
            expect(screen.queryByText('Marine and Shipping')).toBeDefined();
            expect(screen.queryByText('Confidence Score: 16.16%')).toBeDefined();
            expect(screen.queryByText('Logistics and Supply Chain Management')).toBeDefined();
            expect(screen.queryByText('Confidence Score: 15.15%')).toBeDefined();

            expect(screen.queryByText('Tech')).toBeDefined();
            expect(screen.queryByText('Confidence Score: 69.69%')).toBeDefined();
            expect(screen.queryByText('Restuarant')).toBeDefined();
            expect(screen.queryByText('Confidence Score: 19.19%')).toBeDefined();
            expect(screen.queryByText('Marine Resources')).toBeDefined();
            expect(screen.queryByText('Confidence Score: 18.18%')).toBeDefined();
        });
    });

    it('should display website status, crawlable status, UNKNOWN industry classification, and domain classification', async () => {
        (useScrapingContext as jest.Mock).mockReturnValueOnce({
            results: [
                {
                    ...mockResults[0],
                    industryClassification: {
                        metadataClass: { label: 'E-commerce', score: 95 },
                        domainClass: { label: 'Retail', score: 90 },
                        zeroShotDomainClassification: [
                            {
                                "label": "Unknown",
                                "score": 0
                            },
                            {
                                "label": "Unknown",
                                "score": 0
                            },
                            {
                                "label": "Unknown",
                                "score": 0
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
                },
            ],
        });

        await act(async () => {
            render(<Results />);
        });

        await waitFor(() => {
            expect(screen.getByText('Yes')).toBeDefined();
            expect(screen.getByText('Live')).toBeDefined();
            expect(screen.queryByText('No industry classifications available')).toBeDefined();

            expect(screen.queryByText('Tech')).toBeDefined();
            expect(screen.queryByText('Confidence Score: 69.69%')).toBeDefined();
            expect(screen.queryByText('Restuarant')).toBeDefined();
            expect(screen.queryByText('Confidence Score: 19.19%')).toBeDefined();
            expect(screen.queryByText('Marine Resources')).toBeDefined();
            expect(screen.queryByText('Confidence Score: 18.18%')).toBeDefined();
        });
    });

    it('should display website status, crawlable status, industry classification, and UNKNOWN domain classification', async () => {
        (useScrapingContext as jest.Mock).mockReturnValueOnce({
            results: [
                {
                    ...mockResults[0],
                    industryClassification: {
                        metadataClass: { label: 'E-commerce', score: 95 },
                        domainClass: { label: 'Retail', score: 90 },
                        zeroShotDomainClassification: [
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
                                "label": "Unknown",
                                "score": 0
                            },
                            {
                                "label": "Unknown",
                                "score": 0
                            },
                            {
                                "label": "Unknown",
                                "score": 0
                            }
                        ]

                    },
                },
            ],
        });

        await act(async () => {
            render(<Results />);
        });

        await waitFor(() => {
            expect(screen.getByText('Yes')).toBeDefined();
            expect(screen.getByText('Live')).toBeDefined();
            expect(screen.queryByText('Finance and Banking')).toBeDefined();
            expect(screen.queryByText('Confidence Score: 68.68%')).toBeDefined();
            expect(screen.queryByText('Marine and Shipping')).toBeDefined();
            expect(screen.queryByText('Confidence Score: 16.16%')).toBeDefined();
            expect(screen.queryByText('Logistics and Supply Chain Management')).toBeDefined();
            expect(screen.queryByText('Confidence Score: 15.15%')).toBeDefined();

            expect(screen.queryByText('No domain match available')).toBeDefined();
        });
    });

    it('should display no address, phone, emails and socialLinks if not present', async () => {
        (useScrapingContext as jest.Mock).mockReturnValueOnce({
            results: [
                {
                    ...mockResults[0],
                    addresses: [],
                    contactInfo: {
                        emails: [],
                        phones: [],
                        socialLinks: []
                    }
                },
            ],
        });

        await act(async () => {
            render(<Results />);
        });

        await waitFor(() => {
            expect(screen.getByText('No address available')).toBeDefined();
            expect(screen.getByText('No email address available')).toBeDefined();
            expect(screen.getByText('No phone numbers available')).toBeDefined();
            expect(screen.getByText('No social links available')).toBeDefined();
        });
    });

    it('should display emails', async () => {
        (useScrapingContext as jest.Mock).mockReturnValueOnce({
            results: [
                {
                    ...mockResults[0],
                    contactInfo: {
                        emails: ['emailOne@gmail.com', 'emailTwo@outlook.com'],
                        phones: [],
                        socialLinks: [
                            "https://www.facebook.com/AbsaSouthAfrica/",
                            "https://twitter.com/AbsaSouthAfrica",
                            "https://www.linkedin.com/company/absa/"
                        ]
                    }
                },
            ],
        });

        await act(async () => {
            render(<Results />);
        });

        await waitFor(() => {
            expect(screen.getByText('15 Troye Street, Johannesburg, Gauteng')).toBeDefined();
            expect(screen.getByText('emailOne@gmail.com')).toBeDefined();
            expect(screen.getByText('emailTwo@outlook.com')).toBeDefined();
            expect(screen.getByText('No phone numbers available')).toBeDefined();
            expect(screen.getByText('https://www.facebook.com/AbsaSouthAfrica/')).toBeDefined();
            expect(screen.getByText('https://twitter.com/AbsaSouthAfrica')).toBeDefined();
            expect(screen.getByText('https://www.linkedin.com/company/absa/')).toBeDefined();
        });
    });

    it('should display phones', async () => {
        (useScrapingContext as jest.Mock).mockReturnValueOnce({
            results: [
                {
                    ...mockResults[0],
                    contactInfo: {
                        emails: ['emailOne@gmail.com', 'emailTwo@outlook.com'],
                        phones: ['0124567890', '9874563214'],
                        socialLinks: [
                            "https://www.facebook.com/AbsaSouthAfrica/",
                            "https://twitter.com/AbsaSouthAfrica",
                            "https://www.linkedin.com/company/absa/"
                        ]
                    }
                },
            ],
        });

        await act(async () => {
            render(<Results />);
        });

        await waitFor(() => {
            expect(screen.getByText('15 Troye Street, Johannesburg, Gauteng')).toBeDefined();
            expect(screen.getByText('emailOne@gmail.com')).toBeDefined();
            expect(screen.getByText('emailTwo@outlook.com')).toBeDefined();
            expect(screen.getByText('0124567890')).toBeDefined();
            expect(screen.getByText('9874563214')).toBeDefined();
            expect(screen.getByText('https://www.facebook.com/AbsaSouthAfrica/')).toBeDefined();
            expect(screen.getByText('https://twitter.com/AbsaSouthAfrica')).toBeDefined();
            expect(screen.getByText('https://www.linkedin.com/company/absa/')).toBeDefined();
        });
    });

    it('should display address and socialLinks', async () => {
        await act(async () => {
            render(<Results />);
        });

        await waitFor(() => {
            expect(screen.getByText('15 Troye Street, Johannesburg, Gauteng')).toBeDefined();
            expect(screen.getByText('No email address available')).toBeDefined();
            expect(screen.getByText('No phone numbers available')).toBeDefined();
            expect(screen.getByText('https://www.facebook.com/AbsaSouthAfrica/')).toBeDefined();
            expect(screen.getByText('https://twitter.com/AbsaSouthAfrica')).toBeDefined();
            expect(screen.getByText('https://www.linkedin.com/company/absa/')).toBeDefined();
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

        const mediaTab = screen.getByRole('tab', { name: /Media/i });
        fireEvent.click(mediaTab);

        await waitFor(() => {
            expect(screen.getByText('No images available.')).toBeDefined();
        });
    });

    it('should display no screenshot available when screenshot is not present', async () => {
        (useScrapingContext as jest.Mock).mockReturnValueOnce({
            results: [
                {
                    ...mockResults[0],
                    screenshot: '',
                },
            ],
        });

        await act(async () => {
            render(<Results />);
        });

        const mediaTab = screen.getByRole('tab', { name: /Media/i });
        fireEvent.click(mediaTab);

        await waitFor(() => {
            expect(screen.getByText('No homepage screenshot available.')).toBeDefined();
        });
    });

    it('should display the screenshot when it is present', async () => {
        (useScrapingContext as jest.Mock).mockReturnValueOnce({
            results: mockResults,
        });

        await act(async () => {
            render(<Results />);
        });

        const mediaTab = screen.getByRole('tab', { name: /Media/i });
        fireEvent.click(mediaTab);

        await waitFor(() => {
            expect(screen.getByAltText('HomePageScreenShot')).toBeInTheDocument();
            expect(screen.getByAltText('HomePageScreenShot').src).toBe(`data:image/png;base64,${mockResults[0].screenshot}`);
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

        expect(mockBack).toHaveBeenCalled();
    });

    it('should set crawlable status to No when an error response is returned', async () => {
        (useScrapingContext as jest.Mock).mockReturnValueOnce({
            results: [
                {
                    ...mockResults[0],
                    robots: { errorStatus: 404, errorCode: 'Not Found', errorMessage: 'Page not found' },
                },
            ],
        });

        await act(async () => {
            render(<Results />);
        });

        await waitFor(() => {
            expect(screen.queryByText('No')).toBeDefined();
        });
    });

    it('should display correct summary information', async () => {
        await act(async () => {
            render(<Results />);
        });

        await waitFor(() => {
            expect(screen.queryByText('Example Title')).toBeDefined();
            expect(screen.queryByText('Example Description')).toBeDefined();
        });
    });

    it('should display a fallback message when summary information is not available', async () => {
        (useScrapingContext as jest.Mock).mockReturnValueOnce({
            results: [
                {
                    ...mockResults[0],
                    metadata: {
                        title: '',
                        description: '',
                        ogTitle: '',
                        ogDescription: '',
                    },
                },
            ],
        });

        await act(async () => {
            render(<Results />);
        });

        await waitFor(() => {
            expect(screen.getByText('No summary information available.')).toBeDefined();
        });
    });

    it('should display images correctly when images are present', async () => {
        await act(async () => {
            render(<Results />);
        });

        const mediaTab = screen.getByRole('tab', { name: /Media/i });
        fireEvent.click(mediaTab);

        await waitFor(() => {
            expect(screen.getAllByAltText('Image').length).toBe(mockResults[0].images.length);
        });
    });

    it('Onpage SEO: Internal Linking - display total, unique links and recommendation', async () => {
        await act(async () => {
            render(<Results />);
        });

        const SEOTab = screen.getByRole('tab', { name: /SEO Analysis/i });
        fireEvent.click(SEOTab);

        await waitFor(() => {
            expect(screen.getByText(mockResults[0].seoAnalysis.internalLinksAnalysis.totalLinks)).toBeDefined();
            expect(screen.getByText(mockResults[0].seoAnalysis.internalLinksAnalysis.uniqueLinks)).toBeDefined();
            expect(screen.queryByTestId('internalLinking_recommendations')).toBeInTheDocument();
            expect(screen.getByText(mockResults[0].seoAnalysis.internalLinksAnalysis.recommendations)).toBeDefined();
        });
    });

    it('Onpage SEO: Internal Linking - display total, unique links and NO recommendation', async () => {
        (useScrapingContext as jest.Mock).mockReturnValueOnce({
            results: [
                {
                    ...mockResults[0],
                    seoAnalysis: {
                        ...mockResults[0].seoAnalysis,
                        internalLinksAnalysis: {
                            recommendations: '',
                            totalLinks: 17,
                            uniqueLinks: 9,
                        },
                    }
                },
            ],
        });

        await act(async () => {
            render(<Results />);
        });

        const SEOTab = screen.getByRole('tab', { name: /SEO Analysis/i });
        fireEvent.click(SEOTab);

        await waitFor(() => {
            expect(screen.getByText(mockResults[0].seoAnalysis.internalLinksAnalysis.totalLinks)).toBeDefined();
            expect(screen.getByText(mockResults[0].seoAnalysis.internalLinksAnalysis.uniqueLinks)).toBeDefined();
            expect(screen.queryByTestId('internalLinking_recommendations')).not.toBeInTheDocument();
        });
    });

    it('Onpage SEO: Meta Description - display metadescription, length and recommendation', async () => {
        await act(async () => {
            render(<Results />);
        });

        const SEOTab = screen.getByRole('tab', { name: /SEO Analysis/i });
        fireEvent.click(SEOTab);

        await waitFor(() => {
            expect(screen.getByText(mockResults[0].seoAnalysis.metaDescriptionAnalysis.metaDescription)).toBeDefined();
            expect(screen.getByText(mockResults[0].seoAnalysis.metaDescriptionAnalysis.length)).toBeDefined();
            expect(screen.getByText('No')).toBeDefined();
            expect(screen.queryByTestId('meta_recommendations')).toBeInTheDocument();
            expect(screen.getByText(mockResults[0].seoAnalysis.metaDescriptionAnalysis.recommendations)).toBeDefined();
        });
    });

    it('Onpage SEO: Meta Description - metadata description, length, is url in description and NO recommendation', async () => {
        (useScrapingContext as jest.Mock).mockReturnValueOnce({
            results: [
                {
                    ...mockResults[0],
                    seoAnalysis: {
                        ...mockResults[0].seoAnalysis,
                        metaDescriptionAnalysis: {
                            isUrlWordsInDescription: true,
                            length: 121,
                            metaDescription: "Meta description for title tag analysis",
                            recommendations: '',
                        },
                    }
                },
            ],
        });

        await act(async () => {
            render(<Results />);
        });

        const SEOTab = screen.getByRole('tab', { name: /SEO Analysis/i });
        fireEvent.click(SEOTab);

        await waitFor(() => {
            expect(screen.getByText("Meta description for title tag analysis")).toBeDefined();
            expect(screen.getByText("121")).toBeDefined();
            expect(screen.queryByTestId('isUrlWordsInDescription')?.textContent).toBe('Yes');
            expect(screen.queryByTestId('meta_recommendations')).not.toBeInTheDocument();
        });
    });

    it('Onpage SEO: Images - display total images, missing alt text, non-optimised images, list of urls which format is incorrent and recommendation', async () => {
        await act(async () => {
            render(<Results />);
        });

        const SEOTab = screen.getByRole('tab', { name: /SEO Analysis/i });
        fireEvent.click(SEOTab);

        await waitFor(() => {
            expect(screen.getByText(mockResults[0].seoAnalysis.imageAnalysis.totalImages)).toBeDefined();
            expect(screen.getByText(mockResults[0].seoAnalysis.imageAnalysis.missingAltTextCount)).toBeDefined();
            expect(screen.getByText(mockResults[0].seoAnalysis.imageAnalysis.nonOptimizedCount)).toBeDefined();
            expect(screen.getByText(mockResults[0].seoAnalysis.imageAnalysis.reasonsMap.format[0])).toBeDefined();
            expect(screen.getByText(mockResults[0].seoAnalysis.imageAnalysis.reasonsMap.format[2])).toBeDefined();
            expect(screen.queryByTestId('images_recommendations')).toBeInTheDocument();
            expect(screen.getByText(mockResults[0].seoAnalysis.imageAnalysis.recommendations)).toBeDefined();
        });
    });

    it('Onpage SEO: Images - display total images, missing alt text, non-optimised images and NO recommendation', async () => {
        (useScrapingContext as jest.Mock).mockReturnValueOnce({
            results: [
                {
                    ...mockResults[0],
                    seoAnalysis: {
                        ...mockResults[0].seoAnalysis,
                        imageAnalysis: {
                            errorUrls: [],
                            missingAltTextCount: 6,
                            nonOptimizedCount: 0,
                            reasonsMap: {
                                format: [],
                                other: [],
                                size: [],
                            },
                            recommendations: '',
                            totalImages: 34,
                        },
                    }
                },
            ],
        });

        await act(async () => {
            render(<Results />);
        });

        const SEOTab = screen.getByRole('tab', { name: /SEO Analysis/i });
        fireEvent.click(SEOTab);

        await waitFor(() => {
            expect(screen.getByText('34')).toBeDefined();
            expect(screen.getByText('6')).toBeDefined();
            expect(screen.queryByTestId('nonOptimisedImages')?.textContent).toBe('0');
            expect(screen.queryByTestId('images_recommendations')).not.toBeInTheDocument();
        });
    });

    it('Onpage SEO: Title Tags - title tag, length and recommendation', async () => {
        await act(async () => {
            render(<Results />);
        });

        const SEOTab = screen.getByRole('tab', { name: /SEO Analysis/i });
        fireEvent.click(SEOTab);

        await waitFor(() => {
            expect(screen.getByText(mockResults[0].seoAnalysis.titleTagsAnalysis.titleTag)).toBeDefined();
            expect(screen.getByText(mockResults[0].seoAnalysis.titleTagsAnalysis.length)).toBeDefined();
            expect(screen.queryByTestId('titleTag_recommendations')).toBeInTheDocument();
            expect(screen.getByText(mockResults[0].seoAnalysis.titleTagsAnalysis.recommendations)).toBeDefined();
        });
    });

    it('Onpage SEO: Title Tags - title tag, length and NO recommendation', async () => {
        (useScrapingContext as jest.Mock).mockReturnValueOnce({
            results: [
                {
                    ...mockResults[0],
                    seoAnalysis: {
                        ...mockResults[0].seoAnalysis,
                        titleTagsAnalysis: {
                            length: 55,
                            recommendations: '',
                            titleTag: "South African Online Computer Store",
                        },
                    }
                },
            ],
        });

        await act(async () => {
            render(<Results />);
        });

        const SEOTab = screen.getByRole('tab', { name: /SEO Analysis/i });
        fireEvent.click(SEOTab);

        await waitFor(() => {
            expect(screen.getByText(mockResults[0].seoAnalysis.titleTagsAnalysis.titleTag)).toBeDefined();
            expect(screen.getByText('55')).toBeDefined();
            expect(screen.queryByTestId('titleTag_recommendations')).not.toBeInTheDocument();
        });
    });

    it('Onpage SEO: Unique Content - Text Length, Unique words, repeated words and NO recommendation', async () => {
        await act(async () => {
            render(<Results />);
        });

        const SEOTab = screen.getByRole('tab', { name: /SEO Analysis/i });
        fireEvent.click(SEOTab);

        await waitFor(() => {
            expect(screen.getByText(mockResults[0].seoAnalysis.uniqueContentAnalysis.textLength)).toBeDefined();
            expect(screen.getByText('41.72%')).toBeDefined();
            expect(screen.getByText('repeatedWordsOne: 19')).toBeDefined();
            expect(screen.queryByTestId('uniqueContent_recommendations')).not.toBeInTheDocument();
        });
    });

    it('Onpage SEO: Unique Content - Text Length, Unique words, repeated words and recommendation', async () => {
        (useScrapingContext as jest.Mock).mockReturnValueOnce({
            results: [
                {
                    ...mockResults[0],
                    seoAnalysis: {
                        ...mockResults[0].seoAnalysis,
                        uniqueContentAnalysis: {
                            recommendations: 'Content length should ideally be more than 500 characters.',
                            textLength: 743,
                            uniqueWordsPercentage: 41.72,
                            repeatedWords: [
                                {
                                    word: 'repeatedWordsOne',
                                    count: 19,
                                }
                            ]
                        },
                    }
                },
            ],
        });

        await act(async () => {
            render(<Results />);
        });

        const SEOTab = screen.getByRole('tab', { name: /SEO Analysis/i });
        fireEvent.click(SEOTab);

        await waitFor(() => {
            expect(screen.getByText(mockResults[0].seoAnalysis.uniqueContentAnalysis.textLength)).toBeDefined();
            expect(screen.getByText('41.72%')).toBeDefined();
            expect(screen.getByText('repeatedWordsOne: 19')).toBeDefined();
            expect(screen.queryByTestId('uniqueContent_recommendations')).toBeInTheDocument();
            expect(screen.getByText('Content length should ideally be more than 500 characters.')).toBeDefined();
        });
    });

    it('Onpage SEO: Unique Content - Text Length, Unique words, NO repeated words and recommendation', async () => {
        (useScrapingContext as jest.Mock).mockReturnValueOnce({
            results: [
                {
                    ...mockResults[0],
                    seoAnalysis: {
                        ...mockResults[0].seoAnalysis,
                        uniqueContentAnalysis: {
                            recommendations: 'Content length should ideally be more than 500 characters.',
                            textLength: 743,
                            uniqueWordsPercentage: 41.72,
                            repeatedWords: []
                        },
                    }
                },
            ],
        });

        await act(async () => {
            render(<Results />);
        });

        const SEOTab = screen.getByRole('tab', { name: /SEO Analysis/i });
        fireEvent.click(SEOTab);

        await waitFor(() => {
            expect(screen.getByText(mockResults[0].seoAnalysis.uniqueContentAnalysis.textLength)).toBeDefined();
            expect(screen.getByText('41.72%')).toBeDefined();
            expect(screen.queryByText('repeatedWordsOne: 19')).not.toBeInTheDocument();
            expect(screen.queryByTestId('uniqueContent_recommendations')).toBeInTheDocument();
            expect(screen.getByText('Content length should ideally be more than 500 characters.')).toBeDefined();
        });
    });

    it('Onpage SEO: Headings - display list of headings, heading count and recommendation', async () => {
        await act(async () => {
            render(<Results />);
        });

        const SEOTab = screen.getByRole('tab', { name: /SEO Analysis/i });
        fireEvent.click(SEOTab);

        await waitFor(() => {
            expect(screen.getByText(mockResults[0].seoAnalysis.headingAnalysis.count)).toBeDefined();
            expect(screen.queryByTestId('headings_recommendations')).toBeInTheDocument();
            expect(screen.getByText(mockResults[0].seoAnalysis.headingAnalysis.recommendations)).toBeDefined();
            expect(screen.getByText(mockResults[0].seoAnalysis.headingAnalysis.headings[0])).toBeDefined();
            expect(screen.getByText(mockResults[0].seoAnalysis.headingAnalysis.headings[1])).toBeDefined();
        });
    });

    it('Onpage SEO: Headings - display list of headings, heading count and NO recommendation', async () => {
        (useScrapingContext as jest.Mock).mockReturnValueOnce({
            results: [
                {
                    ...mockResults[0],
                    seoAnalysis: {
                        ...mockResults[0].seoAnalysis,
                        headingAnalysis: {
                            count: 2,
                            headings: ['HeadingOne', 'HeadingTwo'],
                            recommendations: '',
                        },
                    }
                },
            ],
        });

        await act(async () => {
            render(<Results />);
        });

        const SEOTab = screen.getByRole('tab', { name: /SEO Analysis/i });
        fireEvent.click(SEOTab);

        await waitFor(() => {
            expect(screen.getByText(mockResults[0].seoAnalysis.headingAnalysis.count)).toBeDefined();
            expect(screen.queryByTestId('headings_recommendations')).not.toBeInTheDocument();
            expect(screen.getByText(mockResults[0].seoAnalysis.headingAnalysis.headings[0])).toBeDefined();
            expect(screen.getByText(mockResults[0].seoAnalysis.headingAnalysis.headings[1])).toBeDefined();
        });
    });

    it('Onpage SEO: Headings - display NO list of headings, heading count and recommendation', async () => {
        (useScrapingContext as jest.Mock).mockReturnValueOnce({
            results: [
                {
                    ...mockResults[0],
                    seoAnalysis: {
                        ...mockResults[0].seoAnalysis,
                        headingAnalysis: {
                            count: 0,
                            headings: [],
                            recommendations: 'This is a heading recommendation',
                        },
                    }
                },
            ],
        });

        await act(async () => {
            render(<Results />);
        });

        const SEOTab = screen.getByRole('tab', { name: /SEO Analysis/i });
        fireEvent.click(SEOTab);

        await waitFor(() => {
            expect(screen.queryByTestId('headingscount')?.textContent).toBe('0');
            expect(screen.queryByTestId('headings_recommendations')).toBeInTheDocument();
            expect(screen.getByText(mockResults[0].seoAnalysis.headingAnalysis.recommendations)).toBeDefined();
            expect(screen.queryByText(mockResults[0].seoAnalysis.headingAnalysis.headings[0])).not.toBeInTheDocument();
            expect(screen.queryByText(mockResults[0].seoAnalysis.headingAnalysis.headings[1])).not.toBeInTheDocument();
        });
    });

    it('Technical SEO: Canonical Tags', async () => {
        await act(async () => {
            render(<Results />);
        });

        const SEOTab = screen.getByRole('tab', { name: /SEO Analysis/i });
        fireEvent.click(SEOTab);

        await waitFor(() => {
            expect(screen.queryByTestId('canonicalTagPresent')?.textContent).toBe('Yes');
            expect(screen.getByText(mockResults[0].seoAnalysis.canonicalTagAnalysis.canonicalTag)).toBeDefined();
            expect(screen.queryByTestId('canonical_recommendations')).toBeInTheDocument();
            expect(screen.getByText(mockResults[0].seoAnalysis.canonicalTagAnalysis.recommendations)).toBeDefined();
        });
    })

    it('Technical SEO: Canonical Tags, NO tag present', async () => {
        (useScrapingContext as jest.Mock).mockReturnValueOnce({
            results: [
                {
                    ...mockResults[0],
                    seoAnalysis: {
                        ...mockResults[0].seoAnalysis,
                        canonicalTagAnalysis: {
                            canonicalTag: "",
                            isCanonicalTagPresent: false,
                            recommendations: "The canonical tag for the page is set to https://www.bargainbooks.co.za/.",
                        },
                    }
                },
            ],
        });

        await act(async () => {
            render(<Results />);
        });

        const SEOTab = screen.getByRole('tab', { name: /SEO Analysis/i });
        fireEvent.click(SEOTab);

        await waitFor(() => {
            expect(screen.queryByTestId('canonicalTagPresent')?.textContent).toBe('No');
            expect(screen.queryByTestId('canonicalTag')?.textContent).toBe('No canonical tag present');
            expect(screen.queryByTestId('canonical_recommendations')).toBeInTheDocument();
            expect(screen.getByText(mockResults[0].seoAnalysis.canonicalTagAnalysis.recommendations)).toBeDefined();
        });
    })

    it('Technical SEO: Site Speed', async () => {
        await act(async () => {
            render(<Results />);
        });

        const SEOTab = screen.getByRole('tab', { name: /SEO Analysis/i });
        fireEvent.click(SEOTab);

        await waitFor(() => {
            expect(screen.queryByTestId('siteSpeed')?.textContent).toBe("3.16");
            expect(screen.queryByTestId('sitespeed_recommendations')).toBeInTheDocument();
            expect(screen.getByText(mockResults[0].seoAnalysis.siteSpeedAnalysis.recommendations)).toBeDefined();
        });
    });

    it('Technical SEO: Site Speed with zero loadtime', async () => {
        (useScrapingContext as jest.Mock).mockReturnValueOnce({
            results: [
                {
                    ...mockResults[0],
                    seoAnalysis: {
                        ...mockResults[0].seoAnalysis,
                        siteSpeedAnalysis: undefined
                    }
                },
            ],
        });

        await act(async () => {
            render(<Results />);
        });

        const SEOTab = screen.getByRole('tab', { name: /SEO Analysis/i });
        fireEvent.click(SEOTab);

        await waitFor(() => {
            expect(screen.queryByTestId('siteSpeed')?.textContent).toBe("0");
            expect(screen.queryByTestId('sitespeed_recommendations')).not.toBeInTheDocument();
        });
    });

    it('Technical SEO: XML Sitemap Analysis', async () => {
        await act(async () => {
            render(<Results />);
        });

        const SEOTab = screen.getByRole('tab', { name: /SEO Analysis/i });
        fireEvent.click(SEOTab);

        await waitFor(() => {
            expect(screen.queryByTestId('isSitemapvalid')?.textContent).toBe("Yes");
            expect(screen.queryByTestId('xml_recommendation')).toBeInTheDocument();
            expect(screen.getByText(mockResults[0].seoAnalysis.XMLSitemapAnalysis.recommendations)).toBeDefined();
        });
    });

    it('Technical SEO: XML Sitemap Analysis without valid xml sitemap', async () => {
        (useScrapingContext as jest.Mock).mockReturnValueOnce({
            results: [
                {
                    ...mockResults[0],
                    seoAnalysis: {
                        ...mockResults[0].seoAnalysis,
                        XMLSitemapAnalysis: {
                            isSitemapValid: false,
                            recommendations: "The XML sitemap at https://www.steers.co.za/sitemap.xml is present and accessible.",
                        },
                    }
                },
            ],
        });

        await act(async () => {
            render(<Results />);
        });

        const SEOTab = screen.getByRole('tab', { name: /SEO Analysis/i });
        fireEvent.click(SEOTab);

        await waitFor(() => {
            expect(screen.queryByTestId('isSitemapvalid')?.textContent).toBe("No");
            expect(screen.queryByTestId('xml_recommendation')).toBeInTheDocument();
            expect(screen.getByText(mockResults[0].seoAnalysis.XMLSitemapAnalysis.recommendations)).toBeDefined();
        });
    });

    it('Technical SEO: XML Sitemap Analysis undefined', async () => {
        (useScrapingContext as jest.Mock).mockReturnValueOnce({
            results: [
                {
                    ...mockResults[0],
                    seoAnalysis: {
                        ...mockResults[0].seoAnalysis,
                        XMLSitemapAnalysis: undefined
                    }
                },
            ],
        });

        await act(async () => {
            render(<Results />);
        });

        const SEOTab = screen.getByRole('tab', { name: /SEO Analysis/i });
        fireEvent.click(SEOTab);

        await waitFor(() => {
            expect(screen.queryByTestId('isSitemapvalid')?.textContent).toBe("-");
            expect(screen.queryByTestId('xml_recommendation')).not.toBeInTheDocument();
        });
    });

    it('Technical SEO: Mobile friendliness', async () => {
        await act(async () => {
            render(<Results />);
        });

        const SEOTab = screen.getByRole('tab', { name: /SEO Analysis/i });
        fireEvent.click(SEOTab);

        await waitFor(() => {
            expect(screen.queryByTestId('mobile_friendliness')?.textContent).toBe("Yes");
            expect(screen.queryByTestId('mobile_recommendations')).toBeInTheDocument();
            expect(screen.getByText(mockResults[0].seoAnalysis.mobileFriendlinessAnalysis.recommendations)).toBeDefined();
        });
    });

    it('Technical SEO: Mobile friendliness NO mobile friendliness', async () => {
        (useScrapingContext as jest.Mock).mockReturnValueOnce({
            results: [
                {
                    ...mockResults[0],
                    seoAnalysis: {
                        ...mockResults[0].seoAnalysis,
                        mobileFriendlinessAnalysis: {
                            isResponsive: false,
                            recommendations: "Your page is currently set to be indexed by search engines, which is great for visibility.",
                        },
                    }
                },
            ],
        });

        await act(async () => {
            render(<Results />);
        });

        const SEOTab = screen.getByRole('tab', { name: /SEO Analysis/i });
        fireEvent.click(SEOTab);

        await waitFor(() => {
            expect(screen.queryByTestId('mobile_friendliness')?.textContent).toBe("No");
            expect(screen.queryByTestId('mobile_recommendations')).toBeInTheDocument();
        });
    });

    it('Technical SEO: Mobile friendliness undefined', async () => {
        (useScrapingContext as jest.Mock).mockReturnValueOnce({
            results: [
                {
                    ...mockResults[0],
                    seoAnalysis: {
                        ...mockResults[0].seoAnalysis,
                        mobileFriendlinessAnalysis: undefined
                    }
                },
            ],
        });

        await act(async () => {
            render(<Results />);
        });

        const SEOTab = screen.getByRole('tab', { name: /SEO Analysis/i });
        fireEvent.click(SEOTab);

        await waitFor(() => {
            expect(screen.queryByTestId('mobile_friendliness')?.textContent).toBe("-");
            expect(screen.queryByTestId('mobile_recommendations')).not.toBeInTheDocument();
        });
    });

    it('Technical SEO: Indexibility', async () => {
        await act(async () => {
            render(<Results />);
        });

        const SEOTab = screen.getByRole('tab', { name: /SEO Analysis/i });
        fireEvent.click(SEOTab);

        await waitFor(() => {
            expect(screen.queryByTestId('indexibilityAnalysis')?.textContent).toBe("Yes");
            expect(screen.queryByTestId('indexable_recommendation')).toBeInTheDocument();
            expect(screen.getByText(mockResults[0].seoAnalysis.indexabilityAnalysis.recommendations)).toBeDefined();
        });
    });

    it('Technical SEO: Indexibility, NO indexibility', async () => {
        (useScrapingContext as jest.Mock).mockReturnValueOnce({
            results: [
                {
                    ...mockResults[0],
                    seoAnalysis: {
                        ...mockResults[0].seoAnalysis,
                        indexabilityAnalysis: {
                            isIndexable: false,
                            recommendations: "Your page is currently set to be indexed by search engines, which is great for visibility.",
                        },
                    }
                },
            ],
        });

        await act(async () => {
            render(<Results />);
        });

        const SEOTab = screen.getByRole('tab', { name: /SEO Analysis/i });
        fireEvent.click(SEOTab);

        await waitFor(() => {
            expect(screen.queryByTestId('indexibilityAnalysis')?.textContent).toBe("No");
            expect(screen.queryByTestId('indexable_recommendation')).toBeInTheDocument();
            expect(screen.getByText(mockResults[0].seoAnalysis.indexabilityAnalysis.recommendations)).toBeDefined();
        });
    });

    it('Technical SEO: Indexibility, undefined', async () => {
        (useScrapingContext as jest.Mock).mockReturnValueOnce({
            results: [
                {
                    ...mockResults[0],
                    seoAnalysis: {
                        ...mockResults[0].seoAnalysis,
                        indexabilityAnalysis: undefined
                    }
                },
            ],
        });

        await act(async () => {
            render(<Results />);
        });

        const SEOTab = screen.getByRole('tab', { name: /SEO Analysis/i });
        fireEvent.click(SEOTab);

        await waitFor(() => {
            expect(screen.queryByTestId('indexibilityAnalysis')?.textContent).toBe("-");
            expect(screen.queryByTestId('indexable_recommendation')).not.toBeInTheDocument();
        });
    });

    it('Technical SEO: Structured data analysis', async () => {
        await act(async () => {
            render(<Results />);
        });

        const SEOTab = screen.getByRole('tab', { name: /SEO Analysis/i });
        fireEvent.click(SEOTab);

        await waitFor(() => {
            expect(screen.queryByTestId('structuredData')?.textContent).toBe("0");
            expect(screen.queryByTestId('structured_recommendations')).toBeInTheDocument();
            expect(screen.getByText(mockResults[0].seoAnalysis.structuredDataAnalysis.recommendations)).toBeDefined();
        });
    });

    it('Technical SEO: Lighthouse analysis', async () => {
        await act(async () => {
            render(<Results />);
        });

        const SEOTab = screen.getByRole('tab', { name: /SEO Analysis/i });
        fireEvent.click(SEOTab);

        await waitFor(() => {
            expect(screen.queryByTestId('lighthouse-performance')?.textContent).toBe("87%Performance");
            expect(screen.queryByTestId('lighthouse-accessibility')?.textContent).toBe("89%Accessibility");
            expect(screen.queryByTestId('lighthouse-bestpractices')?.textContent).toBe("78%Best Practices");
            expect(screen.queryByTestId('lighthouse_recommendation_0')?.textContent).toBe(mockResults[0].seoAnalysis.lighthouseAnalysis.diagnostics.recommendations[0].title + ' - ' + mockResults[0].seoAnalysis.lighthouseAnalysis.diagnostics.recommendations[0].displayValue);
            expect(screen.queryByTestId('lighthouse_recommendation_1')?.textContent).toBe(mockResults[0].seoAnalysis.lighthouseAnalysis.diagnostics.recommendations[1].title);
        });
    });

    it('Technical SEO: Lighthouse analysis 0', async () => {
        (useScrapingContext as jest.Mock).mockReturnValueOnce({
            results: [
                {
                    ...mockResults[0],
                    seoAnalysis: {
                        ...mockResults[0].seoAnalysis,
                        lighthouseAnalysis: {
                            scores: {
                                performance: 0,
                                accessibility: 0,
                                bestPractices: 0,
                            },
                            diagnostics: {
                                recommendations: [
                                ]
                            }
                        },
                    }
                },
            ],
        });

        await act(async () => {
            render(<Results />);
        });

        const SEOTab = screen.getByRole('tab', { name: /SEO Analysis/i });
        fireEvent.click(SEOTab);

        await waitFor(() => {
            expect(screen.queryByTestId('lighthouse-performance')?.textContent).toBe("0%Performance");
            expect(screen.queryByTestId('lighthouse-accessibility')?.textContent).toBe("0%Accessibility");
            expect(screen.queryByTestId('lighthouse-bestpractices')?.textContent).toBe("0%Best Practices");
            expect(screen.queryByTestId('lighthouse_recommendation_0')).not.toBeInTheDocument();
        });
    });

    it('Sentiment Analysis: Donut chart, metadata, positive and negative words and emotion graphs displayed', async () => {
        (useScrapingContext as jest.Mock).mockReturnValueOnce({
            results: [
                {
                    ...mockResults[0],
                    sentiment: {
                        sentimentAnalysis: {
                            positive: 0.90,
                            negative: 0.02,
                            neutral: 0.08,
                        },
                        positiveWords: ['Flame', '100%', 'choice'],
                        negativeWords: ['Nothing', 'slaps'],
                        emotions: {
                            neutral: 0.88,
                            joy: 0.02,
                            surprise: 0.1,
                            anger: 0.01,
                            disgust: 0.2,
                            sadness: 0.003,
                            fear: 0.002,
                        },
                    },
                },
            ],
        });

        await act(async () => {
            render(<Results />);
        });

        const SentimentTab = screen.getByRole('tab', { name: /Sentiment Analysis/i });
        fireEvent.click(SentimentTab);

        await waitFor(() => {
            expect(screen.getByTestId('sentiment-donut-chart')).toBeInTheDocument();

            const sentimentMetaTitleDiv = screen.getByTestId('sentiment-meta-title');
            expect(sentimentMetaTitleDiv).toHaveTextContent("Burgers and Flame Grills | Steers South Africa");
            expect(sentimentMetaTitleDiv).toHaveTextContent("Flame");

            const sentimentMetaDescrDiv = screen.getByTestId('sentiment-meta-description');
            expect(sentimentMetaDescrDiv).toHaveTextContent("Nothing slaps more than 100% Flame-Grilled flavour. Steers South Africa is the takeaway restaurant of choice for burgers, chicken, ribs and hand-cut chips.");
            expect(sentimentMetaDescrDiv).toHaveTextContent("Nothing");
            expect(sentimentMetaDescrDiv).toHaveTextContent("slaps");
            expect(sentimentMetaDescrDiv).toHaveTextContent("100%");
            expect(sentimentMetaDescrDiv).toHaveTextContent("choice");
            expect(sentimentMetaDescrDiv).toHaveTextContent("burgers");
            expect(sentimentMetaDescrDiv).toHaveTextContent("chips");

            const sentimentMetaKeywordsDiv = screen.getByTestId('sentiment-meta-keywords');
            expect(sentimentMetaKeywordsDiv).toHaveTextContent("example, keywords");

            expect(screen.getByTestId('sentiment-emotions-progress-charts')).toBeInTheDocument();
        });
    });

    it('Sentiment Analysis: Donut chart, metadata, emotion graphs, NO positive and negative words displayed', async () => {
        (useScrapingContext as jest.Mock).mockReturnValueOnce({
            results: [
                {
                    ...mockResults[0],
                    sentiment: {
                        sentimentAnalysis: {
                            positive: 0.90,
                            negative: 0.02,
                            neutral: 0.08,
                        },
                        positiveWords: [],
                        negativeWords: [],
                        emotions: {
                            neutral: 0.88,
                            joy: 0.02,
                            surprise: 0.1,
                            anger: 0.01,
                            disgust: 0.2,
                            sadness: 0.003,
                            fear: 0.002,
                        },
                    },
                },
            ],
        });

        await act(async () => {
            render(<Results />);
        });

        const SentimentTab = screen.getByRole('tab', { name: /Sentiment Analysis/i });
        fireEvent.click(SentimentTab);

        await waitFor(() => {
            expect(screen.getByTestId('sentiment-donut-chart')).toBeInTheDocument();

            const sentimentMetaTitleDiv = screen.queryByTestId('sentiment-meta-title');
            expect(sentimentMetaTitleDiv).not.toBeInTheDocument();

            const sentimentMetaDescrDiv = screen.queryByTestId('sentiment-meta-description');
            expect(sentimentMetaDescrDiv).not.toBeInTheDocument();

            const sentimentMetaKeywordsDiv = screen.queryByTestId('sentiment-meta-keywords');
            expect(sentimentMetaKeywordsDiv).not.toBeInTheDocument();

            expect(screen.queryByText('There is no positive or negative words to display')).toBeInTheDocument();

            expect(screen.getByTestId('sentiment-emotions-progress-charts')).toBeInTheDocument();
        });
    });

    it('Sentiment Analysis: Donut chart, metadata, positive and negative words and NO emotion graphs displayed', async () => {
        (useScrapingContext as jest.Mock).mockReturnValueOnce({
            results: [
                {
                    ...mockResults[0],
                    sentiment: {
                        sentimentAnalysis: {
                            positive: 0.90,
                            negative: 0.02,
                            neutral: 0.08,
                        },
                        positiveWords: ['Flame', '100%', 'choice'],
                        negativeWords: ['Nothing', 'slaps'],
                        emotions: {},
                    },
                },
            ],
        });

        await act(async () => {
            render(<Results />);
        });

        const SentimentTab = screen.getByRole('tab', { name: /Sentiment Analysis/i });
        fireEvent.click(SentimentTab);

        await waitFor(() => {
            expect(screen.getByTestId('sentiment-donut-chart')).toBeInTheDocument();

            const sentimentMetaTitleDiv = screen.getByTestId('sentiment-meta-title');
            expect(sentimentMetaTitleDiv).toHaveTextContent("Burgers and Flame Grills | Steers South Africa");
            expect(sentimentMetaTitleDiv).toHaveTextContent("Flame");

            const sentimentMetaDescrDiv = screen.getByTestId('sentiment-meta-description');
            expect(sentimentMetaDescrDiv).toHaveTextContent("Nothing slaps more than 100% Flame-Grilled flavour. Steers South Africa is the takeaway restaurant of choice for burgers, chicken, ribs and hand-cut chips.");
            expect(sentimentMetaDescrDiv).toHaveTextContent("Nothing");
            expect(sentimentMetaDescrDiv).toHaveTextContent("slaps");
            expect(sentimentMetaDescrDiv).toHaveTextContent("100%");
            expect(sentimentMetaDescrDiv).toHaveTextContent("choice");
            expect(sentimentMetaDescrDiv).toHaveTextContent("burgers");
            expect(sentimentMetaDescrDiv).toHaveTextContent("chips");

            const sentimentMetaKeywordsDiv = screen.getByTestId('sentiment-meta-keywords');
            expect(sentimentMetaKeywordsDiv).toHaveTextContent("example, keywords");

            expect(screen.queryByTestId('sentiment-emotions-progress-charts')).not.toBeInTheDocument();
            expect(screen.queryByText('There is no emotions to display')).toBeInTheDocument();
        });
    });

    it('Sentiment Analysis: Metadata, positive and negative words and emotion graphs and NO donut chart displayed', async () => {
        (useScrapingContext as jest.Mock).mockReturnValueOnce({
            results: [
                {
                    ...mockResults[0],
                    sentiment: {
                        sentimentAnalysis: {
                            positive: 0,
                            negative: 0,
                            neutral: 0,
                        },
                        positiveWords: ['Flame', '100%', 'choice'],
                        negativeWords: ['Nothing', 'slaps'],
                        emotions: {
                            neutral: 0.88,
                            joy: 0.02,
                            surprise: 0.1,
                            anger: 0.01,
                            disgust: 0.2,
                            sadness: 0.003,
                            fear: 0.002,
                        },
                    },
                },
            ],
        });

        await act(async () => {
            render(<Results />);
        });

        const SentimentTab = screen.getByRole('tab', { name: /Sentiment Analysis/i });
        fireEvent.click(SentimentTab);

        await waitFor(() => {
            expect(screen.queryByTestId('sentiment-donut-chart')).not.toBeInTheDocument();
            expect(screen.queryByText('No sentiment analysis data to display')).toBeInTheDocument();

            const sentimentMetaTitleDiv = screen.getByTestId('sentiment-meta-title');
            expect(sentimentMetaTitleDiv).toHaveTextContent("Burgers and Flame Grills | Steers South Africa");
            expect(sentimentMetaTitleDiv).toHaveTextContent("Flame");

            const sentimentMetaDescrDiv = screen.getByTestId('sentiment-meta-description');
            expect(sentimentMetaDescrDiv).toHaveTextContent("Nothing slaps more than 100% Flame-Grilled flavour. Steers South Africa is the takeaway restaurant of choice for burgers, chicken, ribs and hand-cut chips.");
            expect(sentimentMetaDescrDiv).toHaveTextContent("Nothing");
            expect(sentimentMetaDescrDiv).toHaveTextContent("slaps");
            expect(sentimentMetaDescrDiv).toHaveTextContent("100%");
            expect(sentimentMetaDescrDiv).toHaveTextContent("choice");
            expect(sentimentMetaDescrDiv).toHaveTextContent("burgers");
            expect(sentimentMetaDescrDiv).toHaveTextContent("chips");

            const sentimentMetaKeywordsDiv = screen.getByTestId('sentiment-meta-keywords');
            expect(sentimentMetaKeywordsDiv).toHaveTextContent("example, keywords");

            expect(screen.getByTestId('sentiment-emotions-progress-charts')).toBeInTheDocument();
        });
    });

    it('Reputation Management: Social Media Engagement Metrics', async () => {
        (useScrapingContext as jest.Mock).mockReturnValueOnce({
            results: [
                {
                    ...mockResults[0],
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
                },
            ],
        });

        await act(async () => {
            render(<Results />);
        });

        const ORMTab = screen.getByRole('tab', { name: /Reputation Management/i });
        fireEvent.click(ORMTab);

        await waitFor(() => {
            expect(screen.queryByTestId('result-facebook-comment-count')?.textContent).toBe("714");
            expect(screen.queryByTestId('result-facebook-reaction-count')?.textContent).toBe("1905");
            expect(screen.queryByTestId('result-facebook-share-count')?.textContent).toBe("6631");
            expect(screen.queryByTestId('result-pintrest-pin-count')?.textContent).toBe("5");
        });
    });

    it('Reputation Management: Social Media Engagement Metrics Unavailable', async () => {
        (useScrapingContext as jest.Mock).mockReturnValueOnce({
            results: [
                {
                    ...mockResults[0],
                    shareCountdata: null,
                },
            ],
        });

        await act(async () => {
            render(<Results />);
        });

        const ORMTab = screen.getByRole('tab', { name: /Reputation Management/i });
        fireEvent.click(ORMTab);

        await waitFor(() => {
            expect(screen.getByText('No social media data is currently available')).toBeInTheDocument();
        });
    });

    it('Reputation Management: Reviews', async () => {
        (useScrapingContext as jest.Mock).mockReturnValueOnce({
            results: [
                {
                    ...mockResults[0],
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
                },
            ],
        });

        await act(async () => {
            render(<Results />);
        });

        const ORMTab = screen.getByRole('tab', { name: /Reputation Management/i });
        fireEvent.click(ORMTab);

        await waitFor(() => {
            expect(screen.queryByTestId('result-reviews-nps')?.textContent).toBe("-57");
            expect(screen.queryByTestId('result-reviews-number-reviews')?.textContent).toBe("6");
            expect(screen.queryByTestId('result-reviews-rating')?.textContent).toBe("1.65");
            expect(screen.queryByTestId('result-reviews-recommendation-status')?.textContent).toBe("");
            expect(screen.queryByTestId('result-reviews-trustindex')?.textContent).toBe("2.8");
        });
    });

    it('Reputation Management: Reviews Unavailable', async () => {
        (useScrapingContext as jest.Mock).mockReturnValueOnce({
            results: [
                {
                    ...mockResults[0],
                    reviews: null
                },
            ],
        });

        await act(async () => {
            render(<Results />);
        });

        const ORMTab = screen.getByRole('tab', { name: /Reputation Management/i });
        fireEvent.click(ORMTab);

        await waitFor(() => {
            expect(screen.getByText('There are no review data currently available')).toBeInTheDocument();
        });
    });

    it('Reputation Management: News', async () => {
        (useScrapingContext as jest.Mock).mockReturnValueOnce({
            results: [
                {
                    ...mockResults[0],
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
                },
            ],
        });

        await act(async () => {
            render(<Results />);
        });

        const ORMTab = screen.getByRole('tab', { name: /Reputation Management/i });
        fireEvent.click(ORMTab);

        await waitFor(() => {
            expect(screen.queryByTestId('donut-chart-news-sentiment')?.textContent).toBe("Average News Sentiment");

            expect(screen.getByText('Level up your Heritage Day with Nando’s tips for the perfect braai - CapeTown ETC')).toBeInTheDocument();
            expect(screen.getByText("Nando's Stick it out ad brings humour to South Africa's daily struggles - Bizcommunity.com")).toBeInTheDocument();
            expect(screen.getByText("South African restaurant Nando's Peri-Peri prepares for first Austin opening while eyeing expansion - The Business Journals")).toBeInTheDocument();
            expect(screen.getByText("The men behind Nando’s – South Africa’s global peri-peri chicken empire - BusinessTech")).toBeInTheDocument();
            expect(screen.getByText("Nando’s is SA’s official support group — and releases new dish to prove it - TimesLIVE")).toBeInTheDocument();
        });
    });

    it('Reputation Management: News Unavailable', async () => {
        (useScrapingContext as jest.Mock).mockReturnValueOnce({
            results: [
                {
                    ...mockResults[0],
                    scrapeNews: null
                },
            ],
        });

        await act(async () => {
            render(<Results />);
        });

        const ORMTab = screen.getByRole('tab', { name: /Reputation Management/i });
        fireEvent.click(ORMTab);

        await waitFor(() => {
            expect(screen.getByText('No news sentiment data is currently available')).toBeInTheDocument();
        });
    });

    it('should call jsPDF and download the PDF when download button is clicked', async () => {
        render(<Results />);

        // Ensure the component has rendered and the dropdown button is available
        const dropdownButton = screen.getByRole('button', { name: /export\/save/i });
        expect(dropdownButton).toBeInTheDocument();

        // Click the dropdown button to open the menu
        fireEvent.click(dropdownButton);

        // Wait for the download button to appear
        const downloadButton = await screen.findByTestId('download-report-button');
        expect(downloadButton).toBeInTheDocument();

        // Click the download button
        fireEvent.click(downloadButton);

        await waitFor(() => {
            // Ensure jsPDF was called
            expect(jsPDF).toHaveBeenCalled();

        });
    });

    it('should display a popup when the save button is clicked', async () => {
        render(<Results />);

        // Ensure the component has rendered and the dropdown button is available
        const dropdownButton = screen.getByRole('button', { name: /export\/save/i });
        expect(dropdownButton).toBeInTheDocument();

        // Click the dropdown button to open the menu
        fireEvent.click(dropdownButton);

        // Wait for the save button to appear
        const saveButton = await screen.findByTestId('save-report-button');
        expect(saveButton).toBeInTheDocument();

        // Click the save button
        fireEvent.click(saveButton);

        // wait for popup to appear
        const modal = await screen.findByTestId('save-report-modal');
        expect(modal).toBeInTheDocument();
    });

    it('should enter an error state if no report name is entered and save is clicked', async () => {
        render(<Results />);

        // Ensure the component has rendered and the dropdown button is available
        const dropdownButton = screen.getByRole('button', { name: /export\/save/i });
        expect(dropdownButton).toBeInTheDocument();

        // Click the dropdown button to open the menu
        fireEvent.click(dropdownButton);

        // Wait for the save button to appear
        const saveButton = await screen.findByTestId('save-report-button');
        expect(saveButton).toBeInTheDocument();

        // Click the save button
        fireEvent.click(saveButton);

        // wait for popup to appear
        const modal = await screen.findByTestId('save-report-modal');
        expect(modal).toBeInTheDocument();

        // Click the save button in the modal
        const saveModalButton = screen.getByRole('button', { name: /Save/i });
        expect(saveModalButton).toBeInTheDocument();
        fireEvent.click(saveModalButton);

        await waitFor(() => {
            expect(saveReport).not.toHaveBeenCalled();
        });

        // Ensure the error state is displayed in the Input component
        const inputWithError = screen.getByLabelText('Report Name', { invalid: true, disabled: true });
        expect(inputWithError).toBeInTheDocument();
    });

    it('should enter an error state if name is entered then removed', async () => {
        render(<Results />);

        // Ensure the component has rendered and the dropdown button is available
        const dropdownButton = screen.getByRole('button', { name: /export\/save/i });
        expect(dropdownButton).toBeInTheDocument();

        // Click the dropdown button to open the menu
        fireEvent.click(dropdownButton);

        // Wait for the save button to appear
        const saveButton = await screen.findByTestId('save-report-button');
        expect(saveButton).toBeInTheDocument();

        // Click the save button
        fireEvent.click(saveButton);

        // Wait for the modal to appear
        const modal = await screen.findByTestId('save-report-modal');
        expect(modal).toBeInTheDocument();

        // Enter a report name
        const reportNameInput = screen.getByLabelText(/Report Name/i);
        expect(reportNameInput).toBeInTheDocument();
        fireEvent.change(reportNameInput, { target: { value: 'Test Report' } });

        // Clear the report name
        fireEvent.change(reportNameInput, { target: { value: '' } });

        // Check if isInvalid and isDisabled are set to true
        expect(screen.getByLabelText('Report Name')).toHaveAttribute('aria-invalid', 'true');

        const confirmButton = screen.getByTestId('submit-report-name');
        expect(confirmButton).toBeInTheDocument();
        expect(confirmButton).toBeDisabled();
    });

    it('should enter an error state if invalid name is entered', async () => {
        render(<Results />);

        // Ensure the component has rendered and the dropdown button is available
        const dropdownButton = screen.getByRole('button', { name: /export\/save/i });
        expect(dropdownButton).toBeInTheDocument();

        // Click the dropdown button to open the menu
        fireEvent.click(dropdownButton);

        // Wait for the save button to appear
        const saveButton = await screen.findByTestId('save-report-button');
        expect(saveButton).toBeInTheDocument();

        // Click the save button
        fireEvent.click(saveButton);

        // Wait for the modal to appear
        const modal = await screen.findByTestId('save-report-modal');
        expect(modal).toBeInTheDocument();

        // Enter a report name
        const reportNameInput = screen.getByLabelText(/Report Name/i);
        expect(reportNameInput).toBeInTheDocument();
        fireEvent.change(reportNameInput, { target: { value: 'Here :)' } });

        fireEvent.click(screen.getByTestId('submit-report-name'));

        // Check if the input has entered an invalid state
        expect(reportNameInput).toHaveAttribute('aria-invalid', 'true');

        // Check if the correct error message is displayed
        const errorMessage = screen.getByText('Report name is invalid. Only letters, numbers, !?& are allowed.');
        expect(errorMessage).toBeInTheDocument();
    });


    it('should call the saveReport function when the save button is clicked', async () => {
        render(<Results />);

        // Ensure the component has rendered and the dropdown button is available
        const dropdownButton = screen.getByRole('button', { name: /export\/save/i });
        expect(dropdownButton).toBeInTheDocument();

        // Click the dropdown button to open the menu
        fireEvent.click(dropdownButton);

        // Wait for the save button to appear
        const saveButton = await screen.findByTestId('save-report-button');
        expect(saveButton).toBeInTheDocument();

        // Click the save button
        fireEvent.click(saveButton);

        // wait for popup to appear
        const modal = await screen.findByTestId('save-report-modal');
        expect(modal).toBeInTheDocument();

        // Enter a report name
        const reportNameInput = screen.getByLabelText(/Report Name/i);
        expect(reportNameInput).toBeInTheDocument();
        fireEvent.change(reportNameInput, { target: { value: 'Test Report' } });

        // Click the save button in the modal
        const saveModalButton = screen.getByRole('button', { name: /Save/i });
        expect(saveModalButton).toBeInTheDocument();
        fireEvent.click(saveModalButton);

        await waitFor(() => {
            expect(saveReport).toHaveBeenCalled();
        });
    });

    it('should display a success message when the report is saved successfully', async () => {
        render(<Results />);

        // Ensure the component has rendered and the dropdown button is available
        const dropdownButton = screen.getByRole('button', { name: /export\/save/i });
        expect(dropdownButton).toBeInTheDocument();

        // Click the dropdown button to open the menu
        fireEvent.click(dropdownButton);

        // Wait for the save button to appear
        const saveButton = await screen.findByTestId('save-report-button');
        expect(saveButton).toBeInTheDocument();

        // Click the save button
        fireEvent.click(saveButton);

        // wait for popup to appear
        const modal = await screen.findByTestId('save-report-modal');
        expect(modal).toBeInTheDocument();

        // Enter a report name
        const reportNameInput = screen.getByLabelText(/Report Name/i);
        expect(reportNameInput).toBeInTheDocument();
        fireEvent.change(reportNameInput, { target: { value: 'Test Report' } });

        // Click the save button in the modal
        const saveModalButton = screen.getByRole('button', { name: /Save/i });
        expect(saveModalButton).toBeInTheDocument();
        fireEvent.click(saveModalButton);

        await waitFor(() => {
            expect(screen.getByText('Report saved successfully')).toBeDefined();
        });
    });
});

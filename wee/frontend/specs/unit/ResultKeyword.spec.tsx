import React from 'react';
import { render, screen, act, waitFor, fireEvent } from '@testing-library/react';
import Results from '../../src/app/(pages)/results/page';
import { useSearchParams, useRouter } from 'next/navigation';
import { useScrapingContext } from '../../src/app/context/ScrapingContext'
import '@testing-library/jest-dom';
import { pollForKeyWordResult } from '../../src/app/services/PubSubService';
import { useUserContext } from '../../src/app/context/UserContext';
import jsPDF from 'jspdf';

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

jest.mock('react-apexcharts', () => () => null);

jest.mock('../../src/app/context/UserContext', () => ({
    useUserContext: jest.fn(),
}));

jest.mock('../../src/app/context/ScrapingContext', () => ({
    useScrapingContext: jest.fn(),
}));

// Mock fetch globally
global.fetch = jest.fn().mockResolvedValue({
    json: () => Promise.resolve({}), // Mock the json() method to return a Promise
    headers: { 'Content-Type': 'application/json' }, // Example headers
    ok: true, // Example ok status
    status: 200, // Example status code
});

jest.mock('../../src/app/services/PubSubService', () => ({
    pollForKeyWordResult: jest.fn()
}));

describe('Result SEO Keyword', () => {
    const mockPush = jest.fn();
    const mockBack = jest.fn();
    const mockSearchParams = new URLSearchParams('url=https%3A%2F%2Fwww.example.com');

    const mockKeywordAnalysis = {
        ranking: 3,
        recommendation: 'This is an example of keyword analysis recommendations',
    }

    const mockResults = [
        {
            url: 'https://www.example.com',
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
                    length: 80,
                    recommendations: "Title tag length should be between 50 and 60 characters.",
                    titleTag: "South African Online Computer Store",
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
                    isUrlWordsInDescription: false,
                    length: 88,
                    metaDescription: "Buy computers, hardware, software, laptops & more from South Africa's best online store.",
                    recommendations: 'Meta description length should be between 120 and 160 characters. Consider including words from the URL in the meta description: wootware.',
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
            }
        },
    ];

    const mockUser = {
        uuid: '48787157-7555-4104-bafc-e2c95bbaa959',
        emailVerified: true,
    };

    beforeEach(() => {        
        // (useSearchParams as jest.Mock).mockReturnValue([mockSearchParams, jest.fn()]);
        (useSearchParams as jest.Mock).mockReturnValue({
            get: (key: string) => mockSearchParams.get(key),
        });
        (useRouter as jest.Mock).mockReturnValue({ push: mockPush, back: mockBack });
        (useScrapingContext as jest.Mock).mockReturnValue({
            results: mockResults,
            setResults: jest.fn(),
            errorResults: [],
            setErrorResults: jest.fn(),
            urls: [],
            setUrls: jest.fn(),
            summaryReport: '',
            setSummaryReport: jest.fn(),
            processedUrls: [],
            setProcessedUrls: jest.fn(),
            processingUrls: [],
            setProcessingUrls: jest.fn(),
        });
        (useUserContext as jest.Mock).mockReturnValue({ user: mockUser });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('Keyword SEO: input box - url not valid', async () => {
        const validUrl = 'https://www.example3.com';
        (useSearchParams as jest.Mock).mockReturnValue({
            get: jest.fn().mockReturnValue(encodeURIComponent(validUrl)),
        });    
        
        (useScrapingContext as jest.Mock).mockReturnValue({
            processedUrls: ['https://www.example.com', 'https://www.example2.com'],
            results: mockResults,
        });

        await act(async () => {
            render(<Results />);
        });

        const SEOTab = screen.getByRole('tab', { name: /SEO Analysis/i });
        fireEvent.click(SEOTab);

        const keywordInput = screen.getByTestId('keyword-input');
        fireEvent.change(keywordInput, { target: { value: '' } });

        fireEvent.click(screen.getByTestId('btn-seo-keyword'));

        await waitFor(() => {
            const errorMessage = screen.queryByTestId('keyword-error');
            expect(errorMessage).toBeInTheDocument();
            expect(errorMessage).toHaveTextContent('URL is not valid');
        });

        await act(async () => {
            await new Promise((r) => setTimeout(r, 3000));
        });
    
        await waitFor(() => {
            expect(screen.queryByText('URL is not valid')).toBeNull();
        });
    });

    it('Keyword SEO: input box - keyword - should not be empty', async () => {
        const validUrl = 'https://www.example.com';
        (useSearchParams as jest.Mock).mockReturnValue({
            get: jest.fn().mockReturnValue(encodeURIComponent(validUrl)),
        });    
        
        (useScrapingContext as jest.Mock).mockReturnValue({
            processedUrls: [validUrl, 'https://www.example2.com'],
            results: mockResults,
        });

        await act(async () => {
            render(<Results />);
        });

        const SEOTab = screen.getByRole('tab', { name: /SEO Analysis/i });
        fireEvent.click(SEOTab);

        const keywordInput = screen.getByTestId('keyword-input');
        fireEvent.change(keywordInput, { target: { value: '' } });

        fireEvent.click(screen.getByTestId('btn-seo-keyword'));

        await waitFor(() => {
            const errorMessage = screen.queryByTestId('keyword-error');
            expect(errorMessage).toBeInTheDocument();
            expect(errorMessage).toHaveTextContent('Keyword cannot be empty');
        });

        await act(async () => {
            await new Promise((r) => setTimeout(r, 3000));
        });
    
        await waitFor(() => {
            expect(screen.queryByText('Keyword cannot be empty')).toBeNull();
        });
    });

    it('Keyword SEO: input box - invalid input', async () => {
        const validUrl = 'https://www.example.com';
        (useSearchParams as jest.Mock).mockReturnValue({
            get: jest.fn().mockReturnValue(encodeURIComponent(validUrl)),
        });    
        
        (useScrapingContext as jest.Mock).mockReturnValue({
            processedUrls: [validUrl, 'https://www.example2.com'],
            results: mockResults,
        });

        await act(async () => {
            render(<Results />);
        });

        const SEOTab = screen.getByRole('tab', { name: /SEO Analysis/i });
        fireEvent.click(SEOTab);

        const keywordInput = screen.getByTestId('keyword-input');
        fireEvent.change(keywordInput, { target: { value: '<keyword)' } });

        fireEvent.click(screen.getByTestId('btn-seo-keyword'));

        await waitFor(() => {
            const errorMessage = screen.queryByTestId('keyword-error');
            expect(errorMessage).toBeInTheDocument();
            expect(errorMessage).toHaveTextContent('Keywords cannot contain special characters like <, >, ", \', `, ;, (, or )');
        });

        await act(async () => {
            await new Promise((r) => setTimeout(r, 3000));
        });
    
        await waitFor(() => {
            expect(screen.queryByText('Keywords cannot contain special characters like <, >, ", \', `, ;, (, or )')).toBeNull();
        });
    });
});
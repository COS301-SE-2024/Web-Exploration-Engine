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
                title: 'Example Title',
                description: 'Example Description',
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
            seoAnalysis: {
                // XMLSitemapAnalysis: {},
                // canonicalTagAnalysis: {},
                headingAnalysis: {
                    count: 2,
                    headings: ['HeadingOne', 'HeadingTwo'],
                    recommendations: '',
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
                // indexabilityAnalysis: {},
                internalLinksAnalysis: {
                    recommendations: 'This is the internal linking recommendation',
                    totalLinks: 17,
                    uniqueLinks: 9,
                },
                metaDescriptionAnalysis: {
                    length: 80,
                    recommendations: "Title tag length should be between 50 and 60 characters.",
                    titleTag: "South African Online Computer Store",
                },
                // mobileFriendlinessAnalysis: {},
                // structuredDataAnalysis: {},
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
        (useSearchParams as jest.Mock).mockReturnValue(new URLSearchParams(`url=${mockUrl}`));
        (useRouter as jest.Mock).mockReturnValue({ push: mockPush, back: mockBack });
        (useScrapingContext as jest.Mock).mockReturnValue({ results: mockResults });
        (useUserContext as jest.Mock).mockReturnValue({ user: mockUser });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should display website status, crawlable status, industry classification, and domain classification', async () => {
        await act(async () => {
            render(<Results />);
        });

        await waitFor(() => {
            expect(screen.queryByText('Yes')).toBeDefined();
            expect(screen.queryByText('Live')).toBeDefined();
            expect(screen.queryByText('E-commerce - 95')).toBeDefined();
            expect(screen.queryByText('Retail - 90')).toBeDefined();
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

    it('Onpage SEO: Meta Description - display title tag, length and recommendation', async () => {
        await act(async () => {
            render(<Results />);
        });

        const SEOTab = screen.getByRole('tab', { name: /SEO Analysis/i });
        fireEvent.click(SEOTab);

        await waitFor(() => {
            expect(screen.getByText(mockResults[0].seoAnalysis.metaDescriptionAnalysis.titleTag)).toBeDefined();
            expect(screen.getByText(mockResults[0].seoAnalysis.metaDescriptionAnalysis.length)).toBeDefined();
            expect(screen.queryByTestId('meta_recommendations')).toBeInTheDocument();
            expect(screen.getByText(mockResults[0].seoAnalysis.metaDescriptionAnalysis.recommendations)).toBeDefined();
        });
    });

    it('Onpage SEO: Meta Description - display title tag, length and NO recommendation', async () => {
        (useScrapingContext as jest.Mock).mockReturnValueOnce({
            results: [
                {
                    ...mockResults[0],
                    seoAnalysis: {
                        ...mockResults[0].seoAnalysis,
                        metaDescriptionAnalysis: {
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
            expect(screen.getByText(mockResults[0].seoAnalysis.metaDescriptionAnalysis.titleTag)).toBeDefined();
            expect(screen.getByText('55')).toBeDefined();
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
            expect(screen.queryByTestId('images_recommendations')).not.toBeInTheDocument();
        });
    });

    it('Onpage SEO: Title Tags - metadata description, length, is url in description and recommendation', async () => {
        await act(async () => {
            render(<Results />);
        });

        const SEOTab = screen.getByRole('tab', { name: /SEO Analysis/i });
        fireEvent.click(SEOTab);

        await waitFor(() => {
            expect(screen.getByText(mockResults[0].seoAnalysis.titleTagsAnalysis.metaDescription)).toBeDefined();
            expect(screen.getByText(mockResults[0].seoAnalysis.titleTagsAnalysis.length)).toBeDefined();
            expect(screen.getByText('No')).toBeDefined();
            expect(screen.queryByTestId('titleTag_recommendations')).toBeInTheDocument();
            expect(screen.getByText(mockResults[0].seoAnalysis.titleTagsAnalysis.recommendations)).toBeDefined();
        });
    });

    it('Onpage SEO: Title Tags - metadata description, length, is url in description and NO recommendation', async () => {
        (useScrapingContext as jest.Mock).mockReturnValueOnce({
            results: [
                {
                    ...mockResults[0],
                    seoAnalysis: {
                        ...mockResults[0].seoAnalysis,
                        titleTagsAnalysis: {
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
            expect(screen.getByText('Yes')).toBeDefined();
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

import React from 'react';
import { render, screen, act, waitFor, fireEvent } from '@testing-library/react';
import Results from '../../src/app/(pages)/results/page'; 
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import {useScrapingContext} from '../../src/app/context/ScrapingContext'
import jsPDF from 'jspdf'; 
import '@testing-library/jest-dom';

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
  
  
jest.mock('frontend/src/app/context/ScrapingContext', () => ({
    useScrapingContext: jest.fn(),
}));

describe('Results Component', () => {
    const mockUrl = 'https://www.example.com';
    const mockPush = jest.fn();

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
            }
        },
    ];

    beforeEach(() => {
        (useSearchParams as jest.Mock).mockReturnValue(new URLSearchParams(`url=${mockUrl}`));   
        (useRouter as jest.Mock).mockReturnValue({ push: mockPush });   
        (useScrapingContext as jest.Mock).mockReturnValue({ results: mockResults }); 
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

        expect(mockPush).toHaveBeenCalledWith('/scraperesults');
    });

    it('should set crawlable status to No when an error response is returned', async () => {
        (useScrapingContext as jest.Mock).mockReturnValueOnce({
            results: [
                {
                    ...mockResults[0],
                    robots: { errorStatus: 404, errorCode: 'Not Found', errorMessage: 'Page not found'},
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

        await waitFor(() => {
            expect(screen.getAllByAltText('Image').length).toBe(mockResults[0].images.length);
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
      

});
 
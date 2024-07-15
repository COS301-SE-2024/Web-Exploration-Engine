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
        },
    ];

    const mockUser = {
        uuid: '48787157-7555-4104-bafc-e2c95bbaa959',
        emailVerified: true,
    };

    beforeEach(() => {
        (useSearchParams as jest.Mock).mockReturnValue(new URLSearchParams(`url=${mockUrl}`));   
        (useRouter as jest.Mock).mockReturnValue({ push: mockPush, back: mockBack});   
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
        const inputWithError = screen.getByLabelText('Report Name', { invalid: true, disabled: true});
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
 
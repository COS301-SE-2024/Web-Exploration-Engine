import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import Home from '../../src/app/(pages)/page';
import { useRouter } from 'next/navigation';
import { useScrapingContext } from 'frontend/src/app/context/ScrapingContext';

// Mock the useRouter hook
jest.mock('next/navigation', () => ({
    useRouter: jest.fn(),
}));

jest.mock('frontend/src/app/context/ScrapingContext', () => ({
    useScrapingContext: jest.fn(),
}));

jest.useFakeTimers();

describe('Home Component', () => {
    const mockUrls = ['https://www.example.com', 'https://www.example2.com'];
    const mockPush = jest.fn();

    beforeEach(() => {
        (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
        (useScrapingContext as jest.Mock).mockReturnValue({ urls: mockUrls }); 
    });

    it('should display error message when URL is empty', () => {
        render(<Home />);

        const button = screen.getByRole('button', { name: /Start scraping/i });
        fireEvent.click(button);

        expect(screen.getByText('URL cannot be empty')).toBeDefined();
    });

    it('should display error message when URL is invalid', () => {
        render(<Home />);

        const input = screen.getByPlaceholderText('Enter the URLs you want to scrape comma seperated');
        const button = screen.getByRole('button', { name: /Start scraping/i });

        fireEvent.change(input, { target: { value: 'invalid-url' } });
        fireEvent.click(button);

        expect(screen.queryByText('Please enter a valid URL')).toBeDefined();
    });

    it('should navigate to results page with valid URL', () => {
        const mockSetUrls = jest.fn();
        const mockRouterPush = jest.fn();
        const mockSetError = jest.fn();

        (useScrapingContext as jest.Mock).mockReturnValue({
            setUrls: mockSetUrls,
        });

        (useRouter as jest.Mock).mockReturnValue({ push: mockRouterPush });

        render(<Home />);

        const textarea = screen.getByTestId('scraping-textarea-home');
        fireEvent.change(textarea, { target: { value: 'https://www.example.com' } });

        const button = screen.getByRole('button', { name: /Start scraping/i });
        fireEvent.click(button);

        expect(mockSetUrls).toHaveBeenCalledWith(['https://www.example.com']);

        expect(mockRouterPush).toHaveBeenCalledWith('/scraperesults');

        expect(mockSetError).not.toHaveBeenCalled();
    });

    it('should clear error message after 3 seconds', () => {
        render(<Home />);

        const input = screen.getByPlaceholderText('Enter the URLs you want to scrape comma seperated');
        const button = screen.getByRole('button', { name: /Start scraping/i });

        fireEvent.change(input, { target: { value: 'invalid-url' } });
        fireEvent.click(button);

        expect(screen.queryByText('Please enter a valid URL')).toBeDefined();

        act(() => {
            jest.advanceTimersByTime(3000);
        });

        expect(screen.queryByText('Please enter a valid URL')).toBeNull();
    });
});

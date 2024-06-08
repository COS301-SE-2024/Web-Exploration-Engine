import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Home from '../../src/app/(pages)/page';
import { useRouter } from 'next/navigation';

// Mock the useRouter hook
jest.mock('next/navigation', () => ({
    useRouter: jest.fn(),
}));

describe('Home Component', () => {
    it('should display error message when URL is empty', () => {
        render(<Home />);

        const button = screen.getByRole('button', { name: /Start scraping/i });
        fireEvent.click(button);

        expect(screen.getByText('URL cannot be empty')).toBeDefined();
    });

    // it('should display error message when URL is invalid', () => {
    //     render(<Home />);

    //     const input = screen.getByPlaceholderText('https://www.takealot.com/');
    //     const button = screen.getByRole('button', { name: /Start scraping/i });

    //     fireEvent.change(input, { target: { value: 'invalid-url' } });
    //     fireEvent.click(button);

    //     expect(screen.getByText('Please enter a valid URL')).toBeDefined();
    // });

    // it('should navigate to results page with valid URL', () => {
    //     const push = jest.fn();
    //     (useRouter as jest.Mock).mockReturnValue({ push });

    //     render(<Home />);

    //     const input = screen.getByPlaceholderText('https://www.takealot.com/');
    //     const button = screen.getByRole('button', { name: /Start scraping/i });

    //     fireEvent.change(input, { target: { value: 'https://www.example.com' } });
    //     fireEvent.click(button);

    //     expect(push).toHaveBeenCalledWith('/results?url=https%3A%2F%2Fwww.example.com');
    // });
});

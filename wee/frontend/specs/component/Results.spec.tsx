import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import Results from '../../src/app/(pages)/results/page'; // Adjust the import according to your file structure
import { useSearchParams } from 'next/navigation';

// Mock the useSearchParams hook
jest.mock('next/navigation', () => ({
    useSearchParams: jest.fn(),
}));

// Mock the fetch API
global.fetch = jest.fn();

describe('Results Component', () => {
    const mockUrl = 'https://www.example.com';
    const mockResponse = {
        json: jest.fn().mockResolvedValue(true),
    };

    beforeEach(() => {
        (useSearchParams as jest.Mock).mockReturnValue(new URLSearchParams(`url=${mockUrl}`));
        (fetch as jest.Mock).mockResolvedValue(mockResponse);
    });

    it('should fetch and display website status', async () => {
        await act(async () => {
            render(<Results />);
        });

        await waitFor(() => expect(fetch).toHaveBeenCalledWith(`http://localhost:3000/api/status?url=${encodeURIComponent(mockUrl)}`));
        
        await waitFor(() => expect(screen.getByText('Live')).toBeDefined());
    });
});

import React from 'react';
import { render, screen } from '@testing-library/react';
import { useTheme } from 'next-themes';
import { RadarChart } from "frontend/src/app/components/Graphs/RadarChart";
import '@testing-library/jest-dom';

jest.mock('next-themes', () => ({
    useTheme: jest.fn(),
}));

jest.mock('next/dynamic', () => {
    return jest.fn().mockImplementation(() => (props) => <div role="presentation" {...props} />);
});

const mockUseTheme = useTheme as jest.Mock;

describe('RadarChart', () => {
    beforeEach(() => {
        mockUseTheme.mockReset();
        mockUseTheme.mockReturnValue({ theme: 'light' });
    });

    const radarCategories = ['Category1', 'Category2', 'Category3'];
    const radarSeries = [{ name: 'Series1', data: [10, 20, 30] }];

    it('renders correctly with light theme', () => {
        render(<RadarChart radarCategories={radarCategories} radarSeries={radarSeries} />);

        expect(screen.getByRole('presentation')).toBeInTheDocument();
    });

    it('renders correctly with dark theme', () => {
        mockUseTheme.mockReturnValue({ theme: 'dark' });

        render(<RadarChart radarCategories={radarCategories} radarSeries={radarSeries} />);

        expect(screen.getByRole('presentation')).toBeInTheDocument();
    });

    it('updates options when theme changes', () => {
        const { rerender } = render(
            <RadarChart radarCategories={radarCategories} radarSeries={radarSeries} />
        );

        mockUseTheme.mockReturnValue({ theme: 'light' });
        rerender(<RadarChart radarCategories={radarCategories} radarSeries={radarSeries} />);

        expect(screen.getByRole('presentation')).toBeInTheDocument();

        mockUseTheme.mockReturnValue({ theme: 'dark' });
        rerender(<RadarChart radarCategories={radarCategories} radarSeries={radarSeries} />);

        expect(screen.getByRole('presentation')).toBeInTheDocument();
    });
});

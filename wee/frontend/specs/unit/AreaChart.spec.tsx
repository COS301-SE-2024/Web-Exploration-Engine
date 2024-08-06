import React from 'react';
import { render, screen } from '@testing-library/react';
import { useTheme } from 'next-themes';
import { AreaChart } from '../../src/app/components/Graphs/AreaChart';
import '@testing-library/jest-dom';

jest.mock('next-themes', () => ({
    useTheme: jest.fn(),
}));

jest.mock('next/dynamic', () => {
    const MockChart = (props) => <div role="presentation" {...props} />;
    return jest.fn().mockImplementation(() => MockChart);
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
        render(<AreaChart areaCategories={radarCategories} areaSeries={radarSeries} />);

        expect(screen.getByRole('presentation')).toBeInTheDocument();
    });

    it('renders correctly with dark theme', () => {
        mockUseTheme.mockReturnValue({ theme: 'dark' });

        render(<AreaChart areaCategories={radarCategories} areaSeries={radarSeries} />);

        expect(screen.getByRole('presentation')).toBeInTheDocument();
    });

    it('updates options when theme changes', () => {
        const { rerender } = render(
            <AreaChart areaCategories={radarCategories} areaSeries={radarSeries} />
        );

        mockUseTheme.mockReturnValue({ theme: 'light' });
        rerender(<AreaChart areaCategories={radarCategories} areaSeries={radarSeries} />);

        expect(screen.getByRole('presentation')).toBeInTheDocument();

        mockUseTheme.mockReturnValue({ theme: 'dark' });
        rerender(<AreaChart areaCategories={radarCategories} areaSeries={radarSeries} />);

        expect(screen.getByRole('presentation')).toBeInTheDocument();
    });
});

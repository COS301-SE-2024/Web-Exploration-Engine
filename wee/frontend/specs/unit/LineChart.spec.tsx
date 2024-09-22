import React from 'react';
import { render, screen } from '@testing-library/react';
import { useTheme } from 'next-themes';
import { LineChart } from '../../src/app/components/Graphs/LineChart';
import { LineChartCustomAxis } from '../../src/app/components/Graphs/LineChart';
import '@testing-library/jest-dom';

jest.mock('next-themes', () => ({
    useTheme: jest.fn(),
}));

jest.mock('next/dynamic', () => {
    const MockChart = (props) => <div role="presentation" {...props} />;
    return jest.fn().mockImplementation(() => MockChart);
});

const mockUseTheme = useTheme as jest.Mock;

describe('LineChart', () => {
    beforeEach(() => {
        mockUseTheme.mockReset();
        mockUseTheme.mockReturnValue({ theme: 'light' });
    });

    const radarCategories = ['Category1', 'Category2', 'Category3'];
    const radarSeries = [{ name: 'Series1', data: [10, 20, 30] }];

    it('renders correctly with light theme', () => {
        render(<LineChart areaCategories={radarCategories} areaSeries={radarSeries} />);

        expect(screen.getByRole('presentation')).toBeInTheDocument();
    });

    it('renders correctly with dark theme', () => {
        mockUseTheme.mockReturnValue({ theme: 'dark' });

        render(<LineChart areaCategories={radarCategories} areaSeries={radarSeries} />);

        expect(screen.getByRole('presentation')).toBeInTheDocument();
    });

    it('updates options when theme changes', () => {
        const { rerender } = render(
            <LineChart areaCategories={radarCategories} areaSeries={radarSeries} />
        );

        mockUseTheme.mockReturnValue({ theme: 'light' });
        rerender(<LineChart areaCategories={radarCategories} areaSeries={radarSeries} />);

        expect(screen.getByRole('presentation')).toBeInTheDocument();

        mockUseTheme.mockReturnValue({ theme: 'dark' });
        rerender(<LineChart areaCategories={radarCategories} areaSeries={radarSeries} />);

        expect(screen.getByRole('presentation')).toBeInTheDocument();
    });
});

describe('LineChartCustomAxis', () => {
    beforeEach(() => {
        mockUseTheme.mockReset();
        mockUseTheme.mockReturnValue({ theme: 'light' });
    });

    const radarCategories = ['Category1', 'Category2', 'Category3'];
    const radarSeries = [{ name: 'Series1', data: [10, 20, 30] }];

    it('renders correctly with light theme', () => {
        render(<LineChartCustomAxis areaCategories={radarCategories} areaSeries={radarSeries} />);

        expect(screen.getByRole('presentation')).toBeInTheDocument();
    });

    it('renders correctly with dark theme', () => {
        mockUseTheme.mockReturnValue({ theme: 'dark' });

        render(<LineChartCustomAxis areaCategories={radarCategories} areaSeries={radarSeries} />);

        expect(screen.getByRole('presentation')).toBeInTheDocument();
    });

    it('updates options when theme changes', () => {
        const { rerender } = render(
            <LineChartCustomAxis areaCategories={radarCategories} areaSeries={radarSeries} />
        );

        mockUseTheme.mockReturnValue({ theme: 'light' });
        rerender(<LineChartCustomAxis areaCategories={radarCategories} areaSeries={radarSeries} />);

        expect(screen.getByRole('presentation')).toBeInTheDocument();

        mockUseTheme.mockReturnValue({ theme: 'dark' });
        rerender(<LineChartCustomAxis areaCategories={radarCategories} areaSeries={radarSeries} />);

        expect(screen.getByRole('presentation')).toBeInTheDocument();
    });
});
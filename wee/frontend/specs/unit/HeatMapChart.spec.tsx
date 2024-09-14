import React from 'react';
import { render, screen } from '@testing-library/react';
import { useTheme } from 'next-themes';
import { HeatMapChart } from '../../src/app/components/Graphs/HeatMapChart';
import '@testing-library/jest-dom';

jest.mock('next-themes', () => ({
    useTheme: jest.fn(),
}));

jest.mock('next/dynamic', () => {
    const MockChart = (props) => <div role="presentation" {...props} />;
    return jest.fn().mockImplementation(() => MockChart);
});

const mockUseTheme = useTheme as jest.Mock;

describe('HeatMapChart', () => {
    beforeEach(() => {
        mockUseTheme.mockReset();
        mockUseTheme.mockReturnValue({ theme: 'light' });
    });

    it('renders correctly with light theme', () => {
        render(<HeatMapChart dataLabel={['Label1', 'Label2']} dataSeries={[10, 20]} />);

        expect(screen.getByRole('presentation')).toBeInTheDocument();
    });

    it('renders correctly with dark theme', () => {
        mockUseTheme.mockReturnValue({ theme: 'dark' });

        render(<HeatMapChart dataLabel={['Label1', 'Label2']} dataSeries={[10, 20]} />);

        expect(screen.getByRole('presentation')).toBeInTheDocument();
    });

    it('updates options when theme changes', () => {
        const { rerender } = render(
            <HeatMapChart dataLabel={['Label1', 'Label2']} dataSeries={[10, 20]} />
        );

        mockUseTheme.mockReturnValue({ theme: 'light' });
        rerender(<HeatMapChart dataLabel={['Label1', 'Label2']} dataSeries={[10, 20]} />);
        expect(screen.getByRole('presentation')).toBeInTheDocument();

        mockUseTheme.mockReturnValue({ theme: 'dark' });
        rerender(<HeatMapChart dataLabel={['Label1', 'Label2']} dataSeries={[10, 20]} />);

        expect(screen.getByRole('presentation')).toBeInTheDocument();
    });
});
import React from 'react';
import { render, screen } from '@testing-library/react';
import { useTheme } from 'next-themes';
import { BarChart } from '../../src/app/components/Graphs';
import '@testing-library/jest-dom';

jest.mock('next-themes', () => ({
    useTheme: jest.fn(),
}));

jest.mock('next/dynamic', () => {
    const MockChart = (props) => <div role="presentation" {...props} />;
    return jest.fn().mockImplementation(() => MockChart);
});

const mockUseTheme = useTheme as jest.Mock;

describe('BarChart', () => {
    beforeEach(() => {
        mockUseTheme.mockReset();
        mockUseTheme.mockReturnValue({ theme: 'light' });
    });

    it('renders correctly with light theme', () => {
        render(<BarChart dataLabel={['Label1', 'Label2']} dataSeries={[10, 20]} />);

        expect(screen.getByRole('presentation')).toBeInTheDocument();
    });

    it('renders correctly with dark theme', () => {
        mockUseTheme.mockReturnValue({ theme: 'dark' });

        render(<BarChart dataLabel={['Label1', 'Label2']} dataSeries={[10, 20]} />);

        expect(screen.getByRole('presentation')).toBeInTheDocument();
    });

    it('updates options when theme changes', () => {
        const { rerender } = render(
            <BarChart dataLabel={['Label1', 'Label2']} dataSeries={[10, 20]} />
        );

        mockUseTheme.mockReturnValue({ theme: 'light' });
        rerender(<BarChart dataLabel={['Label1', 'Label2']} dataSeries={[10, 20]} />);
        expect(screen.getByRole('presentation')).toBeInTheDocument();

        mockUseTheme.mockReturnValue({ theme: 'dark' });
        rerender(<BarChart dataLabel={['Label1', 'Label2']} dataSeries={[10, 20]} />);

        expect(screen.getByRole('presentation')).toBeInTheDocument();
    });
});
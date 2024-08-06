import React from 'react';
import { render, screen } from '@testing-library/react';
import { useTheme } from 'next-themes';
import { DonutChart } from '../../src/app/components/Graphs/DonutChart';
import '@testing-library/jest-dom';

jest.mock('next-themes', () => ({
    useTheme: jest.fn(),
}));

jest.mock('next/dynamic', () => {
    const MockChart = (props) => <div role="presentation" {...props} />;
    return jest.fn().mockImplementation(() => MockChart);
});

const mockUseTheme = useTheme as jest.Mock;

describe('DonutChart', () => {
    beforeEach(() => {
        mockUseTheme.mockReset();
        mockUseTheme.mockReturnValue({ theme: 'light' });
    });

    it('renders correctly with light theme', () => {
        render(<DonutChart dataLabel={['Label1', 'Label2']} dataSeries={[10, 90]} legendPosition='right' />);

        expect(screen.getByRole('presentation')).toBeInTheDocument();
    });

    it('renders correctly with dark theme', () => {
        mockUseTheme.mockReturnValue({ theme: 'dark' });

        render(<DonutChart dataLabel={['Label1', 'Label2']} dataSeries={[10, 90]} legendPosition='right' />);

        expect(screen.getByRole('presentation')).toBeInTheDocument();
    });

    it('updates options when theme changes', () => {
        const { rerender } = render(
            <DonutChart dataLabel={['Label1', 'Label2']} dataSeries={[10, 90]} legendPosition='right' />
        );

        mockUseTheme.mockReturnValue({ theme: 'light' });
        rerender(<DonutChart dataLabel={['Label1', 'Label2']} dataSeries={[10, 90]} legendPosition='right' />);
        expect(screen.getByRole('presentation')).toBeInTheDocument();


        mockUseTheme.mockReturnValue({ theme: 'dark' });
        rerender(<DonutChart dataLabel={['Label1', 'Label2']} dataSeries={[10, 90]} legendPosition='right' />);

        expect(screen.getByRole('presentation')).toBeInTheDocument();
    });
});
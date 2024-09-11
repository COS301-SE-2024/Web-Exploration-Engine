import React from 'react';
import { render, screen } from '@testing-library/react';
import { useTheme } from 'next-themes';
import { StackedColumnChart } from '../../src/app/components/Graphs/StackedColumnChart';
import '@testing-library/jest-dom';

jest.mock('next-themes', () => ({
    useTheme: jest.fn(),
}));

jest.mock('next/dynamic', () => {
    const MockChart = (props) => <div role="presentation" {...props} />;
    return jest.fn().mockImplementation(() => MockChart);
});

const mockUseTheme = useTheme as jest.Mock;

describe('StackedColumnChart', () => {
    beforeEach(() => {
        mockUseTheme.mockReset();
        mockUseTheme.mockReturnValue({ theme: 'light' });
    });

    it('renders correctly with light theme', () => {
        render(<StackedColumnChart 
            dataLabel={['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']} 
            dataSeries={[
            {
                name: '1 Star',
                data: [32, 38, 44, 50, 62, 88]
            },
            {
                name: '2 Stars',
                data: [25, 30, 48, 50, 73, 80]
            },
            {
                name: '3 Stars',
                data: [18, 22, 28, 35, 42, 50]
            },
            {
                name: '4 Stars',
                data: [40, 45, 50, 77, 90, 120]
            },
            {
                name: '5 Stars',
                data: [55, 63, 77, 89, 90, 111]
            }]} 
        />);

        expect(screen.getByRole('presentation')).toBeInTheDocument();
    });

    it('renders correctly with dark theme', () => {
        mockUseTheme.mockReturnValue({ theme: 'dark' });

        render(<StackedColumnChart 
            dataLabel={['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']} 
            dataSeries={[
            {
                name: '1 Star',
                data: [32, 38, 44, 50, 62, 88]
            },
            {
                name: '2 Stars',
                data: [25, 30, 48, 50, 73, 80]
            },
            {
                name: '3 Stars',
                data: [18, 22, 28, 35, 42, 50]
            },
            {
                name: '4 Stars',
                data: [40, 45, 50, 77, 90, 120]
            },
            {
                name: '5 Stars',
                data: [55, 63, 77, 89, 90, 111]
            }]} 
        />);

        expect(screen.getByRole('presentation')).toBeInTheDocument();
    });

    it('updates options when theme changes', () => {
        const { rerender } = render(
            <StackedColumnChart dataLabel={['Label1', 'Label2']} dataSeries={[10, 20]} />
        );

        mockUseTheme.mockReturnValue({ theme: 'light' });
        rerender(<StackedColumnChart dataLabel={['Label1', 'Label2']} dataSeries={[10, 20]} />);
        expect(screen.getByRole('presentation')).toBeInTheDocument();


        mockUseTheme.mockReturnValue({ theme: 'dark' });
        rerender(<StackedColumnChart dataLabel={['Label1', 'Label2']} dataSeries={[10, 20]} />);

        expect(screen.getByRole('presentation')).toBeInTheDocument();
    });
});
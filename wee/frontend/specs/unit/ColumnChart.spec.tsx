import React from 'react';
import { render, screen } from '@testing-library/react';
import { useTheme } from 'next-themes';
import { ColumnChart } from "frontend/src/app/components/Graphs/ColumnChart";
import '@testing-library/jest-dom';

jest.mock('next-themes', () => ({
    useTheme: jest.fn(),
}));

jest.mock('next/dynamic', () => {
    return jest.fn().mockImplementation(() => (props) => <div role="presentation" {...props} />);
});

const mockUseTheme = useTheme as jest.Mock;

describe('ColumnChart', () => {
    beforeEach(() => {
        mockUseTheme.mockReset();
        mockUseTheme.mockReturnValue({ theme: 'light' });
    });

    it('renders correctly with light theme', () => {
        render(<ColumnChart dataLabel={['Label1', 'Label2']} dataSeries={[10, 20]} />);

        expect(screen.getByRole('presentation')).toBeInTheDocument();
    });

    it('renders correctly with dark theme', () => {
        mockUseTheme.mockReturnValue({ theme: 'dark' });

        render(<ColumnChart dataLabel={['Label1', 'Label2']} dataSeries={[10, 20]} />);

        expect(screen.getByRole('presentation')).toBeInTheDocument();
    });

    it('updates options when theme changes', () => {
        const { rerender } = render(
            <ColumnChart dataLabel={['Label1', 'Label2']} dataSeries={[10, 20]} />
        );

        mockUseTheme.mockReturnValue({ theme: 'light' });
        rerender(<ColumnChart dataLabel={['Label1', 'Label2']} dataSeries={[10, 20]} />);
        expect(screen.getByRole('presentation')).toBeInTheDocument();


        mockUseTheme.mockReturnValue({ theme: 'dark' });
        rerender(<ColumnChart dataLabel={['Label1', 'Label2']} dataSeries={[10, 20]} />);

        expect(screen.getByRole('presentation')).toBeInTheDocument();
    });
});

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Home from '../../src/app/(pages)/page';
import { useRouter } from 'next/navigation';
import { useScrapingContext } from '../../src/app/context/ScrapingContext'

jest.mock('next/navigation', () => ({
  useSearchParams: jest.fn(),
  useRouter: jest.fn(),
}));

jest.mock('../../src/app/context/ScrapingContext', () => ({
  useScrapingContext: jest.fn(),
}));

const mockSetUrls = jest.fn();
const mockSetProcessedUrls = jest.fn();
const mockSetProcessingUrls = jest.fn();
const mockSetResults = jest.fn();
const mockSetSummaryReport = jest.fn();
const mockSetErrorResults = jest.fn();

describe('Home page', () => {
  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({
      push: jest.fn(),
    });

    (useScrapingContext as jest.Mock).mockReturnValue({
      setUrls: mockSetUrls,
      setProcessedUrls: mockSetProcessedUrls,
      setProcessingUrls: mockSetProcessingUrls,
      setResults: mockSetResults,
      setSummaryReport: mockSetSummaryReport,
      setErrorResults: mockSetErrorResults,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders Home component correctly', () => {
    render(<Home />);
  
    expect(screen.getByText('The Web Exploration Engine')).toBeDefined();
    expect(screen.getByText('Ready to start scraping?')).toBeDefined();
    expect(screen.getByText('Start by entering the URLs of the websites you wish to scrape')).toBeDefined();
    expect(screen.getByText('Start scraping')).toBeDefined();
  });

  it('shows error when URL input is empty and Start scraping is clicked', async () => {
    render(<Home />);

    fireEvent.click(screen.getByTestId('btn-start-scraping'));

    await waitFor(() => {
      expect(screen.getByText('URL cannot be empty')).toBeDefined();
    });
  });

  it('shows error for invalid URL', async () => {
    render(<Home />);

    fireEvent.change(screen.getByPlaceholderText(/Enter the URLs you want to scrape/i), {
      target: { value: 'invalid-url' },
    });

    fireEvent.click(screen.getByTestId('btn-start-scraping'));

    await waitFor(() => {
      expect(screen.getByText('Please enter valid URLs')).toBeDefined();
    });
  });

  it('shows error when URL contains special characters', async () => {
    render(<Home />);

    fireEvent.change(screen.getByPlaceholderText(/Enter the URLs you want to scrape/i), {
      target: { value: 'http://example.com/<script>' },
    });

    fireEvent.click(screen.getByTestId('btn-start-scraping'));

    await waitFor(() => {
      expect(screen.getByText('URLs cannot contain special characters like <, >, ", \', `, ;, (, or )')).toBeDefined();
    });
  });

  it('shows error when more than 10 URLs are provided', async () => {
    const longUrlList = Array.from({ length: 11 }, (_, i) => `http://example${i}.com`).join(',');

    render(<Home />);

    fireEvent.change(screen.getByPlaceholderText(/Enter the URLs you want to scrape/i), {
      target: { value: longUrlList },
    });

    fireEvent.click(screen.getByTestId('btn-start-scraping'));

    await waitFor(() => {
      expect(screen.getByText('Maximum of 10 URLs can be scraped')).toBeDefined();
    });
  });

  it('shows error when URL exceeds maximum length', async () => {
    const longUrl = 'http://example.com/'.padEnd(2049, 'x');

    render(<Home />);

    fireEvent.change(screen.getByPlaceholderText(/Enter the URLs you want to scrape/i), {
      target: { value: longUrl },
    });

    fireEvent.click(screen.getByTestId('btn-start-scraping'));

    await waitFor(() => {
      expect(screen.getByText(`URL exceeds maximum length of 2048 characters`)).toBeDefined();
    });
  });

  it('sanitizes URLs and proceeds with scraping', async () => {
    render(<Home />);

    const validUrl = 'http://example.com';
    fireEvent.change(screen.getByPlaceholderText(/Enter the URLs you want to scrape/i), {
      target: { value: validUrl },
    });
    
    fireEvent.click(screen.getByTestId('btn-start-scraping'));

    await waitFor(() => {
      expect(mockSetUrls).toHaveBeenCalledWith([validUrl]);
      expect(useRouter().push).toHaveBeenCalledWith('/scraperesults');
    });
  });

});
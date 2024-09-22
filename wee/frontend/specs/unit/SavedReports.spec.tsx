/* eslint-disable @typescript-eslint/no-empty-function */
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SavedReports from '../../src/app/(pages)/savedreports/page';
import { useUserContext } from '../../src/app/context/UserContext';
import { getReports, deleteReport } from '../../src/app/services/SaveReportService';
import { useRouter } from 'next/navigation';
import '@testing-library/jest-dom';
import { createClient } from '../../src/app/utils/supabase/client';

// import mocks
import { mockReports } from '../../src/mocks/reportMocks';
import { mockSummaries } from '../../src/mocks/reportMocks';

jest.mock('../../src/app/utils/supabase/client', () => ({
  createClient: jest.fn(),
}));

jest.mock('next/headers', () => ({
  cookies: jest.fn(),
}));

const mockSupabaseClient = {
  auth: {
    signInWithPassword: jest.fn(),
    signInWithOAuth: jest.fn(),
    signUp: jest.fn(),
    getUser: jest.fn(),
    resetPasswordForEmail: jest.fn(),
    updateUser: jest.fn(),
  },
  from: jest.fn(() => ({
    select: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
  })),
};

(createClient as jest.Mock).mockReturnValue(mockSupabaseClient);

jest.mock('../../src/app/services/SaveReportService');
jest.mock('../../src/app/context/UserContext');
jest.mock('next/navigation', () => ({
  useSearchParams: jest.fn(),
  useRouter: jest.fn(),
}));

describe('SavedReports Page', () => { 

  beforeEach(() => {
    (useUserContext as jest.Mock).mockReturnValue({
      user: { uuid: "1ad80d59-e8b1-426c-8254-4cb96abc4857", emailVerified: true },
      results: mockReports, // Mocked reports should be set here
      setResults: jest.fn(),
      summaries: [], // Mocked summaries can be set if needed
      setSummaries: jest.fn(),
    });
    
    (useRouter as jest.Mock).mockReturnValue({
      push: jest.fn(),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('fetches reports on mount', async () => {
    (getReports as jest.Mock).mockResolvedValue(mockReports);
    const { getByText } = render(<SavedReports />);
    await waitFor(() => expect(getReports).toHaveBeenCalledTimes(1));

    expect(getByText('Test Report')).toBeDefined();
  });

  it('handles pagination correctly on results page', async () => {
    // Render the SavedReports component with mocked reports and pagination controls
    const { getByText, getByLabelText } = render(<SavedReports />);

    // Mock getReports to resolve with mockReports
    (getReports as jest.Mock).mockResolvedValue(mockReports);

    // Ensure initial page is loaded correctly
    await waitFor(() => expect(getReports).toHaveBeenCalledTimes(1));
    expect(getByText('Test Report')).toBeDefined();

    // Change page and verify the change
    fireEvent.change(getByLabelText('Number of results per page'), { target: { value: '2' } });
    await waitFor(() => expect(getByText('Test Report')).toBeDefined());
  });

  it('handles pagination correctly on summaries page', async () => {

    const mockPush = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });

    (useUserContext as jest.Mock).mockReturnValue({
      user: { uuid: "48787157-7555-4104-bafc-e2c95bbaa959", emailVerified: true },
      results: [], // Mocked reports should be set here
      setResults: jest.fn(),
      summaries: mockSummaries, // Mocked summaries can be set if needed
      setSummaries: jest.fn(),
    });

    const { getByText, getByLabelText } = render(<SavedReports />);
    await waitFor(() => expect(getReports).toHaveBeenCalledTimes(1));
    // navigate to summaries page

    const summaries = screen.getByText('Summaries');
    fireEvent.click(summaries);

    // Mock getReports to resolve with mockReports
    (getReports as jest.Mock).mockResolvedValue(mockReports);

    // Ensure initial page is loaded correctly
    await waitFor(() => expect(getReports).toHaveBeenCalledTimes(1));
    expect(getByText('Test Summary')).toBeDefined();

    // Change page and verify the change
    fireEvent.change(getByLabelText('Number of results per page'), { target: { value: '2' } });
    await waitFor(() => expect(getByText('Test Summary')).toBeDefined());
  });
  
  it('deletes a report correctly', async () => {
    // Mock deleteReport to resolve successfully
    (deleteReport as jest.Mock).mockResolvedValueOnce();

    // Render the SavedReports component with mocked reports
    const { getByText, getByTestId } = render(<SavedReports />);
    await waitFor(() => expect(getReports).toHaveBeenCalledTimes(1));

    // Click delete button
    fireEvent.click(getByTestId('btnDelete0'));

    // Confirm delete and check if deleteReport is called with correct ID
    fireEvent.click(getByText('Yes'));
    await waitFor(() => expect(deleteReport).toHaveBeenCalledWith(mockReports[0].id));

    // Ensure fetchReports is called after deletion
    expect(getReports).toHaveBeenCalledTimes(2); // Check the correct number of calls
  });

  it ('deletes a summary correctly', async () => {
    // Mock deleteReport to resolve successfully
    (deleteReport as jest.Mock).mockResolvedValueOnce();

    (useUserContext as jest.Mock).mockReturnValue({
      user: { uuid: "48787157-7555-4104-bafc-e2c95bbaa959", emailVerified: true },
      results: [], // Mocked reports should be set here
      setResults: jest.fn(),
      summaries: mockSummaries, // Mocked summaries can be set if needed
      setSummaries: jest.fn(),
    });

    // Render the SavedReports component with mocked reports
    const { getByText, getByTestId } = render(<SavedReports />);
    await waitFor(() => expect(getReports).toHaveBeenCalledTimes(1));
    // navigate to summaries page

    const summaries = screen.getByText('Summaries');
    fireEvent.click(summaries);

    // Click delete button
    fireEvent.click(getByTestId('btnDelete0'));

    // Confirm delete and check if deleteReport is called with correct ID
    fireEvent.click(getByText('Yes'));
    await waitFor(() => expect(deleteReport).toHaveBeenCalledWith(mockSummaries[0].id));

    // Ensure fetchReports is called after deletion
    expect(getReports).toHaveBeenCalledTimes(2); // Check the correct number of calls
  });
  
  it ('navigates to results page when clicking on a report', async () => {
    const mockPush = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });

    const { getByText } = render(<SavedReports />);
    await waitFor(() => expect(getReports).toHaveBeenCalledTimes(1));

    fireEvent.click(getByText('Test Report'));
    expect(mockPush).toHaveBeenCalledWith('/savedresults?id=0');
  });

  it ('navigates to summaries page when clicking on a summary', async () => {
    const mockPush = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });

    (useUserContext as jest.Mock).mockReturnValue({
      user: { uuid: "48787157-7555-4104-bafc-e2c95bbaa959", emailVerified: true },
      results: [], // Mocked reports should be set here
      setResults: jest.fn(),
      summaries: mockSummaries, // Mocked summaries can be set if needed
      setSummaries: jest.fn(),
    });

    const { getByText } = render(<SavedReports />);
    await waitFor(() => expect(getReports).toHaveBeenCalledTimes(1));
    // navigate to summaries page

    const summaries = screen.getByText('Summaries');
    fireEvent.click(summaries);
    
    fireEvent.click(getByText('Test Summary'));
    expect(mockPush).toHaveBeenCalledWith('/savedsummaries?id=1');
  });

  it ('should print an error if there is no user', async () => {
    (useUserContext as jest.Mock).mockReturnValue({
      user: null,
      results: [],
      setResults: jest.fn(),
      summaries: [],
      setSummaries: jest.fn(),
    });

    // check for console.error
    // Assuming you have a specific error message you expect to be logged
    const expectedErrorMessage = 'User not found';

    // Spy on console.error
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    // Render your component
    render(<SavedReports />);

    // Check if console.error was called
    expect(errorSpy).toHaveBeenCalled();

    // Check for specific error message
    expect(errorSpy).toHaveBeenCalledWith(expect.stringContaining(expectedErrorMessage));

    // Restore the original console.error
    errorSpy.mockRestore();
  });
});
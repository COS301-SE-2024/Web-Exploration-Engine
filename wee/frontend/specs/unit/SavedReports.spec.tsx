import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import SavedReports from '../../src/app/(pages)/savedreports/page';
import { useUserContext } from '../../src/app/context/UserContext';
import { getReports, deleteReport } from '../../src/app/services/SaveReportService';

jest.mock('../../src/app/services/SaveReportService');
jest.mock('../../src/app/context/UserContext');
jest.mock('next/navigation', () => ({
  useSearchParams: jest.fn(),
  useRouter: jest.fn(),
}));


describe('Saved Reports', () => {
  beforeEach(() => {
    // Mock user context

    (useUserContext as jest.Mock).mockReturnValue({
      user: { id: 1, username: 'testuser' },
      results: [],
      setResults: jest.fn(),
      summaries: [],
      setSummaries: jest.fn(),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('fetches reports on mount', async () => {
    const mockReports = [{ id: 1, reportName: 'Test Report', savedAt: '2024-07-12' }];
    (getReports as jest.Mock).mockResolvedValue(mockReports);

    render(<SavedReports />);
    await waitFor(() => expect(getReports).toHaveBeenCalledTimes(1));
  });
});

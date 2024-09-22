import { saveReport, getReports, deleteReport } from '../../src/app/services/SaveReportService';
import { createClient } from '../../src/app/utils/supabase/client';

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
  from: jest.fn().mockReturnThis(), // Mock from to return the same object (allowing chaining)
  insert: jest.fn(), // Mock insert to be chained after from
  select: jest.fn().mockReturnThis(), // Mock select for other tests
  eq: jest.fn().mockReturnThis(), // Mock eq to be used in chaining
  delete: jest.fn().mockReturnThis(), // Mock delete for delete tests
};

(createClient as jest.Mock).mockReturnValue(mockSupabaseClient);

describe('saveReport function', () => {

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should save a report successfully', async () => {
    // Mock successful insertion

    const report = {
      userId: 'user123',
      reportName: 'Test Report',
      reportData: { /* your report data */ },
      isSummary: false,
    };

    // Debugging: Check mockSupabase before calling saveReport
    mockSupabaseClient.insert.mockResolvedValueOnce({ data: [report], error: null });

    // Test if saveReport resolves without errors
    await expect(saveReport(report)).resolves.toBeUndefined();

  });

  it('should throw an error when saving fails', async () => {
    // Mock insertion failure

    const report = {
      reportName: 'Test Report',
      reportData: { /* your report data */ },
      isSummary: false,
    };

    // Test if saveReport rejects with an error
    await expect(saveReport(report)).rejects.toThrow();
  });
});

describe('getReports function', () => {
  const mockUser = { uuid: 'user123', emailVerified: true };

  afterEach(() => {
    jest.clearAllMocks(); // Clear mock function calls between tests
  });

  it('should retrieve reports successfully', async () => {
    const mockData = [
      { id: 1, user_id: 'user123', report_name: 'Report 1', report_data: {}, is_summary: false, saved_at: new Date() },
      { id: 2, user_id: 'user123', report_name: 'Report 2', report_data: {}, is_summary: true, saved_at: new Date() },
    ];
  
    const mockSelect = jest.spyOn(mockSupabaseClient, 'from').mockReturnValueOnce({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      fetch: jest.fn().mockResolvedValueOnce({ data: mockData }),
    });
  
    try {
      const reports = await getReports(mockUser);
      // console.log('Reports:', reports); // Inspect the actual reports fetched
      // expect(reports).toEqual(mockData);
      expect(mockSelect).toHaveBeenCalledWith('saved_reports');
    } catch (error) {
      console.error('Error:', error); // Log any errors thrown
      throw error; // Rethrow the error to fail the test explicitly
    }
  });
  
  it('should throw an error when user uuid is missing', async () => {
    const mockUser = { emailVerified: true };

    // Test if getReports rejects with an error due to missing user uuid
    await expect(getReports(mockUser)).rejects.toThrow('User id is required');
  });
});

describe('deleteReport function', () => {
  it('should delete a report successfully', async () => {
    const reportId = 1;

    // Mock successful deletion
    mockSupabaseClient.from().delete().eq.mockResolvedValueOnce({});

    await expect(deleteReport(reportId)).resolves.toBeUndefined();
  });
});
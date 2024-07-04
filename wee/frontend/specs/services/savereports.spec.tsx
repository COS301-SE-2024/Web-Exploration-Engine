import { saveReport, getReports, deleteReport } from '../../src/app/services/SaveReportService';
import { getSupabase } from '../../src/app/utils/supabase_service_client';

jest.mock('../../src/app/utils/supabase_service_client', () => {
  const mockFrom = jest.fn().mockReturnThis();
  const mockSelect = jest.fn().mockReturnThis();
  const mockEq = jest.fn().mockReturnThis();
  const mockInsert = jest.fn().mockReturnThis();
  const mockDelete = jest.fn().mockReturnThis();
  const mockFetch = jest.fn().mockResolvedValue({ data: [] }); // Adjust this mock data as needed

  const mockSupabase = {
    from: mockFrom,
    select: mockSelect,
    eq: mockEq,
    insert: mockInsert,
    delete: mockDelete,
    fetch: mockFetch,

  };
  return {
    getSupabase: jest.fn(() => mockSupabase),
  };
});

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
  
    const mockSelect = jest.spyOn(getSupabase(), 'from').mockReturnValueOnce({
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
    getSupabase().from().delete().eq.mockResolvedValueOnce({});

    await expect(deleteReport(reportId)).resolves.toBeUndefined();
  });
});
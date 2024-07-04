import { saveReport, getReports, deleteReport } from '../../src/app/services/SaveReportService';
import { AuthResponse } from '../../src/app/models/AuthModels';
import { ReportRecord } from '../../src/app/models/ReportModels'
import { getSupabase } from '../../src/app/utils/supabase_service_client';

jest.mock('../../src/app/utils/supabase_service_client');
const mockedGetSupabase = getSupabase as jest.Mock;

const supabase = {
  from: jest.fn(() => supabase),
  insert: jest.fn(),
  select: jest.fn(),
  eq: jest.fn(),
  delete: jest.fn(),
};

jest.mock('../../src/app/context/ScrapingContext', () => ({
  useScrapingContext: jest.fn(),
}));

mockedGetSupabase.mockReturnValue(supabase);

describe('reportService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('saveReport', () => {
    it('should save a report successfully', async () => {
      supabase.insert.mockResolvedValue({ error: null });

      const report: ReportRecord = {
        userId: 'user1',
        reportName: 'Test Report',
        reportData: { data: 'test' },
        isSummary: false,
        savedAt: new Date(),
      };

      await expect(saveReport(report)).resolves.not.toThrow();
      expect(supabase.from).toHaveBeenCalledWith('saved_reports');
      expect(supabase.insert).toHaveBeenCalledWith([
        {
          user_id: report.userId,
          report_name: report.reportName,
          report_data: report.reportData,
          is_summary: report.isSummary,
          saved_at: expect.any(Date),
        },
      ]);
    });

    it('should throw an error if saving a report fails', async () => {
      supabase.insert.mockResolvedValue({ error: { message: 'Insert error' } });

      const report: ReportRecord = {
        userId: 'user1',
        reportName: 'Test Report',
        reportData: { data: 'test' },
        isSummary: false,
        savedAt: new Date(),
      };

      await expect(saveReport(report)).rejects.toThrow('Insert error');
    });
  });

  describe('getReports', () => {
    it('should fetch reports successfully', async () => {
      const mockReports = [
        {
          id: 1,
          user_id: 'user1',
          report_name: 'Report 1',
          report_data: { data: 'test' },
          is_summary: false,
          saved_at: '2023-01-01T00:00:00.000Z',
        },
      ];

      supabase.select.mockResolvedValue({ data: mockReports, error: null });
      supabase.eq.mockReturnValue(supabase);

      const user: AuthResponse = { uuid: 'user1' };
      const reports = await getReports(user);

      expect(supabase.from).toHaveBeenCalledWith('saved_reports');
      expect(supabase.select).toHaveBeenCalledWith('*');
      expect(supabase.eq).toHaveBeenCalledWith('user_id', user.uuid);
      expect(reports).toEqual([
        {
          id: 1,
          userId: 'user1',
          reportName: 'Report 1',
          reportData: { data: 'test' },
          isSummary: false,
          savedAt: '2023-01-01T00:00:00.000Z',
        },
      ]);
    });

    it('should throw an error if fetching reports fails', async () => {
      supabase.select.mockResolvedValue({ data: null, error: { message: 'Select error' } });
      supabase.eq.mockReturnValue(supabase);

      const user: AuthResponse = { uuid: 'user1' };
      await expect(getReports(user)).rejects.toThrow('Select error');
    });

    it('should throw an error if user id is missing', async () => {
      const user: AuthResponse = { uuid: '' };
      await expect(getReports(user)).rejects.toThrow('User id is required');
    });
  });

  describe('deleteReport', () => {
    it('should delete a report successfully', async () => {
      supabase.delete.mockResolvedValue({ error: null });
      supabase.eq.mockReturnValue(supabase);

      const reportId = 1;
      await expect(deleteReport(reportId)).resolves.not.toThrow();
      expect(supabase.from).toHaveBeenCalledWith('saved_reports');
      expect(supabase.delete).toHaveBeenCalled();
      expect(supabase.eq).toHaveBeenCalledWith('id', reportId);
    });

    it('should throw an error if deleting a report fails', async () => {
      supabase.delete.mockResolvedValue({ error: { message: 'Delete error' } });
      supabase.eq.mockReturnValue(supabase);

      const reportId = 1;
      await expect(deleteReport(reportId)).rejects.toThrow('Delete error');
    });
  });
});

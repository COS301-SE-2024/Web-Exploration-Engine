import { AuthResponse } from "../models/AuthModels";
import { getSupabase } from '../utils/supabase_service_client';
import { ReportRecord } from "../models/ReportModels"

const supabase = getSupabase();

export async function saveReport(report: ReportRecord) {

  if (!report.userId) throw new Error('User id is required');
  if (!report.reportName) throw new Error('Report name is required');
  if (!report.reportData) throw new Error('Report data is required');


  const { error } = await supabase
    .from('saved_reports')
    .insert([
      {
        user_id: report.userId,
        report_name: report.reportName,
        report_data: report.reportData,
        is_summary: report.isSummary,
        saved_at: new Date(),
      }
    ])

  if (error) {
    throw new Error(error.message);
  }
}

export async function getReports(user: AuthResponse): Promise<ReportRecord[]> {
  if (!user.uuid) throw new Error('User id is required');

  const { data, error } = await supabase
    .from('saved_reports')
    .select('*')
    .eq('user_id', user.uuid);

  if (error) {
    throw new Error(error.message);
  }

  if(!data) return [];

  // Map the fetched data to ReportRecord type
  const mappedReports = data.map((report: any) => ({
    id: report.id,
    userId: report.user_id,
    reportName: report.report_name,
    reportData: report.report_data,
    isSummary: report.is_summary,
    savedAt: report.saved_at,
  }));

  return mappedReports;
}

export async function deleteReport(reportId: number) {
  const { error } = await supabase
    .from('saved_reports')
    .delete()
    .eq('id', reportId);

  if (error) {
    throw new Error(error.message);
  }
}

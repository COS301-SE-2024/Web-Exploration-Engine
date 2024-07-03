import { AuthResponse } from "../models/AuthModels";
import { getSupabase } from '../utils/supabase_service_client';
import { ReportRecord } from "../models/ReportModels"

const supabase = getSupabase();

export async function saveReport(report: ReportRecord, user: AuthResponse) {

  // const { error } = await supabase
  //   .from('saved_reports')
  //   .insert(report)

  // if (error) {
  //   throw new Error(error.message);
  // }
}

export async function getReports(user: AuthResponse): Promise<ReportRecord[]> {
  if (!user.uuid) throw new Error('User id is required');

  const { data: reports, error } = await supabase
    .from('saved_reports')
    .select('*')
    .eq('user_id', user.uuid);

  if (error) {
    throw new Error(error.message);
  }

  // Map the fetched data to ReportRecord type
  const mappedReports = reports.map((report: any) => ({
    reportId: report.id,
    userId: report.user_id,
    reportName: report.report_name,
    reportData: report.report_data,
    isSummary: report.is_summary,
    savedAt: report.saved_at,
  }));

  return mappedReports;
}

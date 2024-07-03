import { User } from "../models/AuthModels";
import { supabase } from '../utils/supabase_service_client';
import { ReportRecord } from "../models/ReportModels";

export async function saveReport(report: ReportRecord, user: User) {
  const { error } = await supabase
    .from('saved_reports')
    .insert(report)

  if (error) {
    throw new Error(error.message);
  }
}

export async function getReports(user: User): Promise<ReportRecord[]> {
  if(!user.id) throw new Error('User id is required');
  const { data: reports, error } = await supabase
    .from('saved_reports')
    .select('*')
    .eq('user_id', user.id)

  if (error) {
    throw new Error(error.message);
  }

  return reports || [];
}


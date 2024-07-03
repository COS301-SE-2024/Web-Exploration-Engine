export interface ReportRecord {
  id?: number;
  userId?: number;
  reportName: string;
  reportData: string;
  isSummary: boolean;
  savedAt?: string;
}
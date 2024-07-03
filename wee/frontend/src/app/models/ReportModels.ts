import { ScraperResult, Summary } from "./ScraperModels";
export interface ReportRecord {
  id?: number;
  userId?: string;
  reportName: string;
  reportData: ScraperResult | Summary;
  isSummary: boolean;
  savedAt?: string;
}

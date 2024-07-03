import React, { useState, ReactNode } from "react";
import ScrapingContext from "../context/ScrapingContext";
import Scraping from "../models/ScrapingModel";
import { Summary } from "../models/ScraperModels";
import { ReportRecord } from "../models/ReportModels";

export const ScrapingProvider = ({children} : {children: ReactNode}) => {
    const [results, setResults] = useState<Scraping[]>([]);
    const [urls, setUrls] = useState<string[]>(['']);
    const [summaryReport, setSummaryReport] = useState<Summary>({} as Summary);
    const [processedUrls, setProcessedUrls] = useState<string[]>([]);
    const [processingUrls, setProcessingUrls] = useState<string[]>([]);
    const [savedReports, setSavedReports] = useState<ReportRecord[]>([]);
    

    return (
        <ScrapingContext.Provider value={{
            results, setResults, 
            urls, setUrls, 
            summaryReport, setSummaryReport, 
            processedUrls, setProcessedUrls, 
            processingUrls, setProcessingUrls, 
            savedReports, setSavedReports,
            }}>
            {children}
        </ScrapingContext.Provider>
    )
}
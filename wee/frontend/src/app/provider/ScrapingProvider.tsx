import React, { useState, ReactNode } from "react";
import ScrapingContext from "../context/ScrapingContext";
import { Summary, ScraperResult } from "../models/ScraperModels";

export const ScrapingProvider = ({children} : {children: ReactNode}) => {
    const [results, setResults] = useState<ScraperResult[]>([]);
    const [urls, setUrls] = useState<string[]>(['']);
    const [summaryReport, setSummaryReport] = useState<Summary>({} as Summary);
    const [processedUrls, setProcessedUrls] = useState<string[]>([]);
    const [processingUrls, setProcessingUrls] = useState<string[]>([]);
    const test = 'Test the context';

    return (
        <ScrapingContext.Provider value={{
            results, setResults, 
            urls, setUrls, 
            summaryReport, setSummaryReport, 
            processedUrls, setProcessedUrls, 
            processingUrls, setProcessingUrls 
            }}>
            {children}
        </ScrapingContext.Provider>
    )
}
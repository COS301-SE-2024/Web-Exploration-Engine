import React, { useState, ReactNode } from "react";
import ScrapingContext from "../context/ScrapingContext";
import { Summary, ScraperResult, ErrorResponse, UndefinedResponse } from "../models/ScraperModels";

export const ScrapingProvider = ({children} : {children: ReactNode}) => {
    const [results, setResults] = useState<ScraperResult[]>([]);
    const [errorResults, setErrorResults] = useState<ErrorResponse[]>([]);
    const [undefinedResults, setUndefinedResults] = useState<UndefinedResponse[]>([]);
    const [urls, setUrls] = useState<string[]>(['']);
    const [summaryReport, setSummaryReport] = useState<Summary>({} as Summary);
    const [processedUrls, setProcessedUrls] = useState<string[]>([]);
    const [processingUrls, setProcessingUrls] = useState<string[]>([]);

    return (
        <ScrapingContext.Provider value={{
                results, setResults, 
                errorResults, setErrorResults,
                undefinedResults, setUndefinedResults,
                urls, setUrls, 
                summaryReport, setSummaryReport, 
                processedUrls, setProcessedUrls, 
                processingUrls, setProcessingUrls,
            }}>
            {children}
        </ScrapingContext.Provider>
    )
}
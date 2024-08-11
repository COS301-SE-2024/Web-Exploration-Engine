import { createContext, useContext } from "react";
import { Summary, ScraperResult, ErrorResponse } from "../models/ScraperModels";

interface ScrapingContextType {
    results: ScraperResult[];
    setResults: (update: (prevResults: ScraperResult[]) => ScraperResult[]) => void;
    errorResults: ErrorResponse[];
    setErrorResults: (update: (prevResults: ErrorResponse[]) => ErrorResponse[]) => void;
    urls: string[];
    setUrls: (data: string[]) => void;
    processingUrls: string[];
    setProcessingUrls: (data: string[]) => void;
    processedUrls: string[];
    setProcessedUrls: (data: string[]) => void;
    summaryReport: Summary;
    setSummaryReport: (data: Summary) => void;
}

const ScrapingContext = createContext<ScrapingContextType | undefined>(undefined);

export const useScrapingContext = () => {
    const context = useContext(ScrapingContext);
    if (!context) {
        throw new Error("useScrapingContext must be used within a ScrapingProvider");
    }
    return context;
};

export default ScrapingContext;
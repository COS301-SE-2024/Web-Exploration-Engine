import { createContext, useContext } from "react";
import Scraping from "../models/ScrapingModel";
import { Summary } from "../models/ScraperModels";

interface ScrapingContextType {
    results: Scraping[];
    setResults: (update: (prevResults: Scraping[]) => Scraping[]) => void;
    urls: string[];
    setUrls: (data: string[]) => void;
    processingUrls: string[];
    setProcessingUrls: (data: string[]) => void;
    processedUrls: string[];
    setProcessedUrls: (data: string[]) => void;
    summaryReport: Summary;
    setSummaryReport: (data: Summary) => void;
    comparisonIndexes: any[];
    setComparisonIndexes: (data: any[]) => void;
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
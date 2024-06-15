import { createContext, useContext } from "react";
import Scraping from "../models/ScrapingModel";

interface ScrapingContextType {
    results: Scraping[];
    setResults: (data: Scraping[]) => void;
    urls: string[];
    setUrls: (data: string[]) => void;
    test: string;
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
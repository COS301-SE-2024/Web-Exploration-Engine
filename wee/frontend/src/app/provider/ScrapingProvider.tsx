import React, { useState, ReactNode } from "react";
import ScrapingContext from "../context/ScrapingContext";
import Scraping from "../models/ScrapingModel";

export const ScrapingProvider = ({children} : {children: ReactNode}) => {
    const [results, setResults] = useState<Scraping[]>([]);
    const [urls, setUrls] = useState<string[]>(['']);
    const test = 'Test the context';

    return (
        <ScrapingContext.Provider value={{results, setResults, urls, setUrls, test}}>
            {children}
        </ScrapingContext.Provider>
    )
}
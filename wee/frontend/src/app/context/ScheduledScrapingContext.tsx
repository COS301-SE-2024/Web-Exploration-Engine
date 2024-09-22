import { createContext, useContext } from "react";
import { GetSchedulesResponse } from "../models/ScheduleModels";

interface SceduledScrapingContextType {
    scheduledScrapeResponse: GetSchedulesResponse[],
    // setScheduledScrapeResponse: (update: (prevScheduledScrapeResults: GetSchedulesResponse[]) => GetSchedulesResponse[]) => void;
    setScheduledScrapeResponse: (data: GetSchedulesResponse[]) => void;
}

const ScheduledScrapeContext = createContext<SceduledScrapingContextType | undefined>(undefined);

export const useScheduledScrapeContext = () => {
    const context = useContext(ScheduledScrapeContext);
    if (!context) {
        throw new Error("useScheduledScrapeContext must be used within a ScheduledScrapeProvider");
    }
    return context;
}

export default ScheduledScrapeContext;
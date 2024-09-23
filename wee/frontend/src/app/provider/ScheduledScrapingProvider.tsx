import React, { useState, ReactNode } from "react";
import ScheduledScrapeContext from "../context/ScheduledScrapingContext";
import { GetSchedulesResponse } from "../models/ScheduleModels";

export const ScheduledScrapeProvider = ({children} : {children: ReactNode}) => {
    const [scheduledScrapeResponse, setScheduledScrapeResponse] = useState<GetSchedulesResponse[]>([]);
    return (
        <ScheduledScrapeContext.Provider value={{
            scheduledScrapeResponse, setScheduledScrapeResponse
        }}>
            {children}
        </ScheduledScrapeContext.Provider>
    )
}
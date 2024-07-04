import { createContext, useContext } from "react";
import { AuthResponse } from "../models/AuthModels";
import { ReportRecord } from "../models/ReportModels";

interface UserConextType   {
    user: AuthResponse | null;
    setUser: (user: AuthResponse | null) => void;
    results: ReportRecord[];
    setResults: (results: ReportRecord[]) => void;
    summaries: ReportRecord[];
    setSummaries: (summaries: ReportRecord[]) => void;
}

const UserConext = createContext<UserConextType | undefined>(undefined);

export const useUserContext = () => {
    const context = useContext(UserConext);
    if (!context) {
        throw new Error("useScrapingContext must be used within a ScrapingProvider");
    }
    return context;
};

export default UserConext;
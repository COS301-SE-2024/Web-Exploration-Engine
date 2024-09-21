import React, { useState, ReactNode } from "react";
import UserConext from "../context/UserContext";
import { AuthResponse } from "../../models/AuthModels";
import { ReportRecord } from "../../models/ReportModels";

export const UserProvider = ({children} : {children: ReactNode}) => {
    const [user, setUser] = useState<AuthResponse | null>(null);
    const [results, setResults] = useState<ReportRecord[]>([]);
    const [summaries, setSummaries] = useState<ReportRecord[]>([])

    return (
        <UserConext.Provider value={{user, setUser, results, setResults, summaries, setSummaries}}>
            {children}
        </UserConext.Provider>
    )
}
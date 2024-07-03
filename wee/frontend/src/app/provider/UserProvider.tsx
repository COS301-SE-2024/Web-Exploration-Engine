import React, { useState, ReactNode } from "react";
import UserConext from "../context/UserContext";
import { AuthResponse } from "../models/AuthModels";

export const UserProvider = ({children} : {children: ReactNode}) => {
    const [user, setUser] = useState<AuthResponse | null>(null);

    return (
        <UserConext.Provider value={{user, setUser}}>
            {children}
        </UserConext.Provider>
    )
}
import { createContext, useContext } from "react";
import { AuthResponse } from "../models/AuthModels";

interface UserConextType   {
    user: AuthResponse | null;
    setUser: (user: AuthResponse | null) => void;
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
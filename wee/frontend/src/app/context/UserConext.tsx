import { createContext, useContext } from "react";
import { AuthResponse } from "../models/AuthModels";

interface UserContextType {
    
    user: AuthResponse | null;
    setUser: (data: AuthResponse | null) => void;
    handleSignOut: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUserContext = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error("useUserContext must be used within a UserProvider");
    }
    return context;
};

export default UserContext;
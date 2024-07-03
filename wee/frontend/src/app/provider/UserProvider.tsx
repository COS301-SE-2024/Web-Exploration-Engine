import React, { useState, ReactNode, useEffect } from "react";
import UserContext from "../context/UserConext";
import { AuthResponse } from "../models/AuthModels";
import { getSupabaseClient } from "../utils/supabase_anon_client";

export const UserProvider = ({children} : {children: ReactNode}) => {
    const [user, setUser] = useState<AuthResponse | null>(null);
    const supabase = getSupabaseClient();
    const checkAuth = async () => {
        const { data, error } = await supabase.auth.getUser();
        if (error) {
            console.error('Error fetching user session:', error);
            return;
        }
        if (data && data.user) {
            // if email is verified, set the user in the context
            if (data.user.email_confirmed_at) {
                setUser({
                    uuid: data.user.id,
                    emailVerified: true,
                });
            }
            else {
                setUser(null); // if email is not verified, set user to null
            }
        } else {
            setUser(null);
        }
    };

    const handleSignOut = async () => {
        try {
            await supabase.auth.signOut();
            setUser(null);
        } catch (error) {
            console.error("Error signing out:", error);
        }
    }

    useEffect(() => {
        checkAuth();
    }, []);

    return (
        <UserContext.Provider value={{ user, setUser, handleSignOut }}>
            {children}
        </UserContext.Provider>
    );
}
'use client'
import { ThemeProvider } from "next-themes"
import { ScrapingProvider } from "./provider/ScrapingProvider"
import { UserProvider } from "./provider/UserProvider"

export function Providers({children}: {children: React.ReactNode}) {
    return (
        <UserProvider>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
                <ScrapingProvider>
                    {children}
                </ScrapingProvider>
            </ThemeProvider>
        </UserProvider>
    )
}
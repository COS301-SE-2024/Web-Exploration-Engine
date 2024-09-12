'use client'
import { ThemeProvider } from "next-themes"
import { ScrapingProvider } from "./provider/ScrapingProvider"
import { UserProvider } from "./provider/UserProvider"
import { ScheduledScrapeProvider } from "./provider/ScheduledScrapingProvider"

export function Providers({children}: {children: React.ReactNode}) {
    return (
        <UserProvider>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
                <ScrapingProvider>
                    <ScheduledScrapeProvider>
                        {children}
                    </ScheduledScrapeProvider>
                </ScrapingProvider>
            </ThemeProvider>
        </UserProvider>
    )
}
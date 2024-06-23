'use client'
import { ThemeProvider } from "next-themes"
import { ScrapingProvider } from "./provider/ScrapingProvider"

export function Providers({children}: {children: React.ReactNode}) {
    return (
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <ScrapingProvider>
                {children}
            </ScrapingProvider>
        </ThemeProvider>
    )
}
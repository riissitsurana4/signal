'use client';
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";

export default function Provider({ children}) {
    return (
        <SessionProvider>
            <ThemeProvider attribute="class" defaultTheme="fall" enableSystem={true} storageKey="blip-theme" >
                {children}
            </ThemeProvider>
        </SessionProvider>
    )
}

'use client'
import "./global.css";
import { SessionProvider } from "next-auth/react";
{/*export const metadata = {
    title: "Blip:Messenger",
    description: "Messenger App",
};*/}

export default function RootLayout({ children }) {
    return (
        <SessionProvider>
        <html lang="en">
            <body>
                {children}
            </body>
        </html>
        </SessionProvider>
    );
}

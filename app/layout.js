import "./global.css";
import Provider from "./components/provider";
export const metadata = {
    title: "Blip:Messenger",
    description: "Messenger App",
};

export default function RootLayout({ children }) {
    return (
        <html lang="en" suppressHydrationWarning>
        <body>
        <Provider>{children}</Provider>
        </body>
        </html>
    );
}

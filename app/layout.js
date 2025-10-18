import "./global.css";
export const metadata = {
    title: "Blip:Messenger",
    description: "Messenger App",
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body>
                {children}
            </body>
        </html>
    );
}

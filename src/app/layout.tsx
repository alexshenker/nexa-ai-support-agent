import { Provider as ChakraProvider } from "@/components/ui/ChakraProvider";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "N3XA AI Support Agent",
    description: "An AI support agent for N3XA users",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body>
                <ChakraProvider>{children}</ChakraProvider>
            </body>
        </html>
    );
}

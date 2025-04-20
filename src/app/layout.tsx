import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navigation } from "../components/navigation";
import { Sidebar } from "../components/sidebar";
import { ThemeProvider } from "@/components/theme-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Reflectify",
  description: "Eine App für reflektiertes Lernen",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="de" suppressHydrationWarning>
      <body className={inter.className} style={{ overflow: 'hidden', height: '100vh', display: 'flex', flexDirection: 'column' }}>
        <ThemeProvider>
          <Navigation />
          <div style={{ flex: 1, display: 'flex', minHeight: 0 }}>
            <Sidebar />
            <div style={{ flex: 1, overflow: 'auto', padding: 0 }}>
              {children}
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}

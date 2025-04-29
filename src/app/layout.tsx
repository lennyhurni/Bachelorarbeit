import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import AppFrame from "@/components/AppFrame";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Reflectify",
  description: "Eine App für reflektiertes Lernen",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  // Check if user is authenticated - safely handle during build
  let session = null;
  try {
    const supabase = createClient();
    const { data } = await supabase.auth.getSession();
    session = data.session;
  } catch (error) {
    console.warn('Failed to get session, this may be expected during build:', error);
  }
  
  // Get the current path to determine if it's a public route
  // These should match with the public paths in middleware.ts
  const isPublicPath = (path: string) => {
    const publicPaths = ['/', '/login', '/register', '/auth/callback', '/auth/confirmed', '/auth/confirm', '/register/confirmation'];
    return publicPaths.some(publicPath => path === publicPath || path.startsWith(`${publicPath}/`));
  };

  // Use URL from the server's environment
  // Note: This is not available at build time - we're handling route logic in middleware.ts
  // So we're only using this for rendering purposes
  
  return (
    <html lang="de" suppressHydrationWarning>
      <body className={inter.className} style={{ overflow: 'auto', height: '100vh', display: 'flex', flexDirection: 'column' }}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {/* Use the AppFrame for all content - it will conditionally render navigation and sidebar */}
          <AppFrame>
            {children}
          </AppFrame>
        </ThemeProvider>
      </body>
    </html>
  );
}

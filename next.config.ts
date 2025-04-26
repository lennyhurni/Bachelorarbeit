/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Umgebungsvariablen für Build-Zeit
  env: {
    // Nur Platzhalter-Werte setzen, wenn sie nicht bereits definiert sind
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder-for-build.supabase.co',
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-for-build',
  },
  // Diese Option sollte auf Top-Level sein, nicht unter experimental
  skipTrailingSlashRedirect: true,
}

export default nextConfig
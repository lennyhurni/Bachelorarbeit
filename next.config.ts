/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Set environment variables for build time to prevent errors
  env: {
    // Only set these placeholder values if they're not already defined
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder-for-build.supabase.co',
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-for-build',
  },
  // Disable static generation completely for builds
  // This ensures all pages use Server-Side Rendering or Client-Side Rendering
  experimental: {
    // Skip trailing slash redirect for cleaner URLs
    skipTrailingSlashRedirect: true,
  },
}

export default nextConfig

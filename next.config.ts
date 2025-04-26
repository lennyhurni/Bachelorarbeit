/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Conditionally skip static generation for pages that need dynamic Supabase data
  // when environment variables are not available during build
  experimental: {
    // This only affects pages using getStaticProps, not App Router pages
    skipTrailingSlashRedirect: true,
    // If environment variables aren't available, we should avoid prerendering
    ppr: process.env.NEXT_PUBLIC_SUPABASE_URL ? false : true,
  },
}

export default nextConfig

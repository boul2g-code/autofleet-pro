/** @type {import('next').NextConfig} */
// v6.4 - full feature build
const nextConfig = {
  reactStrictMode: false,
  images: { unoptimized: true },
  experimental: { turbotrace: {} }
}
export default nextConfig

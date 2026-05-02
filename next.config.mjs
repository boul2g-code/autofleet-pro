/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['jspdf'],
  optimizeFonts: false,
  // Stripe is optional - loaded at runtime via require(), not at build time
  serverExternalPackages: ['stripe'],
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Don't bundle stripe at build time - it's loaded dynamically
      config.externals = [...(config.externals || []), 'stripe']
    }
    return config
  },
}

export default nextConfig

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://24.144.93.15:3333/:path*',
      },
    ]
  },
}

module.exports = nextConfig


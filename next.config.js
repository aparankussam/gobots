/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      { source: '/evidence-gap', destination: '/evidence-gap.html' },
    ]
  },
  async redirects() {
    return [
      { source: '/book', destination: '/walkthrough', permanent: true },
      {
        source: '/govtrace',
        destination: 'https://govtrace-ai.vercel.app',
        permanent: false,
      },
    ]
  },
}
module.exports = nextConfig

/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      { source: '/evidence-gap', destination: '/evidence-gap.html' },
    ]
  },
}
module.exports = nextConfig

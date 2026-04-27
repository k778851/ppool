import type { NextConfig } from 'next'

const isProd = process.env.NODE_ENV === 'production'
const isGhPages = process.env.DEPLOY_TARGET === 'ghpages'

const nextConfig: NextConfig = {
  output: isGhPages ? 'export' : undefined,
  basePath: isGhPages ? '/ppool' : '',
  trailingSlash: isGhPages,
  images: { unoptimized: true },
}

export default nextConfig

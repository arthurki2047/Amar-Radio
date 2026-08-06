
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'img.icons8.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: "https",
        hostname: "api.iconify.design",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "ais-dev-7tpkgczg3wg7zuxyxh3gs4-421294351092.asia-southeast1.run.app",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "i.pinimg.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.pinimg.com",
        port: "",
        pathname: "/**",
      }
    ],
  },
  devIndicators: {
    buildActivity: false,
  },
  experimental: {
    allowedDevOrigins: [
      '6000-firebase-amar-radio-web-1767286576611.cluster-73qgvk7hjjadkrjeyexca5ivva.cloudworkstations.dev',
      '9000-firebase-amar-radio-web-1767286576611.cluster-73qgvk7hjjadkrjeyexca5ivva.cloudworkstations.dev',
      '9002-firebase-amar-radio-web-1767286576611.cluster-73qgvk7hjjadkrjeyexca5ivva.cloudworkstations.dev',
      '*.cloudworkstations.dev'
    ]
  }
};

export default nextConfig;

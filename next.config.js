/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        serverActions: true,
    },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'cygnetv2.sccs.swarthmore.edu',
                port: '',
                pathname: '/photos/**',
            },
        ],
    },
}

module.exports = nextConfig
/** @type {import('next').NextConfig} */
const nextConfig = {
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

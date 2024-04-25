/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        loader: 'custom',
        loaderFile: './lib/imgloader.ts',
    },
}

module.exports = nextConfig

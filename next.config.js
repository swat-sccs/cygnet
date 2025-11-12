/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    loader: "custom",
    loaderFile: "./lib/imgloader.ts",
  },

  experimental: {
    serverActions: {
      bodySizeLimit: "50mb", // or whatever size you need
    },
  },

};

module.exports = nextConfig
